# teachers/urls.py
from django.urls import path
from .views import get_all_students, get_all_appointment_requests, get_all_confirmed_appointments, confirm_appointment, cancel_appointment

urlpatterns = [
    path('getStudents/', get_all_students, name='getStudents'),
    path('getPendingAppointments/', get_all_appointment_requests, name='getPendingAppointments'),
    path('getConfirmedAppointments/', get_all_confirmed_appointments, name='getConfirmedAppointments'),
    path('confirmAppointment/', confirm_appointment, name='confirmAppointment'),
    path('cancelAppointment/', cancel_appointment, name='cancelAppointment'),
]