from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from sqlalchemy import func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

async def track_prompt_run(
    db: AsyncSession,
    owner: str,
    prompt: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
    energy_joules: float,
    carbon_kg: float,
    water_liters: float,
    cost_usd: float,
    team_id: Optional[str] = None
) -> Any:
    from app.models import PromptRun
    run = PromptRun(
        owner=owner,
        prompt_hash=str(hash(prompt)),
        prompt_length=len(prompt),
        model=model,
        prompt_tokens=input_tokens,
        estimated_output_tokens=output_tokens,
        energy_joules=energy_joules,
        carbon_kg=carbon_kg,
        water_liters=water_liters,
        cost_usd=cost_usd,
        team_id=team_id
    )
    db.add(run)
    await db.commit()
    await db.refresh(run)
    return run

async def get_user_stats(
    db: AsyncSession,
    user_id: str,
    days: int = 30
) -> Dict[str, Any]:
    start_date = datetime.utcnow() - timedelta(days=days)
    result = await db.execute(
        select(
            func.sum(__import__('app.models', fromlist=['PromptRun']).PromptRun.energy_joules),
            func.sum(__import__('app.models', fromlist=['PromptRun']).PromptRun.carbon_kg),
            func.sum(__import__('app.models', fromlist=['PromptRun']).PromptRun.water_liters),
            func.sum(__import__('app.models', fromlist=['PromptRun']).PromptRun.cost_usd),
            func.count(__import__('app.models', fromlist=['PromptRun']).PromptRun.id),
            func.avg(__import__('app.models', fromlist=['PromptRun']).PromptRun.energy_joules)
        )
    )
    row = result.one()
    return {
        "total_energy_joules": row[0] or 0,
        "total_carbon_kg": row[1] or 0,
        "total_water_liters": row[2] or 0,
        "total_cost_usd": row[3] or 0,
        "total_prompts": row[4] or 0,
        "avg_energy_per_prompt": row[5] or 0,
        "period_days": days
    }

async def get_team_stats(
    db: AsyncSession,
    team_id: str,
    days: int = 30
) -> Dict[str, Any]:
    from app.models import PromptRun
    start_date = datetime.utcnow() - timedelta(days=days)
    result = await db.execute(
        select(
            func.sum(PromptRun.energy_joules),
            func.sum(PromptRun.carbon_kg),
            func.sum(PromptRun.water_liters),
            func.sum(PromptRun.cost_usd),
            func.count(PromptRun.id)
        ).where(
            PromptRun.team_id == team_id,
            PromptRun.created_at >= start_date
        )
    )
    row = result.one()

    user_results = await db.execute(
        select(
            PromptRun.owner,
            func.sum(PromptRun.energy_joules),
            func.count(PromptRun.id)
        ).where(
            PromptRun.team_id == team_id,
            PromptRun.created_at >= start_date
        ).group_by(PromptRun.owner)
    )

    members = []
    for user_row in user_results.all():
        members.append({
            "user_id": user_row[0],
            "total_energy_joules": user_row[1] or 0,
            "prompt_count": user_row[2] or 0
        })
    members.sort(key=lambda x: x["total_energy_joules"])

    return {
        "team_id": team_id,
        "total_energy_joules": row[0] or 0,
        "total_carbon_kg": row[1] or 0,
        "total_water_liters": row[2] or 0,
        "total_cost_usd": row[3] or 0,
        "total_prompts": row[4] or 0,
        "period_days": days,
        "leaderboard": members
    }

async def get_time_series(
    db: AsyncSession,
    user_id: Optional[str] = None,
    team_id: Optional[str] = None,
    days: int = 30,
    granularity: str = "day"
) -> List[Dict[str, Any]]:
    from app.models import PromptRun
    start_date = datetime.utcnow() - timedelta(days=days)

    if granularity == "hour":
        date_trunc = func.date_trunc('hour', PromptRun.created_at)
    else:
        date_trunc = func.date_trunc('day', PromptRun.created_at)

    query = select(
        date_trunc.label('period'),
        func.sum(PromptRun.energy_joules),
        func.sum(PromptRun.carbon_kg),
        func.sum(PromptRun.cost_usd),
        func.count(PromptRun.id)
    ).where(PromptRun.created_at >= start_date)

    if user_id:
        query = query.where(PromptRun.owner == user_id)
    elif team_id:
        query = query.where(PromptRun.team_id == team_id)

    query = query.group_by('period').order_by('period')

    result = await db.execute(query)
    data = []
    for row in result.all():
        data.append({
            "timestamp": row[0].isoformat() if row[0] else None,
            "energy_joules": row[1] or 0,
            "carbon_kg": row[2] or 0,
            "cost_usd": row[3] or 0,
            "prompt_count": row[4] or 0
        })
    return data
