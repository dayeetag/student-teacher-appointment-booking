from django.db import models

# Create your models here.

class StudentSignupRequest(models.Model):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # Plaintext for demo only!
    name = models.CharField(max_length=64)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)