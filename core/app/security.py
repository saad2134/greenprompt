import hashlib
from fastapi import Header, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import APIKey
from app.config import API_KEY_SALT

def hash_key(key: str) -> str:
    return hashlib.sha256((key + API_KEY_SALT).encode()).hexdigest()

async def require_api_key(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_db)
) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth header")

    raw_key = authorization.replace("Bearer ", "")
    key_hash = hash_key(raw_key)

    result = await db.execute(
        select(APIKey).where(APIKey.key_hash == key_hash)
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return api_key.owner
