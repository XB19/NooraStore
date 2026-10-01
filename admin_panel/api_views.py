from catalog.models import Category, Product, ProductImage
from django.db.models import ProtectedError
from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from orders.models import STATUS_CHOICES, Order
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from storefront.models import ContactMessage

from .serializers import (
    AdminCategorySerializer,
    AdminContactMessageSerializer,
    AdminOrderSerializer,
    AdminProductImageSerializer,
    AdminProductSerializer,
)


# ---------- dashboard ----------

class DashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.exclude(status='annulee').prefetch_related('items')
        revenue = sum(o.total for o in orders)
        recent_orders = Order.objects.select_related('user').prefetch_related('items')[:5]
        recent_messages = ContactMessage.objects.all()[:5]
        return Response({
            'total_orders': Order.objects.count(),
            'pending_orders': Order.objects.filter(status='en_attente').count(),
            'revenue': revenue,
            'active_products': Product.objects.filter(is_active=True).count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'recent_orders': AdminOrderSerializer(recent_orders, many=True).data,
            'recent_messages': AdminContactMessageSerializer(recent_messages, many=True).data,
        })


# ---------- products ----------

class ProductListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        products = Product.objects.select_related('category').prefetch_related('images')
        category_slug = request.GET.get('categorie', '')
        if category_slug:
            products = products.filter(category__slug=category_slug)
        query = request.GET.get('q', '').strip()
        if query:
            products = products.filter(name__icontains=query)
        ctx = {'request': request}
        return Response(AdminProductSerializer(products, many=True, context=ctx).data)

    def post(self, request):
        data = request.data.copy()
        if not data.get('slug'):
            data['slug'] = slugify(data.get('name', ''))
        serializer = AdminProductSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(AdminProductSerializer(product, context={'request': request}).data, status=status.HTTP_201_CREATED)


class ProductDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        return Response(AdminProductSerializer(product, context={'request': request}).data)

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        data = request.data.copy()
        if not data.get('slug'):
            data['slug'] = product.slug or slugify(data.get('name', product.name))
        serializer = AdminProductSerializer(product, data=data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(AdminProductSerializer(product, context={'request': request}).data)

    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        name = product.name
        try:
            product.delete()
        except ProtectedError:
            return Response(
                {'detail': (
                    f"Impossible de supprimer « {name} » : il fait partie de commandes déjà passées. "
                    "Désactivez-le plutôt (décochez « actif ») pour le retirer du site."
                )},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductImageListView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = AdminProductImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductImageDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk, image_id):
        image = get_object_or_404(ProductImage, pk=image_id, product_id=pk)
        serializer = AdminProductImageSerializer(image, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, image_id):
        image = get_object_or_404(ProductImage, pk=image_id, product_id=pk)
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------- categories ----------

class CategoryListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        categories = Category.objects.select_related('parent').prefetch_related('children')
        return Response(AdminCategorySerializer(categories, many=True, context={'request': request}).data)

    def post(self, request):
        data = request.data.copy()
        if not data.get('slug'):
            data['slug'] = slugify(data.get('name', ''))
        serializer = AdminCategorySerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(AdminCategorySerializer(category, context={'request': request}).data, status=status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        return Response(AdminCategorySerializer(category, context={'request': request}).data)

    def patch(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        data = request.data.copy()
        if not data.get('slug'):
            data['slug'] = category.slug or slugify(data.get('name', category.name))
        serializer = AdminCategorySerializer(category, data=data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(AdminCategorySerializer(category, context={'request': request}).data)

    def delete(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        name = category.name
        try:
            category.delete()
        except ProtectedError:
            return Response(
                {'detail': (
                    f"Impossible de supprimer « {name} » : des produits y sont encore rattachés. "
                    "Déplacez-les vers une autre catégorie d'abord."
                )},
                status=status.HTTP_409_CONFLICT,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


# ---------- orders ----------

class OrderListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.select_related('user').prefetch_related('items')
        status_filter = request.GET.get('statut', '')
        if status_filter:
            orders = orders.filter(status=status_filter)
        return Response({
            'orders': AdminOrderSerializer(orders, many=True).data,
            'status_choices': [{'value': v, 'label': l} for v, l in STATUS_CHOICES],
        })


class OrderDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        order = get_object_or_404(Order.objects.prefetch_related('items'), pk=pk)
        return Response(AdminOrderSerializer(order).data)

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        new_status = request.data.get('status')
        valid = {v for v, _ in STATUS_CHOICES}
        if new_status not in valid:
            return Response({'status': ['Statut invalide.']}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save(update_fields=['status'])
        return Response(AdminOrderSerializer(order).data)


# ---------- contact messages ----------

class MessageListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(AdminContactMessageSerializer(ContactMessage.objects.all(), many=True).data)


class MessageDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        message = get_object_or_404(ContactMessage, pk=pk)
        if not message.is_read:
            message.is_read = True
            message.save(update_fields=['is_read'])
        return Response(AdminContactMessageSerializer(message).data)

    def patch(self, request, pk):
        message = get_object_or_404(ContactMessage, pk=pk)
        if 'is_read' in request.data:
            message.is_read = bool(request.data['is_read'])
        else:
            message.is_read = not message.is_read
        message.save(update_fields=['is_read'])
        return Response(AdminContactMessageSerializer(message).data)

    def delete(self, request, pk):
        message = get_object_or_404(ContactMessage, pk=pk)
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
