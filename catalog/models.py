from django.conf import settings
from django.db import models
from django.urls import reverse


class Category(models.Model):
    name = models.CharField("Nom", max_length=100)
    slug = models.SlugField("Slug", max_length=100, unique=True)
    parent = models.ForeignKey(
        "self", verbose_name="Catégorie parente", null=True, blank=True,
        related_name="children", on_delete=models.CASCADE,
    )
    image = models.ImageField("Image de présentation", upload_to="categories/", blank=True)
    order = models.PositiveIntegerField("Ordre", default=0)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.parent.name} · {self.name}" if self.parent else self.name

    def get_absolute_url(self):
        return reverse("catalog:category-detail", args=[self.slug])

    def breadcrumb(self):
        chain = []
        node = self
        while node:
            chain.insert(0, node)
            node = node.parent
        return chain

    def product_count(self):
        ids = [self.id] + list(self.children.values_list("id", flat=True))
        return Product.objects.filter(category_id__in=ids, is_active=True).count()


class Product(models.Model):
    name = models.CharField("Nom", max_length=150)
    slug = models.SlugField("Slug", max_length=160, unique=True)
    category = models.ForeignKey(Category, verbose_name="Catégorie", related_name="products", on_delete=models.PROTECT)
    description = models.TextField("Description", blank=True)
    price = models.PositiveIntegerField("Prix (FCFA)")
    old_price = models.PositiveIntegerField("Ancien prix (FCFA)", null=True, blank=True)
    length_m = models.DecimalField(
        "Longueur (m)", max_digits=5, decimal_places=2, null=True, blank=True,
        help_text="Renseigné pour les tissus : sert à calculer le prix au mètre.",
    )
    badge = models.CharField("Badge", max_length=30, blank=True, help_text="Ex : Promo, Nouveau")
    is_active = models.BooleanField("Actif", default=True)
    is_featured = models.BooleanField("Mis en avant sur l'accueil", default=False)
    created_at = models.DateTimeField("Créé le", auto_now_add=True)

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("catalog:product-detail", args=[self.slug])

    @property
    def main_image(self):
        first = self.images.first()
        return first.image if first else None

    @property
    def price_per_meter(self):
        if self.length_m:
            return round(self.price / float(self.length_m))
        return None


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField("Image", upload_to="products/")
    alt_text = models.CharField("Texte alternatif", max_length=200, blank=True)
    order = models.PositiveIntegerField("Ordre", default=0)

    class Meta:
        verbose_name = "Image produit"
        verbose_name_plural = "Images produit"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.product.name} — image {self.order}"


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="favorites", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="favorited_by", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Favori"
        verbose_name_plural = "Favoris"
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user} ♥ {self.product}"
