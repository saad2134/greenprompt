from sqlalchemy import Column, String, Integer, Float, DateTime, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True)
    key_hash = Column(String, unique=True, nullable=False)
    owner = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class PromptRun(Base):
    __tablename__ = "prompt_runs"

    id = Column(Integer, primary_key=True)
    owner = Column(String, nullable=False)
    prompt_tokens = Column(Integer)
    estimated_output_tokens = Column(Integer)
    energy_joules = Column(Float)
    model = Column(String)
    created_at = Column(DateTime, server_default=func.now())
