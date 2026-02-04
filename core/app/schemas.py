from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    prompt: str
    model: str = "gpt-4"
    max_tokens: int | None = None

class AnalyzeResponse(BaseModel):
    input_tokens: int
    estimated_output_tokens: int
    energy_joules: float
    confidence: float
