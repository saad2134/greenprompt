from fastapi import FastAPI
from app.api.analyze import router as analyze_router

app = FastAPI(title="Promptonomics Core API", version="1.0")

app.include_router(analyze_router, prefix="/v1")

@app.get("/health")
async def health():
    return {"status": "ok"}
