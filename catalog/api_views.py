from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, Favorite, Product
from .serializers import CategorySerializer, ProductCardSerializer, ProductDetailSerializer


def _favorite_ids(user):
    if not user.is_authenticated:
        return set()
    return set(Favorite.objects.filter(user=user).values_list('product_id', flat=True))


def _breadcrumb(category):
    chain = category.breadcrumb()
    crumb = []
    for node in chain:
        is_last = node.pk == category.pk
        crumb.append({'label': node.name, 'slug': None if is_last else node.slug})
    return crumb


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.filter(parent__isnull=True)
        data = CategorySerializer(categories, many=True, context={'request': request}).data
        return Response(data)


class CategoryDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        child_ids = list(category.children.values_list('id', flat=True))
        products = (
            Product.objects.filter(Q(category=category) | Q(category_id__in=child_ids), is_active=True)
            .select_related('category')
            .prefetch_related('images')
        )
        ctx = {'request': request, 'favorite_ids': _favorite_ids(request.user)}
        return Response({
            'title': category.name,
            'crumb': _breadcrumb(category),
            'products': ProductCardSerializer(products, many=True, context=ctx).data,
        })


class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('q', '').strip()
        products = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
        if query:
            products = products.filter(Q(name__icontains=query) | Q(description__icontains=query))
            title = f'Résultats pour « {query} »'
        else:
            title = 'Tout le catalogue'
        ctx = {'request': request, 'favorite_ids': _favorite_ids(request.user)}
        return Response({
            'title': title,
            'crumb': [{'label': title, 'slug': None}],
            'products': ProductCardSerializer(products, many=True, context=ctx).data,
        })


class ProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        product = get_object_or_404(
            Product.objects.select_related('category').prefetch_related('images'),
            slug=slug, is_active=True,
        )
        related = (
            Product.objects.filter(category=product.category, is_active=True)
            .exclude(pk=product.pk)
            .prefetch_related('images')[:4]
        )
        ctx = {'request': request, 'favorite_ids': _favorite_ids(request.user)}
        return Response({
            'product': ProductDetailSerializer(product, context=ctx).data,
            'related': ProductCardSerializer(related, many=True, context=ctx).data,
            'crumb': _breadcrumb(product.category) + [{'label': product.name, 'slug': None}],
        })


class FavoritesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = (
            Product.objects.filter(favorited_by__user=request.user, is_active=True)
            .select_related('category')
            .prefetch_related('images')
        )
        ctx = {'request': request, 'favorite_ids': _favorite_ids(request.user)}
        return Response({
            'title': 'Mes favoris',
            'crumb': [{'label': 'Mes favoris', 'slug': None}],
            'products': ProductCardSerializer(products, many=True, context=ctx).data,
        })


class ToggleFavoriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        favorite, created = Favorite.objects.get_or_create(user=request.user, product=product)
        if not created:
            favorite.delete()
        return Response({'is_favorite': created}, status=status.HTTP_200_OK)
