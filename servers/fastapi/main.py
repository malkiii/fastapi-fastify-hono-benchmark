from fastapi import FastAPI, Query, Request
from fastapi.responses import Response
from dotenv import load_dotenv
from pymongo import MongoClient
from uuid import uuid4
from time import time
import os

load_dotenv()

# Initialize FastAPI app
app = FastAPI()
PORT = int(os.getenv("FASTAPI_PORT", 8000))

# Connect to MongoDB
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["benchmark-data"]
items_collection = db["Items"]


# Return status of the service
@app.get("/")
async def status():
    return {
        "name": "fastapi",
        "status": "OK",
        "timestamp": time(),
    }


# Get a list items from MongoDB
@app.get("/items")
async def get_items(limit: int = Query(default=10, ge=1)):
    items = list(
        db.Items.find(
            {},
            {"_id": 0},
        )
        .sort("createdAt", -1)
        .limit(limit)
    )

    total = len(items)

    # Extract "code" field and add auto-increment id
    new_items = list(
        map(
            lambda item, idx: {"id": idx + 1, "code": item["code"]},
            items,
            range(total),
        )
    )

    return {
        "total": total,
        "items": new_items,
    }


@app.post("/signup")
async def signup(request: Request):
    # Generate a new UUID
    print("New User:", str(uuid4()))

    return Response(status_code=302)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
