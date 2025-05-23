from fastapi import FastAPI
from src.endpoints import router

app = FastAPI(
    title="Project Management API",
    description="API for managing projects and tasks",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)