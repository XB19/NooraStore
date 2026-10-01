from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_POST

from .models import Category, Favorite, Product


def _favorite_ids(user):
    if not user.is_authenticated:
        return set()
    return set(Favorite.objects.filter(user=user).values_list("product_id", flat=True))


def _breadcrumb(category):
    chain = category.breadcrumb()
    crumb = []
    for node in chain:
        is_last = node.pk == category.pk
        crumb.append({
            "label": node.name,
            "url": None if is_last else "catalog:category-detail",
            "arg": None if is_last else node.slug,
        })
    return crumb


def category_detail(request, slug):
    category = get_object_or_404(Category, slug=slug)
    child_ids = list(category.children.values_list("id", flat=True))
    products = (
        Product.objects.filter(Q(category=category) | Q(category_id__in=child_ids), is_active=True)
        .select_related("category")
        .prefetch_related("images")
    )
    context = {
        "title": category.name,
        "products": products,
        "crumb": _breadcrumb(category),
        "favorite_ids": _favorite_ids(request.user),
    }
    return render(request, "catalog/category.html", context)


def catalogue(request):
    query = request.GET.get("q", "").strip()
    products = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")
    if query:
        products = products.filter(Q(name__icontains=query) | Q(description__icontains=query))
        title = f"Résultats pour « {query} »"
    else:
        title = "Tout le catalogue"
    context = {
        "title": title,
        "products": products,
        "crumb": [{"label": title, "url": None}],
        "favorite_ids": _favorite_ids(request.user),
    }
    return render(request, "catalog/category.html", context)


def product_detail(request, slug):
    product = get_object_or_404(
        Product.objects.select_related("category").prefetch_related("images"),
        slug=slug, is_active=True,
    )
    is_favorite = (
        request.user.is_authenticated
        and Favorite.objects.filter(user=request.user, product=product).exists()
    )
    related = (
        Product.objects.filter(category=product.category, is_active=True)
        .exclude(pk=product.pk)
        .prefetch_related("images")[:4]
    )
    context = {
        "product": product,
        "is_favorite": is_favorite,
        "related": related,
        "favorite_ids": _favorite_ids(request.user),
        "crumb": _breadcrumb(product.category) + [{"label": product.name, "url": None}],
    }
    return render(request, "catalog/product_detail.html", context)


@login_required
def favorites_list(request):
    products = (
        Product.objects.filter(favorited_by__user=request.user, is_active=True)
        .select_related("category")
        .prefetch_related("images")
    )
    context = {
        "title": "Mes favoris",
        "products": products,
        "crumb": [{"label": "Mes favoris", "url": None}],
        "favorite_ids": _favorite_ids(request.user),
    }
    return render(request, "catalog/category.html", context)


@login_required
@require_POST
def toggle_favorite(request, slug):
    product = get_object_or_404(Product, slug=slug)
    favorite, created = Favorite.objects.get_or_create(user=request.user, product=product)
    if not created:
        favorite.delete()
    next_url = request.POST.get("next") or product.get_absolute_url()
    return redirect(next_url)
