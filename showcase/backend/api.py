from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.endpoints import router

app = FastAPI(
    title="Project Management API",
    description="API for managing projects and tasks",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# add cors for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)