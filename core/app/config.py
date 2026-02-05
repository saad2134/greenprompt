import os
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "GreenPrompt Core API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    API_KEY_SALT: str = os.getenv("API_KEY_SALT", "default-salt-change-in-production")
    
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    RATE_LIMIT: int = int(os.getenv("RATE_LIMIT", "1000"))
    
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    CORS_ORIGINS: list = ["*"]
    
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

if not settings.DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")
if settings.API_KEY_SALT == "default-salt-change-in-production":
    raise RuntimeError("API_KEY_SALT environment variable must be set for production")
