from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Favorite, Product, ProductImage


def _thumb(image_field, size=44):
    if not image_field:
        return "—"
    return format_html(
        '<img src="{}" style="height:{}px; width:{}px; object-fit:cover; border-radius:4px; border:1px solid #ddd;">',
        image_field.url, size, size,
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "name", "parent", "slug", "order")
    list_filter = ("parent",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

    @admin.display(description="Image")
    def thumbnail(self, obj):
        return _thumb(obj.image)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("thumbnail", "image", "alt_text", "order")
    readonly_fields = ("thumbnail",)

    @admin.display(description="Aperçu")
    def thumbnail(self, obj):
        return _thumb(obj.image, size=60)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("thumbnail", "name", "category", "price", "old_price", "badge", "is_active", "is_featured")
    list_filter = ("category", "is_active", "is_featured", "badge")
    search_fields = ("name", "slug", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

    @admin.display(description="Image")
    def thumbnail(self, obj):
        return _thumb(obj.main_image)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "created_at")
    search_fields = ("user__username", "product__name")
