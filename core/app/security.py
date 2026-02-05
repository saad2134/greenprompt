import hashlib
from fastapi import Header, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import APIKey
from app.config import settings

def hash_key(key: str) -> str:
    return hashlib.sha256((key + settings.API_KEY_SALT).encode()).hexdigest()

async def require_api_key(
    request: Request,
    authorization: str = Header(None, alias="Authorization"),
    db: AsyncSession = Depends(get_db)
) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")

    raw_key = authorization.replace("Bearer ", "")
    key_hash = hash_key(raw_key)

    result = await db.execute(
        select(APIKey).where(
            APIKey.key_hash == key_hash,
            APIKey.is_active == True
        )
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid or expired API key")

    api_key.last_used_at = __import__('datetime').datetime.utcnow()
    await db.commit()

    return api_key.owner

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests = {}

    async def check_rate_limit(self, client_id: str):
        import time
        current = time.time()
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        self.requests[client_id] = [
            t for t in self.requests[client_id] if current - t < 60
        ]
        
        if len(self.requests[client_id]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded. Please try again later."
            )
        
        self.requests[client_id].append(current)

rate_limiter = RateLimiter()

async def require_rate_limit(
    request: Request,
    x_client_id: str = Header(None, alias="X-Client-ID")
):
    client_id = x_client_id or request.client.host if request.client else "anonymous"
    await rate_limiter.check_rate_limit(client_id)
