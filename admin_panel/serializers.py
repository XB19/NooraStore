from catalog.models import Category, Product, ProductImage
from orders.models import Order, OrderItem
from rest_framework import serializers
from storefront.models import ContactMessage


class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'order']
        read_only_fields = ['id']


class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    price_per_meter = serializers.ReadOnlyField()
    main_image = serializers.SerializerMethodField()
    images = AdminProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name', 'description',
            'price', 'old_price', 'length_m', 'badge', 'is_active', 'is_featured',
            'price_per_meter', 'main_image', 'images', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def get_main_image(self, obj):
        img = obj.main_image
        if not img:
            return None
        request = self.context.get('request')
        return request.build_absolute_uri(img.url) if request else img.url


class AdminCategorySerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'parent_name', 'image', 'order', 'product_count']
        read_only_fields = ['id']
        extra_kwargs = {'slug': {'required': False, 'allow_blank': True}}

    def get_product_count(self, obj):
        return obj.product_count()


class AdminOrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'unit_price', 'quantity', 'subtotal']


class AdminOrderSerializer(serializers.ModelSerializer):
    items = AdminOrderItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'phone', 'address', 'payment_method', 'payment_method_display',
            'status', 'status_display', 'created_at', 'items', 'total', 'username',
        ]
        read_only_fields = ['id', 'created_at', 'full_name', 'phone', 'address', 'payment_method']


class AdminContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'is_read', 'created_at']
        read_only_fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
