const features = [
  {
    appName: "Prompt Analyzer",
    description: "Get instant energy analysis of any prompt in under 30 seconds. See hidden costs and get actionable optimization suggestions.",
    icon: "⚡",
  },
  {
    appName: "Energy Profiler",
    description: "Compare energy consumption across different models. Find the perfect balance between efficiency and accuracy.",
    icon: "📊",
  },
  {
    appName: "Team Dashboard",
    description: "Real-time tracking with gamified leaderboards. Track CO2 reduction, water savings, and API cost reductions.",
    icon: "🌍",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Three Ways We Solve It</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools to analyze, optimize, and track your AI usage.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.appName}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
