# students/urls.py
from django.urls import path
from .views import signup_request, student_login

urlpatterns = [
    path('signup/', signup_request, name='signup'),
    path('login/', student_login, name='login')
]