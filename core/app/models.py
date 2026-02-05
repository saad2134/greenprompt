from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Text, func
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True)
    key_hash = Column(String(64), unique=True, nullable=False, index=True)
    owner = Column(String(255), nullable=False, index=True)
    name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    rate_limit = Column(Integer, default=1000)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime, nullable=True)
    last_used_at = Column(DateTime, nullable=True)

class PromptRun(Base):
    __tablename__ = "prompt_runs"

    id = Column(Integer, primary_key=True)
    owner = Column(String(255), nullable=False, index=True)
    team_id = Column(String(255), nullable=True, index=True)
    prompt_hash = Column(String(64), nullable=True, index=True)
    prompt_length = Column(Integer, nullable=True)
    model = Column(String(255), nullable=False, index=True)
    prompt_tokens = Column(Integer, nullable=True)
    estimated_output_tokens = Column(Integer, nullable=True)
    actual_output_tokens = Column(Integer, nullable=True)
    energy_joules = Column(Float, nullable=True, index=True)
    carbon_kg = Column(Float, nullable=True)
    water_liters = Column(Float, nullable=True)
    cost_usd = Column(Float, nullable=True)
    is_tracked = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    organization_id = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, server_default=func.now())

class Team(Base):
    __tablename__ = "teams"

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    organization_id = Column(String(255), nullable=True, index=True)
    created_at = Column(DateTime, server_default=func.now())

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(String(255), nullable=True, index=True)
    action = Column(String(255), nullable=False, index=True)
    resource_type = Column(String(255), nullable=False)
    resource_id = Column(String(255), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), index=True)
