from firebase_admin import firestore, auth
from django.http import JsonResponse
import requests

FIREBASE_API_KEY = "AIzaSyD62ILHdLB3AGCLmgcCZkWHiaua4C8KuiY"

def get_firestore_user_by_email(email, category):
    db = firestore.client()
    query = db.collection("users").where("email", "==", email).where("category", "==", category).limit(1)
    results = query.get()
    return results[0] if results else None

def get_firestore_users(category):
    db = firestore.client()
    query = db.collection("users").where("category", "==", category)
    results = (query.stream())
    users = []
    if results:
        for doc in results:
            data = doc.to_dict()
            users.append(data)
    return users

def user_login(email, password):
    try:

        # Use Firebase Identity Toolkit REST API to sign in
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)
        if response.status_code != 200:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

        res_data = response.json()
        return JsonResponse({
            'message': 'Login successful',
            'user_id': res_data['localId'],
            'token': res_data['idToken'],
            'email': res_data['email']
        }, status=200)

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Network error contacting Firebase'}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)