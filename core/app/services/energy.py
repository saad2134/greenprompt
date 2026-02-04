def estimate_tokens(text: str) -> int:
    return max(1, len(text) // 4)

def estimate_energy(input_tokens: int, output_tokens: int) -> float:
    joules_per_token = 0.5
    return (input_tokens + output_tokens) * joules_per_token
