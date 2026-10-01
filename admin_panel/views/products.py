from django.contrib import messages
from django.db.models import ProtectedError
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.text import slugify

from catalog.models import Category, Product

from ..decorators import staff_required
from ..forms import ProductForm, ProductImageFormSet
from ..utils import sidebar_context


@staff_required
def product_list(request):
    products = Product.objects.select_related("category").prefetch_related("images")

    category_slug = request.GET.get("categorie", "")
    if category_slug:
        products = products.filter(category__slug=category_slug)

    query = request.GET.get("q", "").strip()
    if query:
        products = products.filter(name__icontains=query)

    context = {
        **sidebar_context("products"),
        "products": products,
        "categories": Category.objects.all(),
        "current_category": category_slug,
        "query": query,
    }
    return render(request, "admin_panel/products/list.html", context)


@staff_required
def product_create(request):
    if request.method == "POST":
        form = ProductForm(request.POST)
        if form.is_valid():
            product = form.save(commit=False)
            if not product.slug:
                product.slug = slugify(product.name)
            product.save()
            formset = ProductImageFormSet(request.POST, request.FILES, instance=product)
            if formset.is_valid():
                formset.save()
                messages.success(request, "Produit créé avec succès.")
            else:
                messages.warning(request, "Produit créé, mais certaines images n'ont pas pu être enregistrées.")
            return redirect("admin_panel:product-edit", pk=product.pk)
        formset = ProductImageFormSet(request.POST, request.FILES, instance=Product())
    else:
        form = ProductForm()
        formset = ProductImageFormSet(instance=Product())

    context = {
        **sidebar_context("products"),
        "form": form,
        "formset": formset,
        "is_new": True,
    }
    return render(request, "admin_panel/products/form.html", context)


@staff_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)

    if request.method == "POST":
        form = ProductForm(request.POST, instance=product)
        formset = ProductImageFormSet(request.POST, request.FILES, instance=product)
        if form.is_valid() and formset.is_valid():
            product = form.save(commit=False)
            if not product.slug:
                product.slug = slugify(product.name)
            product.save()
            formset.save()
            messages.success(request, "Produit mis à jour.")
            return redirect("admin_panel:product-edit", pk=product.pk)
        messages.error(request, "Merci de corriger les erreurs ci-dessous.")
    else:
        form = ProductForm(instance=product)
        formset = ProductImageFormSet(instance=product)

    context = {
        **sidebar_context("products"),
        "form": form,
        "formset": formset,
        "product": product,
        "is_new": False,
    }
    return render(request, "admin_panel/products/form.html", context)


@staff_required
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == "POST":
        name = product.name
        try:
            product.delete()
            messages.success(request, f"Produit « {name} » supprimé.")
        except ProtectedError:
            messages.error(
                request,
                f"Impossible de supprimer « {name} » : il fait partie de commandes déjà passées. "
                "Désactivez-le plutôt (décochez « actif ») pour le retirer du site.",
            )
        return redirect("admin_panel:product-list")

    context = {
        **sidebar_context("products"),
        "product": product,
    }
    return render(request, "admin_panel/products/confirm_delete.html", context)
