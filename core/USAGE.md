# Usage Guide

## Getting Started

This guide covers how to use the GreenPrompt Core API effectively.

## Authentication

All API requests require authentication using an API key:

```bash
# Set your API key
export GREENPROMPT_API_KEY="your-api-key-here"

# Make authenticated requests
curl -H "Authorization: Bearer $GREENPROMPT_API_KEY" \
     https://api.greenprompt.io/v1/analyze \
     -d '{"prompt": "Explain quantum computing", "model": "gpt-4o"}'
```

## Quick Examples

### 1. Analyze a Prompt's Energy Usage

```python
import requests

url = "https://api.greenprompt.io/v1/analyze"
payload = {
    "prompt": "Analyze the economic impact of AI on healthcare",
    "model": "gpt-4o",
    "max_tokens": 1000,
    "output_format": "prose",
    "region": "us-west"
}
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

**Expected Response:**
```json
{
  "input_tokens": 11,
  "estimated_output_tokens": 1500,
  "energy_joules": 3777.5,
  "carbon_kg": 0.001511,
  "water_liters": 1888.75,
  "estimated_cost_usd": 0.0113325,
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

### 2. Optimize a Prompt

```python
payload = {
    "prompt": "Please analyze this in great detail and explain everything thoroughly",
    "include_savings": True,
    "target_model": "gpt-4o"
}

response = requests.post(
    "https://api.greenprompt.io/v1/optimize",
    json=payload,
    headers=headers
)
```

**Expected Response:**
```json
{
  "original_prompt": "Please analyze this in great detail...",
  "optimized_prompt": "Analyze this",
  "suggestions": [
    {
      "type": "remove_politeness",
      "original_text": "Please",
      "suggested_text": "[removed]",
      "energy_savings_joules": 0.5,
      "energy_savings_percent": 5.0,
      "confidence": 0.95,
      "reason": "Politeness phrases increase token count..."
    },
    {
      "type": "remove_vagueness",
      "original_text": "in great detail",
      "suggested_text": "[specify focus areas]",
      "energy_savings_joules": 20.0,
      "energy_savings_percent": 12.0,
      "confidence": 0.75,
      "reason": "Vague directives waste tokens..."
    }
  ],
  "total_savings_joules": 20.5,
  "total_savings_percent": 8.5,
  "carbon_savings_kg": 0.0000082,
  "cost_savings_usd": 0.000205
}
```

### 3. Compare Models for Efficiency

```python
payload = {
    "prompt": "Summarize the key findings of this research paper",
    "models": [
        "gpt-4o",
        "claude-3-5-sonnet",
        "gemini-1.5-flash",
        "llama-3.1-8b"
    ],
    "include_standard": False
}

response = requests.post(
    "https://api.greenprompt.io/v1/benchmark",
    json=payload,
    headers=headers
)
```

### 4. Get Model Recommendations

```python
payload = {
    "priority": "balanced",  # "efficiency", "accuracy", or "balanced"
    "min_accuracy": 0.90,
    "max_budget": 0.002,  # Max cost per prompt in USD
    "max_energy": 500      # Max energy per prompt in Joules
}

response = requests.post(
    "https://api.greenprompt.io/v1/recommend",
    json=payload,
    headers=headers
)
```

### 5. Track Usage

```python
payload = {
    "prompt": "Your actual prompt here",
    "model": "gpt-4o",
    "input_tokens": 50,
    "output_tokens": 200,
    "actual_energy_joules": 625,
    "actual_cost_usd": 0.00375,
    "team_id": "engineering-team-alpha"
}

response = requests.post(
    "https://api.greenprompt.io/v1/track",
    json=payload,
    headers=headers
)
```

### 6. View Your Stats

```python
# Get personal stats
response = requests.get(
    "https://api.greenprompt.io/v1/stats/me?days=30",
    headers=headers
)

# Get team stats
response = requests.get(
    "https://api.greenprompt.io/v1/stats/team/engineering-team-alpha?days=30",
    headers=headers
)
```

### 7. View Leaderboards

```python
payload = {
    "scope": "team",  # "global", "team", or "organization"
    "team_id": "engineering-team-alpha",
    "days": 30,
    "limit": 10
}

response = requests.post(
    "https://api.greenprompt.io/v1/leaderboard",
    json=payload,
    headers=headers
)
```

### 8. Get Time Series Data

```python
payload = {
    "user_id": "your-user-id",  # or use team_id
    "days": 30,
    "granularity": "day"  # or "hour"
}

response = requests.post(
    "https://api.greenprompt.io/v1/timeseries",
    json=payload,
    headers=headers
)
```

## Best Practices

### 1. Always Check Energy Before Running

```python
# Before making an expensive LLM call
result = client.analyze(prompt)

if result.energy_joules > 500:  # Your threshold
    # Either optimize or use a more efficient model
    optimized = client.optimize(prompt)
    result = client.analyze(optimized.optimized_prompt, model="gemini-1.5-flash")
```

### 2. Use Appropriate Models

| Task Type | Recommended Models |
|-----------|------------------|
| Simple classification | gpt-4o-mini, claude-3-haiku |
| Code generation | claude-3-5-sonnet, gpt-4o |
| Creative writing | claude-3-5-sonnet, gpt-4o |
| Data analysis | gpt-4o, claude-3-5-sonnet |
| High-volume/low-stakes | llama-3.1-8b, gemini-1.5-flash |

### 3. Optimize Prompts

Always run optimization before using prompts in production:

```python
original = "Please explain in detail how machine learning works"
optimized = client.optimize(original)
# Use optimized.optimized_prompt
```

### 4. Track Everything

Enable automatic tracking for all prompts:

```python
# Add tracking to all your LLM calls
result = client.analyze(prompt)
client.track(
    prompt=prompt,
    model=model_name,
    input_tokens=result.input_tokens,
    output_tokens=result.estimated_output_tokens,
    team_id="your-team"
)
```

### 5. Use Team Features

Encourage team competition:

```python
# Get team leaderboard weekly
leaderboard = client.get_leaderboard(
    scope="team",
    team_id="your-team",
    days=7
)

# Share in team channel
print(f"Team Energy Leaderboard:\n{leaderboard}")
```

## Common Patterns

### Batch Processing

```python
def analyze_batch(prompts, model="gpt-4o"):
    results = []
    for prompt in prompts:
        result = client.analyze(prompt, model=model)
        results.append(result)
        time.sleep(0.1)  # Rate limiting
    return results
```

### Optimization Pipeline

```python
def optimize_for_efficiency(prompt, max_energy=100):
    # Get initial analysis
    initial = client.analyze(prompt)
    
    if initial.energy_joules <= max_energy:
        return prompt, initial
    
    # Try optimizations
    optimized = client.optimize(prompt)
    
    if optimized.total_savings_joules > 0:
        # Check if optimized version meets threshold
        new_analysis = client.analyze(optimized.optimized_prompt)
        if new_analysis.energy_joules <= max_energy:
            return optimized.optimized_prompt, new_analysis
    
    # Try different model
    recommendation = client.recommend({
        "priority": "efficiency",
        "min_accuracy": 0.85
    })
    
    return prompt, initial, recommendation
```

### Cost Monitoring

```python
def monitor_costs():
    stats = client.get_my_stats(days=30)
    
    monthly_cost = stats.total_cost_usd
    projected_monthly = monthly_cost * (30 / 30)
    
    if projected_monthly > 100:  # Your budget
        print(f"Alert: Projected monthly cost ${projected_monthly:.2f}")
    
    return stats
```

## SDK Usage

### Python SDK

```python
from greenprompt import GreenPrompt

client = GreenPrompt(
    api_key="your-api-key",
    base_url="https://api.greenprompt.io"
)

# All methods return typed responses
result = client.analyze(
    prompt="Your prompt",
    model="gpt-4o"
)

print(f"Energy: {result.energy_joules} J")
print(f"CO2: {result.carbon_kg} kg")
```

### JavaScript SDK

```typescript
import { GreenPrompt } from '@greenprompt/sdk';

const client = new GreenPrompt({ 
  apiKey: process.env.GREENPROMPT_API_KEY 
});

const result = await client.analyze({
  prompt: 'Your prompt',
  model: 'gpt-4o'
});

console.log(`Energy: ${result.energyJoules}J`);
```

## Rate Limits

| Plan | Requests/Minute | Daily Limit |
|------|-----------------|-------------|
| Free | 60 | 1,000 |
| Pro | 300 | 50,000 |
| Enterprise | 1,000 | Unlimited |

Handle rate limiting gracefully:

```python
import time
from requests.exceptions import TooManyRequests

def safe_analyze(prompt, retries=3):
    for attempt in range(retries):
        try:
            return client.analyze(prompt)
        except TooManyRequests:
            wait_time = 60  # Wait 1 minute
            print(f"Rate limited. Waiting {wait_time}s...")
            time.sleep(wait_time)
        except Exception as e:
            print(f"Error: {e}")
            break
    return None
```

## Error Handling

```python
from greenprompt import GreenPromptError, AuthenticationError

try:
    result = client.analyze(prompt)
except AuthenticationError:
    print("Invalid API key")
except GreenPromptError as e:
    print(f"API error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Additional Resources

- [API Documentation](/docs)
- [Model Specifications](API_DOCS.md)
- [Deployment Guide](DEPLOYMENT.md)
- [GitHub Repository](https://github.com/saad2134/GreenPrompt)
