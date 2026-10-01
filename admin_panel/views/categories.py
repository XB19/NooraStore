from django.contrib import messages
from django.db.models import ProtectedError
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.text import slugify

from catalog.models import Category

from ..decorators import staff_required
from ..forms import CategoryForm
from ..utils import sidebar_context


@staff_required
def category_list(request):
    context = {
        **sidebar_context("categories"),
        "categories": Category.objects.select_related("parent").prefetch_related("children"),
    }
    return render(request, "admin_panel/categories/list.html", context)


@staff_required
def category_create(request):
    if request.method == "POST":
        form = CategoryForm(request.POST, request.FILES)
        if form.is_valid():
            category = form.save(commit=False)
            if not category.slug:
                category.slug = slugify(category.name)
            category.save()
            messages.success(request, "Catégorie créée.")
            return redirect("admin_panel:category-list")
    else:
        form = CategoryForm()

    context = {**sidebar_context("categories"), "form": form, "is_new": True}
    return render(request, "admin_panel/categories/form.html", context)


@staff_required
def category_edit(request, pk):
    category = get_object_or_404(Category, pk=pk)
    if request.method == "POST":
        form = CategoryForm(request.POST, request.FILES, instance=category)
        if form.is_valid():
            category = form.save(commit=False)
            if not category.slug:
                category.slug = slugify(category.name)
            category.save()
            messages.success(request, "Catégorie mise à jour.")
            return redirect("admin_panel:category-list")
    else:
        form = CategoryForm(instance=category)

    context = {**sidebar_context("categories"), "form": form, "category": category, "is_new": False}
    return render(request, "admin_panel/categories/form.html", context)


@staff_required
def category_delete(request, pk):
    category = get_object_or_404(Category, pk=pk)
    if request.method == "POST":
        name = category.name
        try:
            category.delete()
            messages.success(request, f"Catégorie « {name} » supprimée.")
        except ProtectedError:
            messages.error(
                request,
                f"Impossible de supprimer « {name} » : des produits y sont encore rattachés. "
                "Déplacez-les vers une autre catégorie d'abord.",
            )
        return redirect("admin_panel:category-list")

    context = {**sidebar_context("categories"), "category": category}
    return render(request, "admin_panel/categories/confirm_delete.html", context)
