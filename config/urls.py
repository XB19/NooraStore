from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.api_urls')),
    path('api/', include('storefront.api_urls')),
    path('api/', include('catalog.api_urls')),
    path('api/cart/', include('cart.api_urls')),
    path('api/orders/', include('orders.api_urls')),
    path('api/admin/', include('admin_panel.api_urls')),
    path('compte/', include('accounts.urls')),
    path('panier/', include('cart.urls')),
    path('', include('orders.urls')),
    path('gestion/', include('admin_panel.urls')),
    path('', include('storefront.urls')),
    path('', include('catalog.urls')),  # garder en dernier : contient la route générique <slug>/
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
