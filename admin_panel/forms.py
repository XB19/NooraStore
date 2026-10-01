from django import forms
from django.forms import inlineformset_factory

from catalog.models import Category, Product, ProductImage
from orders.models import Order


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = [
            "name", "slug", "category", "description",
            "price", "old_price", "length_m", "badge",
            "is_active", "is_featured",
        ]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Ex : Wax hollandais 6 yards"}),
            "slug": forms.TextInput(attrs={"placeholder": "Laisser vide pour générer automatiquement"}),
            "description": forms.Textarea(attrs={"rows": 4}),
            "badge": forms.TextInput(attrs={"placeholder": "Ex : Promo, Nouveau"}),
        }
        labels = {
            "length_m": "Longueur (m) — tissus uniquement",
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["slug"].required = False


ProductImageFormSet = inlineformset_factory(
    Product,
    ProductImage,
    fields=["image", "alt_text", "order"],
    extra=1,
    can_delete=True,
)


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ["name", "slug", "parent", "image", "order"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Ex : Tissus"}),
            "slug": forms.TextInput(attrs={"placeholder": "Laisser vide pour générer automatiquement"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["slug"].required = False
        self.fields["parent"].queryset = Category.objects.all()
        if self.instance.pk:
            self.fields["parent"].queryset = Category.objects.exclude(pk=self.instance.pk)


class OrderStatusForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ["status"]
