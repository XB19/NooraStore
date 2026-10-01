from django.db import models


class ContactMessage(models.Model):
    name = models.CharField("Nom", max_length=150)
    email = models.EmailField("Email", blank=True)
    phone = models.CharField("Téléphone", max_length=30, blank=True)
    subject = models.CharField("Sujet", max_length=150, blank=True)
    message = models.TextField("Message")
    is_read = models.BooleanField("Lu", default=False)
    created_at = models.DateTimeField("Reçu le", auto_now_add=True)

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.subject or 'sans sujet'}"
