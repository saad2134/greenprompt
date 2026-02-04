export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-xl text-muted-foreground">Start free, scale as you grow</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <p className="text-muted-foreground mb-6">For individual developers</p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">✓ 50 prompts/day</li>
              <li className="flex items-center gap-2">✓ Basic analysis</li>
              <li className="flex items-center gap-2">✓ Community support</li>
            </ul>
            <button className="w-full border border-border py-3 rounded-lg hover:bg-secondary transition-colors">Get Started</button>
          </div>
          <div className="bg-primary/5 border-2 border-primary rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">Most Popular</div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <div className="text-4xl font-bold mb-4">$29<span className="text-lg text-muted-foreground font-normal">/month</span></div>
            <p className="text-muted-foreground mb-6">For power developers</p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">✓ Unlimited prompts</li>
              <li className="flex items-center gap-2">✓ Energy profiler</li>
              <li className="flex items-center gap-2">✓ API access</li>
              <li className="flex items-center gap-2">✓ Priority support</li>
            </ul>
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-colors">Start Free Trial</button>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <div className="text-4xl font-bold mb-4">$25K<span className="text-lg text-muted-foreground font-normal">/year</span></div>
            <p className="text-muted-foreground mb-6">For organizations</p>
            <ul className="space-y-2 text-sm mb-6">
              <li className="flex items-center gap-2">✓ Everything in Pro</li>
              <li className="flex items-center gap-2">✓ Team dashboards</li>
              <li className="flex items-center gap-2">✓ ESG reporting</li>
              <li className="flex items-center gap-2">✓ Custom integrations</li>
            </ul>
            <button className="w-full border border-border py-3 rounded-lg hover:bg-secondary transition-colors">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}
