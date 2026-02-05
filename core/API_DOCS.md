# GreenPrompt Core API Documentation

## Overview

GreenPrompt Core API is a production-grade backend service for analyzing, optimizing, and tracking LLM (Large Language Model) prompt energy usage. Built with FastAPI, it provides comprehensive tools to measure and reduce the environmental impact and costs of AI deployments.

## Features

- **Prompt Energy Analysis**: Estimate energy consumption, carbon footprint, and costs before running prompts
- **Smart Optimizations**: Get actionable suggestions to reduce energy usage by 15-40%
- **Model Benchmarking**: Compare energy efficiency across 15+ LLM models
- **Real-Time Tracking**: Track energy usage, CO2 emissions, water consumption, and costs
- **Team Leaderboards**: Gamified leaderboards to encourage efficiency
- **Time Series Analytics**: Historical data visualization with configurable granularity

## Quick Start

### Installation

```bash
# Clone the repository
cd core

# Install dependencies
pip install -e .

# Or with dev dependencies
pip install -e ".[dev]"
```

### Configuration

Create a `.env` file based on `.env.example`:

```env
# Required
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/greenprompt
API_KEY_SALT=your-secure-random-string

# Optional
REDIS_URL=redis://localhost:6379
RATE_LIMIT=1000
LOG_LEVEL=INFO
DEBUG=false
```

### Running

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker

```bash
docker-compose up -d
```

## API Reference

### Authentication

All API endpoints require authentication via Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.greenprompt.io/v1/analyze
```

### Endpoints

#### Health Check

**GET** `/health`

Returns service health status.

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-02-05T12:00:00Z"
}
```

#### Analyze Prompt

**POST** `/v1/analyze`

Analyze a prompt's energy consumption and get detailed metrics.

**Request:**
```json
{
  "prompt": "Explain photosynthesis in detail",
  "model": "gpt-4o",
  "max_tokens": 500,
  "output_format": "prose",
  "region": "us-west"
}
```

**Response:**
```json
{
  "input_tokens": 5,
  "estimated_output_tokens": 150,
  "energy_joules": 387.5,
  "carbon_kg": 0.000153,
  "water_liters": 193.75,
  "estimated_cost_usd": 0.0011625,
  "task_type": "analysis",
  "output_format": "prose",
  "confidence": 0.92,
  "model_info": {
    "model": "gpt-4o",
    "energy_per_token": 2.5,
    "estimated_accuracy": 0.95
  }
}
```

#### Optimize Prompt

**POST** `/v1/optimize`

Get optimization suggestions to reduce energy consumption.

**Request:**
```json
{
  "prompt": "Please explain in detail how photosynthesis works",
  "include_savings": true,
  "target_model": "gpt-4o"
}
```

**Response:**
```json
{
  "original_prompt": "Please explain in detail how photosynthesis works",
  "optimized_prompt": "Explain photosynthesis",
  "suggestions": [
    {
      "type": "remove_politeness",
      "original_text": "Please",
      "suggested_text": "[removed]",
      "energy_savings_joules": 0.5,
      "energy_savings_percent": 5.0,
      "confidence": 0.95,
      "reason": "Politeness phrases increase token count without affecting output quality."
    },
    {
      "type": "remove_vagueness",
      "original_text": "in detail",
      "suggested_text": "[specify focus areas]",
      "energy_savings_joules": 15.0,
      "energy_savings_percent": 10.0,
      "confidence": 0.80,
      "reason": "Vague directives waste tokens. Specify exact areas of focus instead."
    }
  ],
  "total_savings_joules": 15.5,
  "total_savings_percent": 7.5,
  "carbon_savings_kg": 0.0000062,
  "cost_savings_usd": 0.000155,
  "estimated_new_tokens": 140
}
```

#### Benchmark Models

**POST** `/v1/benchmark`

Compare energy usage across multiple models.

**Request:**
```json
{
  "prompt": "Write a summary of this document",
  "models": ["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-flash"],
  "include_standard": false
}
```

**Response:**
```json
{
  "benchmark_type": "custom",
  "prompt": "Write a summary of this document",
  "prompt_tokens": 7,
  "models": [
    {
      "model": "gemini-1.5-flash",
      "estimated_energy_joules": 60.0,
      "estimated_tokens": 157,
      "estimated_accuracy": 0.90,
      "efficiency_score": 1.125,
      "rank": 1,
      "carbon_footprint": {
        "co2_kg": 0.000024,
        "water_liters": 30.0,
        "energy_joules": 60.0
      }
    },
    {
      "model": "gpt-4o",
      "estimated_energy_joules": 392.5,
      "estimated_tokens": 157,
      "estimated_accuracy": 0.95,
      "efficiency_score": 0.242,
      "rank": 2,
      "carbon_footprint": {
        "co2_kg": 0.000154,
        "water_liters": 196.25,
        "energy_joules": 392.5
      }
    }
  ]
}
```

#### List Models

**GET** `/v1/models`

Get all supported models and their categories.

**Response:**
```json
{
  "supported_models": ["gpt-4o", "claude-3-5-sonnet", "gemini-1.5-flash", ...],
  "by_category": {
    "small_efficient": ["llama-3.1-8b", "qwen-7b", "gemini-1.5-flash"],
    "medium_balanced": ["gpt-4o-mini", "claude-3-haiku", "mistral-small"],
    "large_capable": ["gpt-4o", "claude-3-5-sonnet", "llama-3.1-405b"]
  },
  "total_models": 15
}
```

#### Recommend Model

**POST** `/v1/recommend`

Get model recommendations based on requirements.

**Request:**
```json
{
  "priority": "balanced",
  "min_accuracy": 0.90,
  "max_budget": 0.002,
  "max_energy": 500
}
```

**Response:**
```json
{
  "recommended_model": "claude-3-5-sonnet",
  "reasoning": "Best match for balanced priority with accuracy >= 0.90",
  "model_specs": {
    "energy_per_token": 1.8,
    "accuracy": 0.94,
    "efficiency_score": 0.52
  },
  "alternatives": [
    {"model": "gemini-1.5-pro", "efficiency_score": 0.46},
    {"model": "gpt-4o", "efficiency_score": 0.24}
  ]
}
```

#### Track Usage

**POST** `/v1/track`

Track actual prompt run metrics.

**Request:**
```json
{
  "prompt": "Analyze this data",
  "model": "gpt-4o",
  "input_tokens": 50,
  "output_tokens": 200,
  "actual_energy_joules": 625,
  "actual_cost_usd": 0.00375,
  "team_id": "team-123"
}
```

#### Get User Stats

**GET** `/v1/stats/me`

Get current user's statistics.

```json
{
  "user_id": "user-123",
  "period_days": 30,
  "total_energy_joules": 15000.0,
  "total_carbon_kg": 0.006,
  "total_water_liters": 7500.0,
  "total_cost_usd": 0.15,
  "total_prompts": 150,
  "avg_energy_per_prompt": 100.0,
  "savings_comparison": {
    "prompt_count": 150,
    "energy_saved": 7500.0,
    "savings_percent": 33.3,
    "co2_prevented_kg": 0.003,
    "water_saved_liters": 3750.0
  }
}
```

#### Get Team Stats

**GET** `/v1/stats/team/{team_id}`

Get team statistics with leaderboard.

#### Get Leaderboard

**POST** `/v1/leaderboard`

Get efficiency leaderboard.

**Request:**
```json
{
  "scope": "team",
  "team_id": "team-123",
  "days": 30,
  "limit": 10
}
```

#### Get Time Series

**POST** `/v1/timeseries`

Get historical data for visualization.

**Request:**
```json
{
  "user_id": "user-123",
  "days": 30,
  "granularity": "day"
}
```

## Model Energy Specifications

| Model | Joules/Token | Accuracy | Category |
|-------|-------------|----------|----------|
| gpt-4o | 2.50 | 0.95 | Large |
| gpt-4o-mini | 0.80 | 0.92 | Small |
| claude-3-5-sonnet | 1.80 | 0.94 | Large |
| claude-3-haiku | 0.50 | 0.88 | Small |
| gemini-1.5-pro | 1.20 | 0.93 | Medium |
| gemini-1.5-flash | 0.40 | 0.90 | Small |
| mistral-large | 1.50 | 0.92 | Medium |
| mistral-small | 0.40 | 0.87 | Small |
| llama-3.1-405b | 3.50 | 0.96 | Large |
| llama-3.1-70b | 1.40 | 0.92 | Medium |
| llama-3.1-8b | 0.35 | 0.84 | Small |
| qwen-72b | 1.80 | 0.91 | Large |
| qwen-32b | 1.00 | 0.89 | Medium |
| qwen-7b | 0.50 | 0.86 | Small |

## Rate Limits

| Plan | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Pro | 300 | 50,000 |
| Enterprise | 1,000 | Unlimited |

## Error Handling

All errors return standard HTTP status codes with JSON response:

```json
{
  "error": "Error message",
  "detail": "Detailed information (only in debug mode)",
  "code": "ERROR_CODE"
}
```

Common status codes:
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid API key)
- `404` - Not Found (resource doesn't exist)
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

## SDKs

### Python

```python
from greenprompt import GreenPrompt

client = GreenPrompt(api_key="YOUR_API_KEY")

# Analyze
result = client.analyze(
    prompt="Explain photosynthesis",
    model="gpt-4o"
)

# Optimize
optimized = client.optimize(prompt="Please explain in detail...")
```

### JavaScript/TypeScript

```typescript
import { GreenPrompt } from '@greenprompt/sdk';

const client = new GreenPrompt({ apiKey: 'YOUR_API_KEY' });

const result = await client.analyze({
  prompt: 'Explain photosynthesis',
  model: 'gpt-4o'
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Install dev dependencies: `pip install -e ".[dev]"`
4. Run tests: `pytest`
5. Run linting: `ruff check . && black --check .`
6. Submit a PR

## License

MIT License - see LICENSE file for details.
