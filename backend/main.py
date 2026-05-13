from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pymongo import ReturnDocument
from database import collection, counters_collection
from schemas import AdminLogin, User
import base64
import hashlib
import hmac
import json
import os
import re
import time

app = FastAPI()

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,https://crudoperations-phi.vercel.app"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "seyadriyaz0@gmail.com").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
SESSION_SECRET = os.getenv("SESSION_SECRET")
SESSION_COOKIE_NAME = "crud_admin_session"
SESSION_MAX_AGE = 60 * 60 * 12


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "age": user["age"]
    }


def get_login_count():
    counter = counters_collection.find_one({"name": "logins"})
    return counter["count"] if counter else 0


def normalize_email(email: str):
    return email.strip().lower()


def email_filter(email: str):
    return {
        "email": {
            "$regex": f"^{re.escape(normalize_email(email))}$",
            "$options": "i"
        }
    }


def admin_credentials_configured():
    return bool(ADMIN_PASSWORD and SESSION_SECRET)


def increment_login_count():
    result = counters_collection.find_one_and_update(
        {"name": "logins"},
        {"$inc": {"count": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )

    return result["count"]


def create_session_token(email: str):
    payload = {
        "email": normalize_email(email),
        "exp": int(time.time()) + SESSION_MAX_AGE
    }
    payload_json = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    encoded_payload = base64.urlsafe_b64encode(payload_json).decode("utf-8").rstrip("=")
    signature = hmac.new(
        SESSION_SECRET.encode("utf-8"),
        encoded_payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    return f"{encoded_payload}.{signature}"


def decode_session_token(token: str):
    if not token or "." not in token or not SESSION_SECRET:
        return None

    encoded_payload, signature = token.rsplit(".", 1)
    expected_signature = hmac.new(
        SESSION_SECRET.encode("utf-8"),
        encoded_payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(signature, expected_signature):
        return None

    try:
        padding = "=" * (-len(encoded_payload) % 4)
        payload_json = base64.urlsafe_b64decode(f"{encoded_payload}{padding}".encode("utf-8"))
        payload = json.loads(payload_json.decode("utf-8"))
    except Exception:
        return None

    if payload.get("exp", 0) < int(time.time()):
        return None

    if normalize_email(payload.get("email", "")) != ADMIN_EMAIL:
        return None

    return payload


def request_is_secure(request: Request):
    forwarded_proto = request.headers.get("x-forwarded-proto")
    return forwarded_proto == "https" or request.url.scheme == "https"


def set_admin_cookie(response: Response, request: Request, token: str):
    secure_cookie = request_is_secure(request)

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=secure_cookie,
        samesite="none" if secure_cookie else "lax",
        max_age=SESSION_MAX_AGE,
        path="/"
    )


def clear_admin_cookie(response: Response, request: Request):
    secure_cookie = request_is_secure(request)

    response.delete_cookie(
        key=SESSION_COOKIE_NAME,
        httponly=True,
        secure=secure_cookie,
        samesite="none" if secure_cookie else "lax",
        path="/"
    )


def require_admin(request: Request):
    session = decode_session_token(request.cookies.get(SESSION_COOKIE_NAME, ""))

    if not session:
        raise HTTPException(status_code=401, detail="Admin access required")

    return session


@app.get("/")
def home():
    return {"message": "FastAPI CRUD Running"}


@app.get("/admin/session")
def get_admin_session(request: Request):
    session = decode_session_token(request.cookies.get(SESSION_COOKIE_NAME, ""))

    return {
        "authenticated": bool(session),
        "email": session["email"] if session else None
    }


@app.post("/admin/login")
def admin_login(credentials: AdminLogin, request: Request, response: Response):
    if not admin_credentials_configured():
        raise HTTPException(status_code=503, detail="Admin credentials are not configured")

    if normalize_email(credentials.email) != ADMIN_EMAIL or credentials.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin email or password")

    token = create_session_token(ADMIN_EMAIL)
    set_admin_cookie(response, request, token)
    logins = increment_login_count()

    return {
        "authenticated": True,
        "email": ADMIN_EMAIL,
        "logins": logins
    }


@app.post("/admin/logout")
def admin_logout(request: Request, response: Response):
    clear_admin_cookie(response, request)
    return {"authenticated": False}


@app.get("/dashboard/stats")
def get_dashboard_stats(request: Request):
    require_admin(request)

    return {
        "signups": collection.count_documents({}),
        "logins": get_login_count(),
        "authenticationRequired": True
    }


@app.post("/login")
def login(request: Request):
    require_admin(request)
    logins = increment_login_count()

    return {
        "message": "Login counted successfully",
        "logins": logins,
        "authenticationRequired": True
    }


@app.post("/users")
def create_user(user: User):
    normalized_email = normalize_email(user.email)

    if collection.find_one(email_filter(normalized_email)):
        raise HTTPException(
            status_code=409,
            detail="A user with this email already exists"
        )

    user_data = user.model_dump()
    user_data["email"] = normalized_email

    result = collection.insert_one(user_data)

    new_user = collection.find_one({"_id": result.inserted_id})

    return serialize_user(new_user)


@app.get("/users")
def get_users(request: Request):
    require_admin(request)

    users = []

    for user in collection.find():
        users.append(serialize_user(user))

    return users


@app.put("/users/{id}")
def update_user(id: str, user: User, request: Request):
    require_admin(request)

    try:
        user_id = ObjectId(id)
        normalized_email = normalize_email(user.email)

        duplicate_filter = email_filter(normalized_email)
        duplicate_filter["_id"] = {"$ne": user_id}
        duplicate_user = collection.find_one(duplicate_filter)

        if duplicate_user:
            raise HTTPException(
                status_code=409,
                detail="A user with this email already exists"
            )

        collection.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "name": user.name,
                    "email": normalized_email,
                    "age": user.age
                }
            }
        )

        updated_user = collection.find_one(
            {"_id": user_id}
        )

        if updated_user:
            return serialize_user(updated_user)

        return {"message": "User not found"}

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}

@app.delete("/users/{id}")
def delete_user(id: str, request: Request):
    require_admin(request)

    try:

        result = collection.delete_one(
            {"_id": ObjectId(id)}
        )

        if result.deleted_count == 1:
            return {"message": "User deleted successfully"}

        return {"message": "User not found"}

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}
