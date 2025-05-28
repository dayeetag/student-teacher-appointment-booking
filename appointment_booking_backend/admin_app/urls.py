from django.urls import path
from .views import approve_signup, get_pending_signup_requests, get_all_teachers, add_teacher_details, update_teacher_details, delete_teacher_details, user_login_api

urlpatterns = [
    path('login/', user_login_api, name='login'),
    path('approve/', approve_signup, name='approve-signup'),
    path('getPendingRequests/', get_pending_signup_requests, name='get-pending-signup'),
    path('getAllTeachers/', get_all_teachers, name='get-all-teachers'),
    path('addTeacher/', add_teacher_details, name='add-teacher-details'),
    path('updateTeacher/', update_teacher_details, name='update-teacher-details'),
    path('deleteTeacher/', delete_teacher_details, name='delete-teacher-details'),
]