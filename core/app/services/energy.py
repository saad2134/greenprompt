import re
import json
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

OPTIMIZATION_KEYWORDS = {
    "high_energy": [
        "analyze in detail", "explain thoroughly", "comprehensive analysis",
        "elaborate on", "describe in depth", "provide extensive details",
        "think step by step", "reason through", "explain your reasoning"
    ],
    "medium_energy": [
        "analyze", "explain", "describe", "summarize", "compare",
        "evaluate", "assess", "review", "discuss"
    ],
    "low_energy": [
        "classify", "categorize", "identify", "list", "count",
        "extract", "find", "check", "verify", "extract"
    ]
}

EFFICIENCY_MODELS = {
    "gpt-4o": {"joules_per_token": 2.5, "accuracy": 0.95},
    "gpt-4o-mini": {"joules_per_token": 0.8, "accuracy": 0.92},
    "gpt-3.5-turbo": {"joules_per_token": 0.6, "accuracy": 0.89},
    "claude-3-5-sonnet": {"joules_per_token": 1.8, "accuracy": 0.94},
    "claude-3-haiku": {"joules_per_token": 0.5, "accuracy": 0.88},
    "gemini-2.5-pro": {"joules_per_token": 1.5, "accuracy": 0.96},
    "gemini-2.5-flash": {"joules_per_token": 0.35, "accuracy": 0.94},
    "gemini-2.5-flash-lite": {"joules_per_token": 0.2, "accuracy": 0.91},
    "gemini-2.0-flash": {"joules_per_token": 0.3, "accuracy": 0.92},
    "gemini-2.0-flash-lite": {"joules_per_token": 0.15, "accuracy": 0.89},
    "gemini-1.5-pro": {"joules_per_token": 1.2, "accuracy": 0.93},
    "gemini-1.5-flash": {"joules_per_token": 0.4, "accuracy": 0.90},
    "gemini-3-pro": {"joules_per_token": 0.9, "accuracy": 0.92},
    "gemini-3-flash": {"joules_per_token": 0.35, "accuracy": 0.90},
    "mistral-large": {"joules_per_token": 1.5, "accuracy": 0.92},
    "mistral-medium": {"joules_per_token": 0.9, "accuracy": 0.90},
    "mistral-small": {"joules_per_token": 0.4, "accuracy": 0.87},
    "qwen-72b": {"joules_per_token": 1.8, "accuracy": 0.91},
    "qwen-32b": {"joules_per_token": 1.0, "accuracy": 0.89},
    "qwen-7b": {"joules_per_token": 0.5, "accuracy": 0.86},
    "llama-3-70b": {"joules_per_token": 1.6, "accuracy": 0.91},
    "llama-3-8b": {"joules_per_token": 0.4, "accuracy": 0.85},
    "llama-3.1-405b": {"joules_per_token": 3.5, "accuracy": 0.96},
    "llama-3.1-70b": {"joules_per_token": 1.4, "accuracy": 0.92},
    "llama-3.1-8b": {"joules_per_token": 0.35, "accuracy": 0.84},
}

STRUCTURE_SAVINGS = {
    "json": 0.25,
    "bullets": 0.20,
    "numbered_list": 0.15,
    "table": 0.18,
    "markdown_headers": 0.10,
    "prose": 0.0
}

@dataclass
class OptimizationSuggestion:
    type: str
    original_text: str
    suggested_text: str
    energy_savings_joules: float
    energy_savings_percent: float
    confidence: float
    reason: str

def estimate_tokens(text: str) -> int:
    if not text or not text.strip():
        return 0
    tokens = re.findall(r'\b\w+\b|[^\w\s]|\s+', text)
    return max(1, len(tokens))

def estimate_output_tokens(prompt: str, task_type: str = "standard") -> int:
    prompt_tokens = estimate_tokens(prompt)
    multipliers = {
        "analysis": 2.5,
        "generation": 3.0,
        "classification": 0.5,
        "summarization": 0.3,
        "standard": 1.5
    }
    multiplier = multipliers.get(task_type, 1.5)
    return max(50, int(prompt_tokens * multiplier))

def estimate_energy(
    input_tokens: int,
    output_tokens: int,
    model: str = "gpt-4o",
    output_format: str = "prose"
) -> float:
    model_info = EFFICIENCY_MODELS.get(model.lower(), EFFICIENCY_MODELS["gpt-4o"])
    base_joules = (input_tokens + output_tokens) * model_info["joules_per_token"]
    format_saving = STRUCTURE_SAVINGS.get(output_format.lower(), 0.0)
    return base_joules * (1 - format_saving)

def calculate_carbon_footprint(energy_joules: float, region: str = "us-west") -> Dict[str, float]:
    carbon_factors = {
        "us-west": 0.00035,
        "us-east": 0.00042,
        "eu-west": 0.00028,
        "eu-central": 0.00032,
        "asia-east": 0.00055,
        "asia-south": 0.00048,
        "default": 0.00040
    }
    factor = carbon_factors.get(region.lower(), carbon_factors["default"])
    co2_kg = energy_joules * factor / 1000
    return {
        "co2_kg": round(co2_kg, 6),
        "water_liters": round(energy_joules * 0.5, 2),
        "energy_joules": energy_joules
    }

def calculate_cost(energy_joules: float, provider: str = "openai") -> Dict[str, float]:
    cost_per_1000_tokens = {
        "openai": {"gpt-4o": 0.005, "gpt-4o-mini": 0.00015, "gpt-3.5-turbo": 0.0005},
        "anthropic": {"claude-3-5-sonnet": 0.003, "claude-3-haiku": 0.00025},
        "google": {
            "gemini-2.5-pro": 0.00125, "gemini-2.5-flash": 0.00015, "gemini-2.5-flash-lite": 0.000075,
            "gemini-2.0-flash": 0.00010, "gemini-2.0-flash-lite": 0.00005,
            "gemini-1.5-pro": 0.00125, "gemini-1.5-flash": 0.000075,
            "gemini-3-pro": .00050, "gemini-3-flash": 0.00010,
        },
        "mistral": {"mistral-large": 0.002, "mistral-medium": 0.001, "mistral-small": 0.0002},
        "meta": {"llama-3-70b": 0.0009, "llama-3-8b": 0.00008, "llama-3.1-405b": 0.005, "llama-3.1-70b": 0.0009, "llama-3.1-8b": 0.00008},
    }
    default_cost = 0.001
    provider_key = provider.lower()

    if provider_key in cost_per_1000_tokens:
        model_pricing = cost_per_1000_tokens[provider_key]
        cost_per_token = 0.001
        for model_name, price in model_pricing.items():
            if model_name in provider:
                cost_per_token = price
                break
    else:
        cost_per_token = default_cost

    tokens_approx = energy_joules / 0.5
    estimated_cost = (tokens_approx / 1000) * cost_per_token
    return {
        "estimated_cost_usd": round(estimated_cost, 6),
        "currency": "USD",
        "provider": provider
    }

def detect_task_type(prompt: str) -> str:
    prompt_lower = prompt.lower()
    if any(kw in prompt_lower for kw in ["analyze", "evaluate", "assess"]):
        return "analysis"
    elif any(kw in prompt_lower for kw in ["write", "create", "generate", "compose"]):
        return "generation"
    elif any(kw in prompt_lower for kw in ["classify", "categorize", "tag"]):
        return "classification"
    elif any(kw in prompt_lower for kw in ["summarize", "condense", "abridge"]):
        return "summarization"
    return "standard"

def detect_output_format(prompt: str) -> str:
    prompt_lower = prompt.lower()
    if "json" in prompt_lower:
        return "json"
    elif any(kw in prompt_lower for kw in ["bullet", "list", "- "]):
        return "bullets"
    elif any(kw in prompt_lower for kw in ["table", "column", "row"]):
        return "table"
    elif "# " in prompt or "heading" in prompt_lower:
        return "markdown_headers"
    return "prose"

def optimize_prompt(prompt: str) -> Tuple[str, List[OptimizationSuggestion]]:
    suggestions = []
    original_prompt = prompt
    optimized_prompt = prompt
    total_savings = 0.0

    prompt_lower = prompt.lower()

    for keyword in OPTIMIZATION_KEYWORDS["high_energy"]:
        if keyword in prompt_lower:
            for low_energy in OPTIMIZATION_KEYWORDS["low_energy"]:
                if low_energy not in prompt_lower:
                    savings = estimate_tokens(keyword) * 0.5
                    total_savings += savings
                    suggestions.append(OptimizationSuggestion(
                        type="keyword_replacement",
                        original_text=keyword,
                        suggested_text=low_energy,
                        energy_savings_joules=savings,
                        energy_savings_percent=15.0,
                        confidence=0.85,
                        reason=f"'{keyword}' consumes high energy. '{low_energy}' achieves similar result with lower overhead."
                    ))
                    optimized_prompt = optimized_prompt.replace(keyword, low_energy)
                    break
            break

    if "please" in prompt_lower or "could you" in prompt_lower:
        original = "Please "
        if optimized_prompt.lower().startswith("please "):
            optimized_prompt = optimized_prompt[7:]
            savings = estimate_tokens(original) * 0.5
            total_savings += savings
            suggestions.append(OptimizationSuggestion(
                type="remove_politeness",
                original_text="Please",
                suggested_text="[removed]",
                energy_savings_joules=savings,
                energy_savings_percent=5.0,
                confidence=0.95,
                reason="Politeness phrases increase token count without affecting output quality."
            ))

    if "in detail" in prompt_lower or "in depth" in prompt_lower:
        savings = 15.0
        total_savings += savings
        suggestions.append(OptimizationSuggestion(
            type="remove_vagueness",
            original_text="in detail/in depth",
            suggested_text="[specify focus areas]",
            energy_savings_joules=savings,
            energy_savings_percent=10.0,
            confidence=0.80,
            reason="Vague directives waste tokens. Specify exact areas of focus instead."
        ))

    if "think step by step" in prompt_lower:
        savings = 25.0
        total_savings += savings
        suggestions.append(OptimizationSuggestion(
            type="remove_reasoning",
            original_text="think step by step",
            suggested_text="[removed for efficiency]",
            energy_savings_joules=savings,
            energy_savings_percent=12.0,
            confidence=0.70,
            reason="Chain-of-thought significantly increases output. Use only when necessary."
        ))

    if not re.search(r'(json|bullet|list|table|max_tokens|limit)', prompt_lower):
        savings = 10.0
        suggestions.append(OptimizationSuggestion(
            type="add_constraint",
            original_text="[no constraints]",
            suggested_text="Add output format or token limit",
            energy_savings_joules=savings,
            energy_savings_percent=8.0,
            confidence=0.75,
            reason="Adding output constraints helps models produce focused, efficient responses."
        ))

    if len(prompt) > 500 and estimate_tokens(prompt) > 100:
        savings = estimate_tokens(prompt) * 0.1
        total_savings += savings
        suggestions.append(OptimizationSuggestion(
            type="concise_instruction",
            original_text="[long prompt]",
            suggested_text="Summarize key requirements",
            energy_savings_joules=savings,
            energy_savings_percent=10.0,
            confidence=0.65,
            reason="Concise prompts with clear requirements outperform verbose ones."
        ))

    return optimized_prompt.strip(), suggestions

def get_model_comparison(models: List[str], prompt: str) -> List[Dict]:
    input_tokens = estimate_tokens(prompt)
    output_tokens = estimate_output_tokens(prompt)
    task_type = detect_task_type(prompt)
    output_format = detect_output_format(prompt)

    results = []
    for model in models:
        model_lower = model.lower()
        energy = estimate_energy(input_tokens, output_tokens, model_lower, output_format)
        model_info = EFFICIENCY_MODELS.get(model_lower, {"joules_per_token": 1.5, "accuracy": 0.85})
        efficiency_score = model_info["accuracy"] / (model_info["joules_per_token"] / 0.5)

        results.append({
            "model": model,
            "estimated_energy_joules": round(energy, 2),
            "estimated_tokens": input_tokens + output_tokens,
            "estimated_accuracy": model_info["accuracy"],
            "efficiency_score": round(efficiency_score, 2),
            "carbon_footprint": calculate_carbon_footprint(energy)
        })

    results.sort(key=lambda x: x["estimated_energy_joules"])
    for i, r in enumerate(results):
        r["rank"] = i + 1

    return results
