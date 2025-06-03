# students/urls.py
from django.urls import path
from .views import signup_request, get_all_teachers, appointment_request, get_upcoming_appointments

urlpatterns = [
    path('signup/', signup_request, name='signup'),
    path('getTeacherDetails/', get_all_teachers, name='getTeacherDetail'),
    path('appointmentRequest/', appointment_request, name='appointmentRequest'),
    path('getAppointments/', get_upcoming_appointments, name='getAppointments')
]