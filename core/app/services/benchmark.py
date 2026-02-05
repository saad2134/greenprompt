from typing import Dict, List, Optional
from app.services.energy import (
    estimate_tokens,
    estimate_output_tokens,
    estimate_energy,
    EFFICIENCY_MODELS,
    calculate_carbon_footprint,
    get_model_comparison
)

BENCHMARK_PROMPTS = {
    "simple": "What is 2+2?",
    "standard": "Explain the concept of photosynthesis in 3 sentences.",
    "complex": "Analyze the economic impact of renewable energy on developing nations, considering factors like job creation, infrastructure costs, and long-term environmental benefits.",
    "creative": "Write a short story about a robot learning to paint.",
    "technical": "Implement a Python function to calculate Fibonacci numbers using dynamic programming.",
    "analytical": "Compare and contrast the leadership styles of Winston Churchill and Nelson Mandela.",
}

async def run_benchmark(
    prompt: Optional[str] = None,
    models: Optional[List[str]] = None,
    include_standard: bool = True
) -> Dict:
    if models is None:
        models = list(EFFICIENCY_MODELS.keys())[:10]

    if prompt is None and include_standard:
        results = {}
        for category, standard_prompt in BENCHMARK_PROMPTS.items():
            model_comparison = get_model_comparison(models, standard_prompt)
            results[category] = {
                "prompt": standard_prompt,
                "prompt_tokens": estimate_tokens(standard_prompt),
                "models": model_comparison
            }
        return {
            "benchmark_type": "standard",
            "categories": list(BENCHMARK_PROMPTS.keys()),
            "results": results
        }

    if prompt:
        model_comparison = get_model_comparison(models, prompt)
        return {
            "benchmark_type": "custom",
            "prompt": prompt,
            "prompt_tokens": estimate_tokens(prompt),
            "models": model_comparison
        }

    return {"error": "No prompt provided and standard benchmarks disabled"}

async def get_model_specs(model: str) -> Dict:
    model_lower = model.lower()
    if model_lower in EFFICIENCY_MODELS:
        info = EFFICIENCY_MODELS[model_lower]
        return {
            "model": model,
            "estimated_joules_per_token": info["joules_per_token"],
            "estimated_accuracy": info["accuracy"],
            "energy_per_1k_tokens": round(info["joules_per_token"] * 1000, 2),
            "carbon_per_1k_tokens_kg": round(info["joules_per_token"] * 1000 * 0.0004 / 1000, 6),
            "category": "small" if info["joules_per_token"] < 0.5 else "medium" if info["joules_per_token"] < 1.5 else "large"
        }
    return {"error": f"Model {model} not found in benchmarks"}

async def list_supported_models() -> Dict:
    models_by_category = {
        "small_efficient": [],
        "medium_balanced": [],
        "large_capable": []
    }

    for model, info in EFFICIENCY_MODELS.items():
        if info["joules_per_token"] < 0.5:
            models_by_category["small_efficient"].append(model)
        elif info["joules_per_token"] < 1.5:
            models_by_category["medium_balanced"].append(model)
        else:
            models_by_category["large_capable"].append(model)

    return {
        "supported_models": list(EFFICIENCY_MODELS.keys()),
        "by_category": models_by_category,
        "total_models": len(EFFICIENCY_MODELS)
    }

async def recommend_model(
    requirements: Dict
) -> Dict:
    priority = requirements.get("priority", "balanced")
    min_accuracy = requirements.get("min_accuracy", 0.85)
    max_budget = requirements.get("max_budget")
    max_energy = requirements.get("max_energy")

    candidates = []

    for model, info in EFFICIENCY_MODELS.items():
        if info["accuracy"] < min_accuracy:
            continue

        if max_budget:
            cost = info["joules_per_token"] * 1000 * 0.00001
            if cost > max_budget:
                continue

        if max_energy and info["joules_per_token"] > max_energy:
            continue

        efficiency_score = info["accuracy"] / info["joules_per_token"]
        candidates.append((model, info, efficiency_score))

    if not candidates:
        return {"error": "No models match the specified requirements"}

    if priority == "efficiency":
        candidates.sort(key=lambda x: x[2], reverse=True)
    elif priority == "accuracy":
        candidates.sort(key=lambda x: x[1]["accuracy"], reverse=True)
    else:
        candidates.sort(key=lambda x: x[2], reverse=True)

    best = candidates[0]

    return {
        "recommended_model": best[0],
        "reasoning": f"Best match for {priority} priority with accuracy >= {min_accuracy}",
        "model_specs": {
            "energy_per_token": best[1]["joules_per_token"],
            "accuracy": best[1]["accuracy"],
            "efficiency_score": round(best[2], 2)
        },
        "alternatives": [
            {"model": m[0], "efficiency_score": round(m[2], 2)}
            for m in candidates[1:4]
        ]
    }
