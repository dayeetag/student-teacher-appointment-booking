# Create your views here.

import json
from django.http import JsonResponse
from students.models import StudentSignupRequest
from firebase_admin import auth, firestore
from django.views.decorators.csrf import csrf_exempt
from core.firebase_utils import get_firestore_user_by_email, get_firestore_users, user_login

# POST api for user login
@csrf_exempt
def user_login_api(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    return user_login(email, password)

# GET api to get all pending student sign-up requests
@csrf_exempt
def get_pending_signup_requests(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)

    # fetch all unapproved signups
    try:
        pending_signups = StudentSignupRequest.objects.filter(is_approved=False).values('name', 'email', 'created_at')
        return JsonResponse({'pending_signups': list(pending_signups)}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# POST api to approve student sign-up request
@csrf_exempt
def approve_signup(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")

        signup = StudentSignupRequest.objects.get(email=email, is_approved=False)

        # Create user in Firebase
        user_record = auth.create_user(email=signup.email, password=signup.password)

        # Add student details to Firestore
        db = firestore.client()
        db.collection("users").document(user_record.uid).set({
            "name": signup.name,
            "email": signup.email,
            "category": "student",
        })

        # Update django db record to approved=true
        signup.is_approved = True
        signup.save()

        return JsonResponse({'message': f'User {signup.email} approved and created in Firebase'}, status=200)

    except StudentSignupRequest.DoesNotExist:
        return JsonResponse({'error': 'Signup request not found or already approved'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# GET api for fetch all teacher records from firestore
@csrf_exempt
def get_all_teachers(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    
    try:
        teacher_docs = get_firestore_users("teacher")
        return JsonResponse({'teachers': teacher_docs}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# POST api to add teacher record to firestore
@csrf_exempt
def add_teacher_details(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
        department = data.get("department")
        subject = data.get("subject")

        # Create user in Firebase
        user_record = auth.create_user(email=email, password=password)

        # Add teacher details to Firestore
        db = firestore.client()
        db.collection("users").document(user_record.uid).set({
            "name": name,
            "email": email,
            "category": "teacher",
            "department": department,
            "subject": subject,
        })

        return JsonResponse({'message': f'Teacher {email} created in Firebase'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# POST api to update teacher details to firestore    
@csrf_exempt
def update_teacher_details(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        name = data.get("name")
        department = data.get("department")
        subject = data.get("subject")

        # Retrieve teacher user id
        teacher_doc = get_firestore_user_by_email(email, "teacher")
        teacher_uid = teacher_doc.id
        
        # Update only provided fields
        update_data = {}
        if name: update_data["name"] = name
        if department: update_data["department"] = department
        if subject: update_data["subject"] = subject

        db = firestore.client()
        teacher_ref = db.collection("users").document(teacher_uid)
        teacher_ref.update(update_data)

        return JsonResponse({'message': f'Teacher {email} updated successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
# POST api to delete teacher record in firestore
@csrf_exempt
def delete_teacher_details(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email")
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        # Retrieve teacher user id
        teacher_doc = get_firestore_user_by_email(email, "teacher")
        teacher_uid = teacher_doc.id

         # Delete from Firestore
        db = firestore.client()
        teacher_ref = db.collection("users").document(teacher_uid)
        teacher_ref.delete()

        return JsonResponse({'message': f'Teacher {email} deleted successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)