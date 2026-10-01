from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.api_urls')),
    path('api/', include('storefront.api_urls')),
    path('api/', include('catalog.api_urls')),
    path('api/cart/', include('cart.api_urls')),
    path('api/orders/', include('orders.api_urls')),
    path('api/admin/', include('admin_panel.api_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    # En production (sans serveur de fichiers statiques devant Django type
    # nginx/WhiteNoise), on sert directement le build React (frontend/dist) :
    # ses assets, les images statiques copiées depuis public/, puis un
    # catch-all qui renvoie index.html pour laisser React Router gérer la route.
    frontend_dist = settings.BASE_DIR / 'frontend' / 'dist'
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [
        path('assets/<path:path>', serve, {'document_root': frontend_dist / 'assets'}),
        path('img/<path:path>', serve, {'document_root': frontend_dist / 'img'}),
        re_path(r'^(?!admin/|api/|media/|assets/|img/).*$', TemplateView.as_view(template_name='index.html')),
    ]
