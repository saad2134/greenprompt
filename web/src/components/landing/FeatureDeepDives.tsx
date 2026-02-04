import { span } from "framer-motion/client";

export default function FeatureDeepDives() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-muted rounded-xl p-6 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>⚡</span>
                  <span>Prompt Analyzer</span>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <p className="text-sm mb-3">Input: &quot;Please analyze and explain this text in detail...&quot;</p>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm font-semibold mb-2">Output: Energy: <span className="text-primary">1,500 J</span></p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>1. Use &quot;Analyze&quot; (appropriate) - no change</li>
                      <li className="text-green-500">2. Change to bullets: -300 J</li>
                      <li className="text-green-500">3. Remove &quot;great&quot;: -200 J</li>
                      <li className="text-green-500">4. Add max_tokens: -150 J</li>
                    </ul>
                    <p className="text-sm mt-3 font-semibold">Predicted: <span className="text-green-500">850 J (43% savings)</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-bold mb-4">Prompt Analyzer</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Makes invisible costs visible. Get actionable recommendations in under 30 seconds.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Instant energy analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Specific optimization suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Confidence scores
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> No API keys required
              </li>
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-4">Energy Profiler</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Compare energy consumption across models. Find the perfect efficiency-accuracy trade-off.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Benchmark multiple models
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Efficiency rankings with accuracy
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Local model support (Ollama)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> 2-minute benchmarks
              </li>
            </ul>
          </div>
          <div className="bg-muted rounded-xl p-6 border border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📊</span>
                <span>Energy Profiler</span>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <p className="text-sm font-semibold mb-3">Efficiency Rankings</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-foreground/10 rounded">
                    <span>Qwen2.5-3B</span>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">300J</span>
                      <span className="text-muted-foreground ml-2">91% accuracy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-foreground/10 rounded">
                    <span> Mistral-7B</span>
                    <div className="text-right">
                      <span className="font-semibold text-yellow-600">520J</span>
                      <span className="text-muted-foreground ml-2">94% accuracy</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-foreground/10 rounded">
                    <span>Gemma-7B</span>
                    <div className="text-right">
                      <span className="font-semibold text-red-500">650J</span>
                      <span className="text-muted-foreground ml-2">93% accuracy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-muted rounded-xl p-6 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🌍</span>
                  <span>Team Dashboard</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card p-3 rounded-lg border border-border text-center">
                    <div className="text-2xl font-bold text-green-500">45.2 kWh</div>
                    <div className="text-xs text-muted-foreground">Energy Saved</div>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border text-center">
                    <div className="text-2xl font-bold text-blue-500">18.1 kg</div>
                    <div className="text-xs text-muted-foreground">CO2 Prevented</div>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border text-center">
                    <div className="text-2xl font-bold text-cyan-500">4.5M L</div>
                    <div className="text-xs text-muted-foreground">Water Saved</div>
                  </div>
                  <div className="bg-card p-3 rounded-lg border border-border text-center">
                    <div className="text-2xl font-bold text-primary">$2.26</div>
                    <div className="text-xs text-muted-foreground">API Cost Reduced</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-bold mb-4">Team Dashboard</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Real-time tracking with gamified leaderboards. ESG-ready reporting for compliance.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Real-time metrics
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Gamified leaderboards
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> ESG compliance export
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Team accountability
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
