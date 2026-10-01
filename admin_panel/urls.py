from django.urls import path

from .views import categories, contact, dashboard, orders, products

app_name = "admin_panel"

urlpatterns = [
    path("", dashboard.dashboard, name="dashboard"),

    path("produits/", products.product_list, name="product-list"),
    path("produits/nouveau/", products.product_create, name="product-create"),
    path("produits/<int:pk>/modifier/", products.product_edit, name="product-edit"),
    path("produits/<int:pk>/supprimer/", products.product_delete, name="product-delete"),

    path("categories/", categories.category_list, name="category-list"),
    path("categories/nouvelle/", categories.category_create, name="category-create"),
    path("categories/<int:pk>/modifier/", categories.category_edit, name="category-edit"),
    path("categories/<int:pk>/supprimer/", categories.category_delete, name="category-delete"),

    path("commandes/", orders.order_list, name="order-list"),
    path("commandes/<int:pk>/", orders.order_detail, name="order-detail"),

    path("messages/", contact.message_list, name="message-list"),
    path("messages/<int:pk>/", contact.message_detail, name="message-detail"),
    path("messages/<int:pk>/supprimer/", contact.message_delete, name="message-delete"),
]
