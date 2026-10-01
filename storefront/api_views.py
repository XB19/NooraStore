from catalog.models import Category, Favorite, Product
from catalog.serializers import CategorySerializer, ProductCardSerializer
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactMessageSerializer


class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        favorite_ids = set()
        if request.user.is_authenticated:
            favorite_ids = set(Favorite.objects.filter(user=request.user).values_list('product_id', flat=True))
        ctx = {'request': request, 'favorite_ids': favorite_ids}

        top_categories = Category.objects.filter(parent__isnull=True)
        vetements = Category.objects.filter(slug='vetements').first()
        vetements_subcategories = vetements.children.all() if vetements else []

        products = (
            Product.objects.filter(is_active=True, is_featured=True)
            .select_related('category')
            .prefetch_related('images')
        )
        if not products.exists():
            products = (
                Product.objects.filter(is_active=True)
                .select_related('category')
                .prefetch_related('images')
                .order_by('-created_at')
            )
        featured_products = products[:6]

        return Response({
            'top_categories': CategorySerializer(top_categories, many=True, context=ctx).data,
            'vetements_subcategories': CategorySerializer(vetements_subcategories, many=True, context=ctx).data,
            'featured_products': ProductCardSerializer(featured_products, many=True, context=ctx).data,
        })


class ContactSubmitView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': "Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement."},
            status=status.HTTP_201_CREATED,
        )
