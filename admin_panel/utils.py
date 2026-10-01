from storefront.models import ContactMessage


def sidebar_context(active):
    return {
        "ap_active": active,
        "ap_unread_messages": ContactMessage.objects.filter(is_read=False).count(),
    }
