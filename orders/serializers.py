from rest_framework import serializers

from .models import PAYMENT_CHOICES, Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'unit_price', 'quantity', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'phone', 'address', 'payment_method', 'payment_method_display',
            'status', 'status_display', 'created_at', 'items', 'total',
        ]
        read_only_fields = ['id', 'status', 'status_display', 'created_at']

    def validate_payment_method(self, value):
        valid = {choice for choice, _ in PAYMENT_CHOICES}
        if value not in valid:
            raise serializers.ValidationError("Mode de paiement invalide.")
        return value
