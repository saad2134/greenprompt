from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.database import get_db
from app.security import require_api_key
from app.services.energy import estimate_tokens, estimate_energy
from app.models import PromptRun

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_prompt(
    data: AnalyzeRequest,
    owner: str = Depends(require_api_key),
    db: AsyncSession = Depends(get_db)
):
    input_tokens = estimate_tokens(data.prompt)
    output_tokens = data.max_tokens or int(input_tokens * 1.5)
    energy = estimate_energy(input_tokens, output_tokens)

    run = PromptRun(
        owner=owner,
        prompt_tokens=input_tokens,
        estimated_output_tokens=output_tokens,
        energy_joules=energy,
        model=data.model
    )

    db.add(run)
    await db.commit()

    return AnalyzeResponse(
        input_tokens=input_tokens,
        estimated_output_tokens=output_tokens,
        energy_joules=energy,
        confidence=0.9
    )
