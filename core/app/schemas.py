from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000, description="The prompt to analyze")
    model: str = Field(default="gpt-4o", description="LLM model to use for estimation")
    max_tokens: Optional[int] = Field(default=None, ge=1, le=32768, description="Max output tokens")
    output_format: Optional[str] = Field(default="prose", description="Expected output format")
    region: Optional[str] = Field(default="us-west", description="Server region for carbon calculation")

class AnalyzeResponse(BaseModel):
    input_tokens: int
    estimated_output_tokens: int
    energy_joules: float
    carbon_kg: float
    water_liters: float
    estimated_cost_usd: float
    task_type: str
    output_format: str
    confidence: float
    model_info: Dict

class OptimizeRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    include_savings: bool = Field(default=True, description="Calculate potential savings")
    target_model: Optional[str] = Field(default=None, description="Optimize for specific model")

class OptimizationSuggestion(BaseModel):
    type: str
    original_text: str
    suggested_text: str
    energy_savings_joules: float
    energy_savings_percent: float
    confidence: float
    reason: str

class OptimizeResponse(BaseModel):
    original_prompt: str
    optimized_prompt: str
    suggestions: List[OptimizationSuggestion]
    total_savings_joules: float
    total_savings_percent: float
    carbon_savings_kg: float
    cost_savings_usd: float
    estimated_new_tokens: int

class BenchmarkRequest(BaseModel):
    prompt: Optional[str] = Field(default=None, max_length=5000, description="Custom prompt for benchmarking")
    models: Optional[List[str]] = Field(default=None, description="Specific models to compare")
    include_standard: bool = Field(default=True, description="Include standard benchmark prompts")

class ModelBenchmarkResult(BaseModel):
    model: str
    estimated_energy_joules: float
    estimated_tokens: int
    estimated_accuracy: float
    efficiency_score: float
    rank: int
    carbon_footprint: Dict

class BenchmarkResponse(BaseModel):
    benchmark_type: str
    prompt: Optional[str] = None
    prompt_tokens: int
    categories: Optional[List[str]] = None
    results: Optional[Dict] = None
    models: Optional[List[Dict]] = None

class TrackRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=10000)
    model: str
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    actual_energy_joules: Optional[float] = None
    actual_cost_usd: Optional[float] = None
    team_id: Optional[str] = None

class TrackResponse(BaseModel):
    id: int
    owner: str
    model: str
    energy_joules: float
    carbon_kg: float
    water_liters: float
    cost_usd: float
    created_at: datetime

class UserStatsResponse(BaseModel):
    user_id: str
    period_days: int
    total_energy_joules: float
    total_carbon_kg: float
    total_water_liters: float
    total_cost_usd: float
    total_prompts: int
    avg_energy_per_prompt: float
    savings_comparison: Dict

class TeamStatsResponse(BaseModel):
    team_id: str
    period_days: int
    total_energy_joules: float
    total_carbon_kg: float
    total_water_liters: float
    total_cost_usd: float
    total_prompts: int
    leaderboard: List[Dict]

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: Optional[str] = None
    team_id: Optional[str] = None
    team_name: Optional[str] = None
    total_energy_joules: float
    total_carbon_kg: float
    prompt_count: int
    avg_energy_per_prompt: Optional[float] = None

class LeaderboardRequest(BaseModel):
    scope: str = Field(default="team", pattern="^(global|team|organization)$")
    team_id: Optional[str] = None
    days: int = Field(default=30, ge=1, le=365)
    limit: int = Field(default=10, ge=1, le=100)

class LeaderboardResponse(BaseModel):
    scope: str
    period_days: int
    entries: List[LeaderboardEntry]

class TimeSeriesDataPoint(BaseModel):
    timestamp: str
    energy_joules: float
    carbon_kg: float
    cost_usd: float
    prompt_count: int

class TimeSeriesRequest(BaseModel):
    user_id: Optional[str] = None
    team_id: Optional[str] = None
    days: int = Field(default=30, ge=1, le=365)
    granularity: str = Field(default="day", pattern="^(hour|day)$")

class TimeSeriesResponse(BaseModel):
    scope: str
    period_days: int
    granularity: str
    data: List[TimeSeriesDataPoint]

class ModelListResponse(BaseModel):
    supported_models: List[str]
    by_category: Dict
    total_models: int

class ModelSpecs(BaseModel):
    model: str
    estimated_joules_per_token: float
    estimated_accuracy: float
    energy_per_1k_tokens: float
    carbon_per_1k_tokens_kg: float
    category: str

class RecommendRequest(BaseModel):
    priority: str = Field(default="balanced", pattern="^(efficiency|accuracy|balanced)$")
    min_accuracy: float = Field(default=0.85, ge=0, le=1)
    max_budget: Optional[float] = Field(default=None, ge=0)
    max_energy: Optional[float] = Field(default=None, ge=0)

class RecommendResponse(BaseModel):
    recommended_model: str
    reasoning: str
    model_specs: Dict
    alternatives: List[Dict]

class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    timestamp: datetime

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
