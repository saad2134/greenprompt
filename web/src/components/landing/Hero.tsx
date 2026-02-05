"use client";

import { useState, useEffect, useCallback } from "react";
import {
  analyzePrompt,
  optimizePrompt,
  isInCooldown,
  getRemainingCooldownSeconds,
  setApiKey,
  hasCustomApiKey,
  formatEnergy,
  formatCarbon,
  formatWater,
  formatCost,
  type AnalyzeResult,
  type OptimizationResult,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const SAMPLE_PROMPTS = [
  "Explain photosynthesis in detail",
  "Analyze the economic impact of AI",
  "Write a Python function to sort arrays",
  "Compare machine learning models",
];

const MODEL_OPTIONS = [
  { value: "gpt-4o", label: "GPT-4o", energy: "high", accuracy: "95%" },
  { value: "gpt-4o-mini", label: "GPT-4o-mini", energy: "low", accuracy: "92%" },
  { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet", energy: "medium", accuracy: "94%" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku", energy: "very-low", accuracy: "88%" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", energy: "medium", accuracy: "96%" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", energy: "very-low", accuracy: "94%" },
  { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", energy: "ultra-low", accuracy: "91%" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", energy: "very-low", accuracy: "92%" },
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash-Lite", energy: "ultra-low", accuracy: "89%" },
  { value: "gemini-3-pro", label: "Gemini 3 Pro", energy: "low", accuracy: "92%" },
  { value: "gemini-3-flash", label: "Gemini 3 Flash", energy: "very-low", accuracy: "90%" },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", energy: "medium", accuracy: "93%" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", energy: "very-low", accuracy: "90%" },
  { value: "mistral-small", label: "Mistral Small", energy: "very-low", accuracy: "87%" },
  { value: "llama-3.1-8b", label: "Llama 3.1 8B", energy: "very-low", accuracy: "84%" },
  { value: "qwen-7b", label: "Qwen 2.5 7B", energy: "very-low", accuracy: "86%" },
];

type TabType = "analyze" | "optimize";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("analyze");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [showCooldown, setShowCooldown] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [customApiKey, setCustomApiKey] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isInCooldown()) {
      setShowCooldown(true);
    }
    setCustomApiKey(hasCustomApiKey());
  }, []);

  useEffect(() => {
    if (!showCooldown) return;

    const interval = setInterval(() => {
      const remaining = getRemainingCooldownSeconds();
      setCooldownRemaining(remaining);
      if (remaining <= 0) {
        setShowCooldown(false);
        setCooldownRemaining(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showCooldown]);

  const handleSaveApiKey = useCallback(() => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setCustomApiKey(true);
      setShowApiKeyModal(false);
      setApiKeyInput("");
    }
  }, [apiKeyInput]);

  const handleAnalyze = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to analyze");
      return;
    }

    if (showCooldown && cooldownRemaining > 0) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setOptimization(null);

    try {
      const [analyzeResult, optimizeResult] = await Promise.all([
        analyzePrompt(prompt, selectedModel),
        optimizePrompt(prompt),
      ]);

      if (analyzeResult) {
        setResult(analyzeResult);
      } else {
        setError("Failed to analyze. Check your API key and try again.");
      }

      if (optimizeResult) {
        setOptimization(optimizeResult);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      if (isInCooldown()) {
        setShowCooldown(true);
      }
    }
  }, [prompt, selectedModel, showCooldown, cooldownRemaining]);

  const fillSample = (sample: string) => {
    setPrompt(sample);
  };

  const minutes = Math.floor(cooldownRemaining / 60);
  const seconds = cooldownRemaining % 60;
  const cooldownProgress = Math.max(0, (cooldownRemaining / 300) * 100);

  if (!mounted) {
    return (
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center bg-background">
        <div className="relative z-10 max-w-7xl mx-auto text-center w-full">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded w-3/4 mx-auto mb-4" />
            <div className="h-6 bg-muted rounded w-1/2 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 z-0" />

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-2">Enter Your API Key</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get your free API key from the dashboard to unlock unlimited analysis.
            </p>
            <input
              type="text"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="gp_api_..."
              className="w-full p-3 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary mb-4 font-mono text-sm"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          Research-backed AI Sustainability Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Make Every AI Prompt
          <span className="block text-primary">Count</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          Reduce LLM energy costs by 25-40%. Analyze, optimize, and track your AI usage
          with real-time metrics and actionable insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg text-base font-semibold hover:bg-primary/90 transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Free
          </a>
          <a
            href="/docs"
            className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-lg text-base font-semibold hover:bg-secondary transition-colors"
          >
            View Documentation
          </a>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-xl overflow-hidden">
            <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="ml-2 text-sm text-muted-foreground">Prompt Analyzer</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  {customApiKey ? "API Key Set" : "Set API Key"}
                </button>

                <div className="flex gap-1">
                  {(["analyze", "optimize"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        activeTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Prompt
                </label>
                <textarea
                  className="w-full p-4 bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all"
                  rows={4}
                  placeholder="Enter your prompt to analyze energy usage..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading || (showCooldown && cooldownRemaining > 0)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sample) => (
                    <button
                      key={sample}
                      onClick={() => fillSample(sample)}
                      disabled={loading || (showCooldown && cooldownRemaining > 0)}
                      className="text-xs px-2 py-1 rounded-full bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={loading || (showCooldown && cooldownRemaining > 0)}
                    className="w-full p-3 bg-muted/50 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {MODEL_OPTIONS.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !prompt.trim() || (showCooldown && cooldownRemaining > 0)}
                    className={cn(
                      "w-full sm:w-auto px-8 py-3 rounded-lg font-semibold transition-all flex items-center gap-2",
                      loading
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : showCooldown && cooldownRemaining > 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                    )}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : showCooldown && cooldownRemaining > 0 ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Cooldown ({minutes}:{seconds.toString().padStart(2, "0")})
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {activeTab === "optimize" ? "Analyze & Optimize" : "Analyze"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showCooldown && cooldownRemaining > 0 && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                    <span className="text-sm font-medium">
                      Free tier limit reached. Next analysis in {minutes}:{seconds.toString().padStart(2, "0")}
                    </span>
                    <div className="w-32 h-2 bg-amber-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-1000"
                        style={{ width: `${cooldownProgress}%` }}
                      />
                    </div>
                  </div>
                  <a
                    href="/signup"
                    className="mt-2 text-sm text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Upgrade to Pro for unlimited analysis
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  {!customApiKey && (
                    <button
                      onClick={() => setShowApiKeyModal(true)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Enter your API key for better results
                    </button>
                  )}
                </div>
              )}

              {result && (
                <div className="animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <StatCard
                      label="Energy"
                      value={formatEnergy(result.energy_joules)}
                      icon="⚡"
                      color="yellow"
                    />
                    <StatCard
                      label="Carbon"
                      value={formatCarbon(result.carbon_kg)}
                      icon="🌍"
                      color="green"
                    />
                    <StatCard
                      label="Water"
                      value={formatWater(result.water_liters)}
                      icon="💧"
                      color="blue"
                    />
                    <StatCard
                      label="Cost"
                      value={formatCost(result.estimated_cost_usd)}
                      icon="💰"
                      color="purple"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="ml-2 font-semibold">{result.input_tokens} → {result.estimated_output_tokens}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">Task:</span>
                      <span className="ml-2 font-semibold capitalize">{result.task_type}</span>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2 font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {optimization && result && (
                <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Optimization Suggestions</h4>
                  </div>

                  <div className="space-y-2 mb-3">
                    {optimization.suggestions.slice(0, 3).map((suggestion, idx) => (
                      <div key={idx} className="text-sm p-2 bg-green-500/10 rounded">
                        <span className="font-medium">{suggestion.type.replace(/_/g, " ")}:</span> {suggestion.reason}
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          -{formatEnergy(suggestion.energy_savings_joules)} ({suggestion.energy_savings_percent.toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>Save up to <strong className="text-green-500">{formatEnergy(optimization.total_savings_joules)}</strong></span>
                    <span>Reduce CO₂ by <strong className="text-green-500">{formatCarbon(optimization.carbon_savings_kg)}</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl font-bold text-primary mb-1">25-40%</div>
              <div className="text-sm text-muted-foreground">Energy Savings Possible</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <div className="text-sm text-muted-foreground">Models Supported</div>
            </div>
            <div className="p-4">
              <div className="text-3xl font-bold text-primary mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">Carbon Tracking</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Get your free API key and start optimizing today
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: string;
  color: "yellow" | "green" | "blue" | "purple";
}) {
  const colorClasses = {
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className={cn("p-3 rounded-lg", colorClasses[color])}>
      <div className="flex items-center gap-1.5 mb-1">
        <span>{icon}</span>
        <span className="text-xs font-medium opacity-80">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
