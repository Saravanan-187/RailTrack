import sys
import os
from dotenv import load_dotenv

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, trains, bookings

load_dotenv()


def get_allowed_origins():
    default_origins = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:8084",
        "http://localhost:8085",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8084",
        "http://127.0.0.1:8085",
    ]
    configured_origins = os.getenv("CORS_ORIGINS", "")
    if not configured_origins.strip():
        return default_origins
    return [origin.strip() for origin in configured_origins.split(",") if origin.strip()]

app = FastAPI(
    title="RailTrack API",
    description="Backend API for RailTrack application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(trains.router, prefix="/api/trains", tags=["Trains"])
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to RailTrack API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
