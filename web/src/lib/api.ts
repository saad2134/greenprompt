import { CORE_CONFIG } from "@/config/CORE_CONFIG";

const COOLDOWN_MINUTES = 5;
const COOLDOWN_COOKIE_NAME = "greenprompt_analyze_cooldown";
const COOLDOWN_LOCALSTORAGE_KEY = "greenprompt_analyze_last_run";
const API_KEY_LOCALSTORAGE_KEY = "greenprompt_api_key";
const DEMO_API_KEY = "demo-api-key-12345";

export interface AnalyzeResult {
  input_tokens: number;
  estimated_output_tokens: number;
  energy_joules: number;
  carbon_kg: number;
  water_liters: number;
  estimated_cost_usd: number;
  task_type: string;
  output_format: string;
  confidence: number;
  model_info: {
    model: string;
    energy_per_token: number;
    estimated_accuracy: number;
  };
}

export interface OptimizationResult {
  original_prompt: string;
  optimized_prompt: string;
  suggestions: Array<{
    type: string;
    original_text: string;
    suggested_text: string;
    energy_savings_joules: number;
    energy_savings_percent: number;
    confidence: number;
    reason: string;
  }>;
  total_savings_joules: number;
  total_savings_percent: number;
  carbon_savings_kg: number;
  cost_savings_usd: number;
  estimated_new_tokens: number;
}

function getApiKey(): string {
  if (typeof window === 'undefined') return DEMO_API_KEY;

  const storedKey = localStorage.getItem(API_KEY_LOCALSTORAGE_KEY);
  if (storedKey && storedKey.trim()) {
    return storedKey;
  }

  return DEMO_API_KEY;
}

export function setApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_KEY_LOCALSTORAGE_KEY, key);
  }
}

export function clearApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(API_KEY_LOCALSTORAGE_KEY);
  }
}

export function hasCustomApiKey(): boolean {
  if (typeof window === 'undefined') return false;
  const storedKey = localStorage.getItem(API_KEY_LOCALSTORAGE_KEY);
  return !!(storedKey && storedKey.trim() && storedKey !== DEMO_API_KEY);
}

function getCooldownExpiry(): Date | null {
  const now = new Date();
  const localStorageTime = localStorage.getItem(COOLDOWN_LOCALSTORAGE_KEY);

  if (localStorageTime) {
    const expiry = new Date(parseInt(localStorageTime) + COOLDOWN_MINUTES * 60 * 1000);
    if (expiry > now) {
      return expiry;
    }
  }

  const cookieValue = getCookie(COOLDOWN_COOKIE_NAME);
  if (cookieValue) {
    const expiry = new Date(parseInt(cookieValue) + COOLDOWN_MINUTES * 60 * 1000);
    if (expiry > now) {
      return expiry;
    }
  }

  return null;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function setCooldown(): void {
  const now = Date.now();
  const expiry = now + COOLDOWN_MINUTES * 60 * 1000;

  localStorage.setItem(COOLDOWN_LOCALSTORAGE_KEY, now.toString());

  if (typeof document !== 'undefined') {
    document.cookie = `${COOLDOWN_COOKIE_NAME}=${expiry}; path=/; max-age=${COOLDOWN_MINUTES * 60}; SameSite=Lax`;
  }
}

export function isInCooldown(): boolean {
  return getCooldownExpiry() !== null;
}

export function getRemainingCooldownSeconds(): number {
  const expiry = getCooldownExpiry();
  if (!expiry) return 0;
  const remaining = Math.max(0, Math.ceil((expiry.getTime() - Date.now()) / 1000));
  return remaining;
}

async function makeAuthenticatedRequest(
  endpoint: string,
  body: Record<string, unknown>
): Promise<Response> {
  const baseUrl = CORE_CONFIG.url || "http://localhost:8000";
  const apiKey = getApiKey();

  return fetch(`${baseUrl}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
}

export async function analyzePrompt(
  prompt: string,
  model: string = "gpt-4o"
): Promise<AnalyzeResult | null> {
  try {
    const response = await makeAuthenticatedRequest("/v1/analyze", {
      prompt,
      model,
      max_tokens: 1000,
      output_format: "prose",
      region: "us-west",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    setCooldown();
    return data;
  } catch (error) {
    console.error("Analyze error:", error);
    return null;
  }
}

export async function optimizePrompt(
  prompt: string
): Promise<OptimizationResult | null> {
  try {
    const response = await makeAuthenticatedRequest("/v1/optimize", {
      prompt,
      include_savings: true,
      target_model: "gpt-4o",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Optimize error:", error);
    return null;
  }
}

export async function benchmarkPrompt(
  prompt: string,
  models: string[] = ["gpt-4o", "gpt-4o-mini", "gemini-1.5-flash"]
): Promise<unknown | null> {
  try {
    const response = await makeAuthenticatedRequest("/v1/benchmark", {
      prompt,
      models,
      include_standard: false,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Benchmark error:", error);
    return null;
  }
}

export async function getModels(): Promise<unknown | null> {
  try {
    const baseUrl = CORE_CONFIG.url || "http://localhost:8000";
    const apiKey = getApiKey();

    const response = await fetch(`${baseUrl}/v1/models`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Get models error:", error);
    return null;
  }
}

export function formatEnergy(joules: number): string {
  if (joules >= 1000) {
    return `${(joules / 1000).toFixed(2)} kJ`;
  }
  return `${Math.round(joules)} J`;
}

export function formatCarbon(kg: number): string {
  if (kg < 0.001) {
    return `${(kg * 1000000).toFixed(2)} mg`;
  }
  return `${kg.toFixed(4)} kg`;
}

export function formatWater(liters: number): string {
  if (liters >= 1000) {
    return `${(liters / 1000).toFixed(2)} m³`;
  }
  return `${Math.round(liters)} L`;
}

export function formatCost(usd: number): string {
  if (usd < 0.001) {
    return `$${(usd * 1000).toFixed(2)}¢`;
  }
  return `$${usd.toFixed(4)}`;
}
