from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render

from storefront.models import ContactMessage

from ..decorators import staff_required
from ..utils import sidebar_context


@staff_required
def message_list(request):
    context = {
        **sidebar_context("messages"),
        "messages_qs": ContactMessage.objects.all(),
    }
    return render(request, "admin_panel/messages/list.html", context)


@staff_required
def message_detail(request, pk):
    message = get_object_or_404(ContactMessage, pk=pk)

    if request.method == "POST":
        message.is_read = not message.is_read
        message.save(update_fields=["is_read"])
        messages.success(request, "Message mis à jour.")
        return redirect("admin_panel:message-detail", pk=message.pk)

    if not message.is_read:
        message.is_read = True
        message.save(update_fields=["is_read"])

    context = {
        **sidebar_context("messages"),
        "message_obj": message,
    }
    return render(request, "admin_panel/messages/detail.html", context)


@staff_required
def message_delete(request, pk):
    message = get_object_or_404(ContactMessage, pk=pk)
    if request.method == "POST":
        name = message.name
        message.delete()
        messages.success(request, f"Message de « {name} » supprimé.")
        return redirect("admin_panel:message-list")

    context = {
        **sidebar_context("messages"),
        "message_obj": message,
    }
    return render(request, "admin_panel/messages/confirm_delete.html", context)
