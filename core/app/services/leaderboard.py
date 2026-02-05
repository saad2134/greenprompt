from datetime import datetime, timedelta
from typing import Dict, List, Optional
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import PromptRun, Team, User

async def get_leaderboard(
    db: AsyncSession,
    scope: str = "team",
    team_id: Optional[str] = None,
    days: int = 30,
    limit: int = 10
) -> List[Dict]:
    start_date = datetime.utcnow() - timedelta(days=days)

    if scope == "global":
        result = await db.execute(
            select(
                PromptRun.owner,
                func.sum(PromptRun.energy_joules),
                func.sum(PromptRun.carbon_kg),
                func.count(PromptRun.id),
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.created_at >= start_date
            ).group_by(PromptRun.owner).order_by(
                func.sum(PromptRun.energy_joules)
            ).limit(limit)
        )

        entries = []
        for i, row in enumerate(result.all()):
            entries.append({
                "rank": i + 1,
                "user_id": row[0],
                "total_energy_joules": row[1] or 0,
                "total_carbon_kg": row[2] or 0,
                "prompt_count": row[3] or 0,
                "avg_energy_per_prompt": row[4] or 0
            })

    elif scope == "team":
        if not team_id:
            return []

        result = await db.execute(
            select(
                PromptRun.owner,
                func.sum(PromptRun.energy_joules),
                func.sum(PromptRun.carbon_kg),
                func.count(PromptRun.id),
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.team_id == team_id,
                PromptRun.created_at >= start_date
            ).group_by(PromptRun.owner).order_by(
                func.sum(PromptRun.energy_joules)
            ).limit(limit)
        )

        entries = []
        for i, row in enumerate(result.all()):
            entries.append({
                "rank": i + 1,
                "user_id": row[0],
                "total_energy_joules": row[1] or 0,
                "total_carbon_kg": row[2] or 0,
                "prompt_count": row[3] or 0,
                "avg_energy_per_prompt": row[4] or 0
            })

    elif scope == "organization":
        if not team_id:
            return []

        result = await db.execute(
            select(
                Team.id,
                Team.name,
                func.sum(PromptRun.energy_joules),
                func.sum(PromptRun.carbon_kg),
                func.count(PromptRun.id)
            ).join(Team, PromptRun.team_id == Team.id).where(
                Team.organization_id == team_id,
                PromptRun.created_at >= start_date
            ).group_by(Team.id).order_by(
                func.sum(PromptRun.energy_joules)
            ).limit(limit)
        )

        entries = []
        for i, row in enumerate(result.all()):
            entries.append({
                "rank": i + 1,
                "team_id": row[0],
                "team_name": row[1],
                "total_energy_joules": row[2] or 0,
                "total_carbon_kg": row[3] or 0,
                "prompt_count": row[4] or 0
            })

    return entries

async def get_most_improved(
    db: AsyncSession,
    team_id: Optional[str] = None,
    days: int = 30
) -> List[Dict]:
    mid_point = datetime.utcnow() - timedelta(days=days * 2)
    start_date = datetime.utcnow() - timedelta(days=days)

    if team_id:
        first_period = await db.execute(
            select(
                PromptRun.owner,
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.team_id == team_id,
                PromptRun.created_at >= mid_point,
                PromptRun.created_at < start_date
            ).group_by(PromptRun.owner)
        )

        second_period = await db.execute(
            select(
                PromptRun.owner,
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.team_id == team_id,
                PromptRun.created_at >= start_date
            ).group_by(PromptRun.owner)
        )
    else:
        first_period = await db.execute(
            select(
                PromptRun.owner,
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.created_at >= mid_point,
                PromptRun.created_at < start_date
            ).group_by(PromptRun.owner)
        )

        second_period = await db.execute(
            select(
                PromptRun.owner,
                func.avg(PromptRun.energy_joules)
            ).where(
                PromptRun.created_at >= start_date
            ).group_by(PromptRun.owner)
        )

    first_avg = {row[0]: row[1] for row in first_period.all()}
    second_avg = {row[0]: row[1] for row in second_period.all()}

    improvements = []
    for user_id in set(first_avg.keys()) & set(second_avg.keys()):
        if first_avg[user_id] and second_avg[user_id]:
            pct_improvement = ((first_avg[user_id] - second_avg[user_id]) / first_avg[user_id]) * 100
            if pct_improvement > 0:
                improvements.append({
                    "user_id": user_id,
                    "improvement_percent": round(pct_improvement, 2),
                    "previous_avg_energy": round(first_avg[user_id], 2),
                    "current_avg_energy": round(second_avg[user_id], 2)
                })

    improvements.sort(key=lambda x: x["improvement_percent"], reverse=True)
    return improvements[:10]

async def calculate_savings_comparison(
    db: AsyncSession,
    user_id: str,
    days: int = 30
) -> Dict:
    start_date = datetime.utcnow() - timedelta(days=days)

    result = await db.execute(
        select(
            func.avg(PromptRun.energy_joules),
            func.count(PromptRun.id)
        ).where(
            PromptRun.owner == user_id,
            PromptRun.created_at >= start_date
        )
    )
    row = result.one()
    avg_energy = row[0] or 0
    prompt_count = row[1] or 0

    baseline_energy_per_prompt = 150.0
    total_baseline_energy = prompt_count * baseline_energy_per_prompt
    actual_energy = prompt_count * avg_energy
    savings_energy = total_baseline_energy - actual_energy
    savings_percent = (savings_energy / total_baseline_energy) * 100 if total_baseline_energy > 0 else 0

    return {
        "prompt_count": prompt_count,
        "avg_energy_per_prompt": round(avg_energy, 2),
        "total_energy_used": round(actual_energy, 2),
        "baseline_energy": round(total_baseline_energy, 2),
        "energy_saved": round(savings_energy, 2),
        "savings_percent": round(savings_percent, 2),
        "co2_prevented_kg": round(savings_energy * 0.0004, 4),
        "water_saved_liters": round(savings_energy * 0.5, 2),
        "estimated_cost_savings": round(savings_energy * 0.00001, 4)
    }
