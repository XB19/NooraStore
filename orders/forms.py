from django import forms

from .models import Order


class CheckoutForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ["full_name", "phone", "address", "payment_method"]
        widgets = {
            "full_name": forms.TextInput(attrs={"placeholder": "Nom complet"}),
            "phone": forms.TextInput(attrs={"placeholder": "+228 90 00 00 00"}),
            "address": forms.TextInput(attrs={"placeholder": "Quartier, rue, ville"}),
        }
