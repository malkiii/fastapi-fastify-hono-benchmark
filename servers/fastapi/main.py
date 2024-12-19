from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
PORT = int(os.getenv("FASTAPI_PORT", 8000))


@app.get("/hello")
async def hello():
    return {
        "message": "Hello World",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=PORT)
