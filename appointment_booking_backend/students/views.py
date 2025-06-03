# Create your views here.
import json
from django.http import JsonResponse
from .models import StudentSignupRequest
from django.views.decorators.csrf import csrf_exempt
from core.firebase_utils import get_firestore_users
from firebase_admin import firestore
from datetime import datetime


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
def get_all_teachers(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    
    try:
        teacher_docs = get_firestore_users("teacher")
        return JsonResponse({'teachers': teacher_docs}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    


    
@csrf_exempt
def appointment_request(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        teacher_email = data.get("teacher_email")
        student_email = data.get("student_email")
        appt_date_str = data.get("appt_date")
        message = data.get("message")

        if not teacher_email or not student_email or not appt_date_str:
            return JsonResponse({'error': 'Required information not present in request'}, status=400)

        appt_date = datetime.fromisoformat(appt_date_str)

        db = firestore.client()
        db.collection("appointments").document().set({
            "teacher": teacher_email,
            "student": student_email,
            "appt_date": appt_date,
            "message": message,
            "approved": "pending"
        })

        return JsonResponse({'success': True, 'message': 'Appointment created successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def get_upcoming_appointments(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)

    student_email = request.GET.get("student_email")
    today = datetime.utcnow()

    try:
        db = firestore.client()
        query = db.collection("appointments").where("student", "==", student_email).where("appt_date", ">=", today)
        results = (query.stream())
        appts = []
        if results:
            for doc in results:
                data = doc.to_dict()
                appts.append(data)
        return JsonResponse({'appointments': appts}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)