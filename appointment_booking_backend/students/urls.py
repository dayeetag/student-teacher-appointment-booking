# students/urls.py
from django.urls import path
from .views import signup_request

urlpatterns = [
    path('signup/', signup_request, name='signup')
]