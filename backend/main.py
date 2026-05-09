from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from database import collection
from schemas import User
from bson import ObjectId

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def serialize_user(user):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "age": user["age"]
    }


@app.get("/")
def home():
    return {"message": "FastAPI CRUD Running"}


@app.post("/users")
def create_user(user: User):

    result = collection.insert_one(user.model_dump())

    new_user = collection.find_one({"_id": result.inserted_id})

    return serialize_user(new_user)


@app.get("/users")
def get_users():

    users = []

    for user in collection.find():
        users.append(serialize_user(user))

    return users


@app.put("/users/{id}")
def update_user(id: str, user: User):

    try:

        collection.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "name": user.name,
                    "email": user.email,
                    "age": user.age
                }
            }
        )

        updated_user = collection.find_one(
            {"_id": ObjectId(id)}
        )

        if updated_user:
            return serialize_user(updated_user)

        return {"message": "User not found"}

    except Exception as e:
        return {"error": str(e)}

@app.delete("/users/{id}")
def delete_user(id: str):

    try:

        result = collection.delete_one(
            {"_id": ObjectId(id)}
        )

        if result.deleted_count == 1:
            return {"message": "User deleted successfully"}

        return {"message": "User not found"}

    except Exception as e:
        return {"error": str(e)}

@app.put("/users/{id}")
def update_user(id: str, user: User):

    collection.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "name": user.name,
                "email": user.email,
                "age": user.age
            }
        }
    )

    updated_user = collection.find_one(
        {"_id": ObjectId(id)}
    )

    if updated_user:
        return serialize_user(updated_user)

    return {"message": "User not found"}