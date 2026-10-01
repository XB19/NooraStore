from rest_framework import serializers

from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    slug = serializers.SlugField(source='product.slug', read_only=True)
    name = serializers.CharField(source='product.name', read_only=True)
    category = serializers.CharField(source='product.category.name', read_only=True)
    unit_price = serializers.IntegerField(source='product.price', read_only=True)
    subtotal = serializers.ReadOnlyField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product_id', 'slug', 'name', 'category', 'unit_price', 'quantity', 'subtotal', 'image']

    def get_image(self, obj):
        img = obj.product.main_image
        if not img:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(img.url) if request else img.url


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    item_count = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count']
