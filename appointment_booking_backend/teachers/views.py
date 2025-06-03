import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from core.firebase_utils import get_firestore_users
from firebase_admin import auth, firestore
from datetime import datetime

# Create your views here.
@csrf_exempt
def get_all_students(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    
    try:
        stud_docs = get_firestore_users("student")
        return JsonResponse({'students': stud_docs}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def get_all_appointment_requests(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    
    teacher_email = request.GET.get("teacher_email")
    today = datetime.utcnow()

    try:
        db = firestore.client()
        query = db.collection("appointments").where("teacher", "==", teacher_email).where("appt_date", ">=", today).where("approved","==", "pending")
        results = (query.stream())
        appts = []
        if results:
            for doc in results:
                data = doc.to_dict()
                data["id"] = doc.id
                appts.append(data)
        return JsonResponse({'appointments': appts}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def get_all_confirmed_appointments(request):
    if request.method != "GET":
        return JsonResponse({'error': 'Only GET allowed'}, status=405)
    
    teacher_email = request.GET.get("teacher_email")
    today = datetime.utcnow()

    try:
        db = firestore.client()
        query = db.collection("appointments").where("teacher", "==", teacher_email).where("appt_date", ">=", today).where("approved","==", "true")
        results = (query.stream())
        appts = []
        if results:
            for doc in results:
                data = doc.to_dict()
                data["id"] = doc.id
                appts.append(data)
        return JsonResponse({'appointments': appts}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def confirm_appointment(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        doc_id = data.get("id")

        if not doc_id:
            return JsonResponse({'error': 'Appointment ID not present in request'}, status=400)

        db = firestore.client()
        db.collection("appointments").document(doc_id).update({
            "approved": "true"
        })

        return JsonResponse({'success': True, 'message': 'Appointment confirmed successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
def cancel_appointment(request):
    if request.method != "POST":
        return JsonResponse({'error': 'Only POST allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        doc_id = data.get("id")

        if not doc_id:
            return JsonResponse({'error': 'Appointment ID not present in request'}, status=400)

        db = firestore.client()
        db.collection("appointments").document(doc_id).update({
            "approved": "false"
        })

        return JsonResponse({'success': True, 'message': 'Appointment cancelled successfully'})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)