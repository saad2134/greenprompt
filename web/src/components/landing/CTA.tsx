"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Signing up with: ${email}`);
  };

  return (
    <section className="py-20 px-4  text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center px-4 bg-primary p-16 rounded-xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Make Every Prompt Count?</h2>
        <p className="text-xl mb-8 opacity-90">Join 10,000+ developers optimizing their AI usage</p>
        <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-lg bg-primary-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-white"
            required
          />
          <button
            type="submit"
            className="bg-foreground text-background px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Free
          </button>
        </form>
      </div>
    </section>
  );
}
