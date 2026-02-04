const stats = [
  { value: "25-40%", label: "Energy Waste Preventable" },
  { value: "750 GWh", label: "Daily LLM Energy" },
  { value: "$1.25-2B", label: "Annual API Savings" },
  { value: "91 GWh", label: "Yearly Impact at Scale" },
];

export default function Stats() {
  return (
    <section id="impact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
