from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Any
from app.schemas import (
    AnalyzeRequest, AnalyzeResponse,
    OptimizeRequest, OptimizeResponse,
    BenchmarkRequest, BenchmarkResponse,
    TrackRequest, TrackResponse,
    UserStatsResponse, TeamStatsResponse,
    LeaderboardRequest, LeaderboardResponse,
    TimeSeriesRequest, TimeSeriesResponse,
    ModelListResponse, ModelSpecs,
    RecommendRequest, RecommendResponse,
    ErrorResponse
)
from app.database import get_db
from app.security import require_api_key
from app.models import PromptRun
from app.services.energy import (
    estimate_tokens, estimate_output_tokens, estimate_energy,
    calculate_carbon_footprint, calculate_cost,
    detect_task_type, detect_output_format,
    optimize_prompt, get_model_comparison,
    EFFICIENCY_MODELS
)
from app.services.tracking import track_prompt_run, get_user_stats, get_team_stats, get_time_series
from app.services.leaderboard import get_leaderboard, calculate_savings_comparison
from app.services.benchmark import run_benchmark, get_model_specs, list_supported_models, recommend_model

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse, responses={400: {"model": ErrorResponse}})
async def analyze_prompt(
    data: AnalyzeRequest,
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    if not data.prompt or not data.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    input_tokens = estimate_tokens(data.prompt)
    output_tokens = data.max_tokens or estimate_output_tokens(data.prompt, detect_task_type(data.prompt))
    energy = estimate_energy(input_tokens, output_tokens, data.model, data.output_format or "prose")
    carbon = calculate_carbon_footprint(energy, data.region or "us-west")
    cost = calculate_cost(energy, data.model.split("-")[0] if "-" in data.model else "openai")

    run = PromptRun(
        owner=owner,
        prompt_hash=str(hash(data.prompt)),
        prompt_length=len(data.prompt),
        model=data.model,
        prompt_tokens=input_tokens,
        estimated_output_tokens=output_tokens,
        energy_joules=energy,
        carbon_kg=carbon["co2_kg"],
        water_liters=carbon["water_liters"],
        cost_usd=cost["estimated_cost_usd"]
    )
    db.add(run)
    await db.commit()
    await db.refresh(run)

    model_info = EFFICIENCY_MODELS.get(data.model.lower(), {"joules_per_token": 1.5, "accuracy": 0.90})

    return AnalyzeResponse(
        input_tokens=input_tokens,
        estimated_output_tokens=output_tokens,
        energy_joules=energy,
        carbon_kg=carbon["co2_kg"],
        water_liters=carbon["water_liters"],
        estimated_cost_usd=cost["estimated_cost_usd"],
        task_type=detect_task_type(data.prompt),
        output_format=data.output_format or detect_output_format(data.prompt),
        confidence=0.92,
        model_info={
            "model": data.model,
            "energy_per_token": model_info["joules_per_token"],
            "estimated_accuracy": model_info["accuracy"]
        }
    )

@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_prompt_endpoint(
    data: OptimizeRequest,
    owner: str = Depends(require_api_key)
):
    optimized, suggestions = optimize_prompt(data.prompt)
    total_savings_joules = sum(s.energy_savings_joules for s in suggestions)
    total_savings_percent = sum(s.energy_savings_percent for s in suggestions) / max(len(suggestions), 1) if suggestions else 0

    carbon_savings = calculate_carbon_footprint(total_savings_joules)
    estimated_cost_savings = total_savings_joules * 0.00001

    new_tokens = estimate_tokens(optimized)

    suggestions_dicts = [
        {
            "type": s.type,
            "original_text": s.original_text,
            "suggested_text": s.suggested_text,
            "energy_savings_joules": s.energy_savings_joules,
            "energy_savings_percent": s.energy_savings_percent,
            "confidence": s.confidence,
            "reason": s.reason
        }
        for s in suggestions
    ]

    return OptimizeResponse(
        original_prompt=data.prompt,
        optimized_prompt=optimized,
        suggestions=suggestions_dicts,
        total_savings_joules=round(total_savings_joules, 2),
        total_savings_percent=round(total_savings_percent, 2),
        carbon_savings_kg=round(carbon_savings["co2_kg"], 6),
        cost_savings_usd=round(estimated_cost_savings, 6),
        estimated_new_tokens=new_tokens
    )

@router.post("/benchmark", response_model=BenchmarkResponse)
async def benchmark_prompt(
    data: BenchmarkRequest,
    owner: str = Depends(require_api_key)
):
    models = data.models or list(EFFICIENCY_MODELS.keys())[:10]
    result = await run_benchmark(data.prompt, models, data.include_standard)
    return result

@router.get("/models", response_model=ModelListResponse)
async def list_models():
    return await list_supported_models()

@router.get("/models/{model}", response_model=ModelSpecs)
async def get_model(model: str):
    specs = await get_model_specs(model)
    if "error" in specs:
        raise HTTPException(status_code=404, detail=specs["error"])
    return specs

@router.post("/recommend", response_model=RecommendResponse)
async def recommend_model_endpoint(data: RecommendRequest):
    return await recommend_model(data.model_dump())

@router.post("/track", response_model=TrackResponse)
async def track_run(
    data: TrackRequest,
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    input_tokens = data.input_tokens or estimate_tokens(data.prompt)
    output_tokens = data.output_tokens or estimate_output_tokens(data.prompt)
    energy = data.actual_energy_joules or estimate_energy(input_tokens, output_tokens)
    carbon = calculate_carbon_footprint(energy)
    cost = data.actual_cost_usd or calculate_cost(energy, data.model.split("-")[0] if "-" in data.model else "openai")

    run = await track_prompt_run(
        db=db,
        owner=owner,
        prompt=data.prompt,
        model=data.model,
        input_tokens=input_tokens,
        output_tokens=output_tokens,
        energy_joules=energy,
        carbon_kg=carbon["co2_kg"],
        water_liters=carbon["water_liters"],
        cost_usd=cost["estimated_cost_usd"],
        team_id=data.team_id
    )

    return TrackResponse(
        id=run.id,
        owner=run.owner,
        model=run.model,
        energy_joules=run.energy_joules,
        carbon_kg=run.carbon_kg,
        water_liters=run.water_liters,
        cost_usd=run.cost_usd,
        created_at=run.created_at
    )

@router.get("/stats/me", response_model=UserStatsResponse)
async def get_my_stats(
    days: int = Query(default=30, ge=1, le=365),
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    stats = await get_user_stats(db, owner, days)
    savings = await calculate_savings_comparison(db, owner, days)
    return UserStatsResponse(user_id=owner, savings_comparison=savings, **stats)

@router.get("/stats/team/{team_id}", response_model=TeamStatsResponse)
async def get_team_stats_endpoint(
    team_id: str,
    days: int = Query(default=30, ge=1, le=365),
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    return await get_team_stats(db, team_id, days)

@router.post("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard_endpoint(
    data: LeaderboardRequest,
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    entries = await get_leaderboard(db, data.scope, data.team_id, data.days, data.limit)
    return LeaderboardResponse(scope=data.scope, period_days=data.days, entries=entries)

@router.post("/timeseries", response_model=TimeSeriesResponse)
async def get_timeseries(
    data: TimeSeriesRequest,
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    scope = "user" if data.user_id else "team" if data.team_id else "user"
    series = await get_time_series(db, data.user_id, data.team_id, data.days, data.granularity)
    return TimeSeriesResponse(scope=scope, period_days=data.days, granularity=data.granularity, data=series)
