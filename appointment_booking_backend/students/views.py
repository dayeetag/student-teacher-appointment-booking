# Create your views here.
import json
from django.http import JsonResponse
from .models import StudentSignupRequest
from django.views.decorators.csrf import csrf_exempt
from core.firebase_utils import user_login

@csrf_exempt
def signup_request(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")

        if not email or not password or not name:
            return JsonResponse({'error': 'Email, password and name required'}, status=400)

        if StudentSignupRequest.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Signup request already exists'}, status=400)

        StudentSignupRequest.objects.create(email=email, password=password, name=name)
        return JsonResponse({'message': 'Signup request submitted, awaiting admin approval'}, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def student_login(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    return user_login(email, password)
    