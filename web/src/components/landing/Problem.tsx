export default function Problem() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">The Invisible Crisis</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every day, 2.5 billion LLM prompts consume 750 GWh of energy—equivalent to 750,000 homes.
              Yet developers have no visibility into the environmental cost of their AI usage.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">❌</div>
                <div>
                  <h3 className="font-semibold mb-1">No Cost Visibility</h3>
                  <p className="text-muted-foreground">Developers don&apos;t know their prompt&apos;s energy cost before running it.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">❌</div>
                <div>
                  <h3 className="font-semibold mb-1">ESG Reporting Gap</h3>
                  <p className="text-muted-foreground">Corporations can&apos;t track AI carbon footprint for compliance.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">❌</div>
                <div>
                  <h3 className="font-semibold mb-1">Wasted API Spend</h3>
                  <p className="text-muted-foreground">25-40% inefficiency leaves $1.25-2B annually on the table.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6">The Research Breakthrough</h3>
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span>
                  <span className="font-semibold">20-45% Energy Reduction</span>
                </div>
                <p className="text-sm text-muted-foreground">Possible without sacrificing accuracy (2024-2025 research)</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span>
                  <span className="font-semibold">Response Length Dominates</span>
                </div>
                <p className="text-sm text-muted-foreground">0.9 correlation with energy—structured outputs save 20-45%</p>
              </div>
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-500">✓</span>
                  <span className="font-semibold">Model Selection Matters</span>
                </div>
                <p className="text-sm text-muted-foreground">10-40x impact—bigger than prompt optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
