from django.conf import settings
from django.db import models

from catalog.models import Product

PAYMENT_CHOICES = [
    ("flooz", "Flooz"),
    ("tmoney", "T-Money"),
    ("carte", "Carte virtuelle Noora"),
]

STATUS_CHOICES = [
    ("en_attente", "En attente de paiement"),
    ("confirmee", "Confirmée"),
    ("expediee", "Expédiée"),
    ("livree", "Livrée"),
    ("annulee", "Annulée"),
]


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="orders", on_delete=models.CASCADE)
    full_name = models.CharField("Nom complet", max_length=150)
    phone = models.CharField("Téléphone", max_length=30)
    address = models.CharField("Adresse de livraison", max_length=255)
    payment_method = models.CharField("Mode de paiement", max_length=10, choices=PAYMENT_CHOICES)
    status = models.CharField("Statut", max_length=15, choices=STATUS_CHOICES, default="en_attente")
    created_at = models.DateTimeField("Créée le", auto_now_add=True)

    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Commande #{self.pk} — {self.full_name}"

    @property
    def total(self):
        return sum(item.subtotal for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.PROTECT)
    product_name = models.CharField(max_length=150)
    unit_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} × {self.product_name}"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity
