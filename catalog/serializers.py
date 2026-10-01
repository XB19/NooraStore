from rest_framework import serializers

from .models import Category, Product, ProductImage


class CategoryMiniSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'product_count']

    def get_image(self, obj):
        request = self.context.get('request')
        if not obj.image:
            return None
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url

    def get_product_count(self, obj):
        return obj.product_count()


class CategorySerializer(CategoryMiniSerializer):
    children = CategoryMiniSerializer(many=True, read_only=True)

    class Meta(CategoryMiniSerializer.Meta):
        fields = CategoryMiniSerializer.Meta.fields + ['children']


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order']

    def get_image(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.image.url) if request else obj.image.url


class ProductCardSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    price_per_meter = serializers.ReadOnlyField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'slug', 'name', 'category', 'price', 'old_price',
            'price_per_meter', 'badge', 'main_image', 'is_favorite',
        ]

    def get_category(self, obj):
        return {'id': obj.category_id, 'name': obj.category.name, 'slug': obj.category.slug}

    def get_main_image(self, obj):
        img = obj.main_image
        if not img:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(img.url) if request else img.url

    def get_is_favorite(self, obj):
        return obj.id in self.context.get('favorite_ids', set())


class ProductDetailSerializer(ProductCardSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    description = serializers.CharField()
    length_m = serializers.DecimalField(max_digits=5, decimal_places=2, allow_null=True)

    class Meta(ProductCardSerializer.Meta):
        fields = ProductCardSerializer.Meta.fields + ['description', 'length_m', 'images']
