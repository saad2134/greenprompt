const testimonials = [
  {
    quote: "We reduced our API costs by 35% in the first month while maintaining accuracy. The insights are incredibly actionable.",
    author: "Sarah Chen",
    role: "Engineering Lead, TechCorp",
  },
  {
    quote: "Finally, a tool that makes AI sustainability measurable. Our ESG reporting is now effortless.",
    author: "Michael Torres",
    role: "Sustainability Director, GreenAI",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by Teams</h2>
          <p className="text-xl text-muted-foreground">See what early adopters are saying</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <p className="text-lg mb-4">&quot;{testimonial.quote}&quot;</p>
              <div>
                <div className="font-semibold">{testimonial.author}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
