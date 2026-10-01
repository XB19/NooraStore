from django import forms

from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ["name", "email", "phone", "subject", "message"]
        widgets = {
            "name": forms.TextInput(attrs={"placeholder": "Votre nom"}),
            "email": forms.EmailInput(attrs={"placeholder": "vous@email.com"}),
            "phone": forms.TextInput(attrs={"placeholder": "+228 90 00 00 00"}),
            "subject": forms.TextInput(attrs={"placeholder": "Sujet de votre message"}),
            "message": forms.Textarea(attrs={"placeholder": "Votre message…", "rows": 5}),
        }
