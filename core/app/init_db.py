import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models import Base, APIKey, User, Team, Organization
from app.config import settings
import hashlib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_db():
    logger.info("Initializing database...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            pass
    
    logger.info("Database initialized successfully")

async def create_tables():
    logger.info("Creating database tables...")
    async with AsyncSessionLocal() as session:
        async with session.begin():
            await session.execute(text("SELECT 1"))
    
    logger.info("Tables created")

async def seed_demo_data():
    logger.info("Seeding demo data...")
    
    async with AsyncSessionLocal() as session:
        async with session.begin():
            demo_api_key = APIKey(
                key_hash=hashlib.sha256(("demo-key-12345" + settings.API_KEY_SALT).encode()).hexdigest(),
                owner="demo-user",
                name="Demo API Key",
                is_active=True,
                rate_limit=100
            )
            session.add(demo_api_key)
    
    logger.info("Demo data seeded")

async def reset_db():
    logger.info("Resetting database...")
    async with AsyncSessionLocal() as session:
        async with session.begin():
            for table in reversed(Base.metadata.sorted_tables):
                await session.execute(text(f"TRUNCATE TABLE {table.name} CASCADE"))
    logger.info("Database reset")

if __name__ == "__main__":
    import sys
    command = sys.argv[1] if len(sys.argv) > 1 else "init"
    
    if command == "init":
        asyncio.run(init_db())
        asyncio.run(create_tables())
    elif command == "seed":
        asyncio.run(seed_demo_data())
    elif command == "reset":
        asyncio.run(reset_db())
    else:
        print(f"Unknown command: {command}")
        print("Usage: python -m app.init_db [init|seed|reset]")
