/**
 * ValueProps Component
 * 
 * Purpose: Section highlighting key value propositions
 * 
 * Key Elements:
 * - Four key value props with icons
 * - Clean, scannable layout
 * 
 * Dependencies:
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import { Search, Brain, Download, Heart } from "lucide-react";

const valueProps = [
  {
    icon: Search,
    title: "Research, not just collect",
    description: "Go deep on context, conflicts, and connections. Understand your ancestors, don't just list them.",
  },
  {
    icon: Brain,
    title: "AI that understands genealogy",
    description: "Purpose-built prompts for family history work. AI that knows what matters in genealogical research.",
  },
  {
    icon: Download,
    title: "Your data, your control",
    description: "Everything exports. Nothing locked in. All your work stays on your computer in readable formats.",
  },
  {
    icon: Heart,
    title: "Storytelling focus",
    description: "Because ancestors deserve more than a database row. Turn facts into the stories families cherish.",
  },
];

export function ValueProps() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
            Why Tell Their Stories?
          </h2>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto">
            Built by genealogists, for genealogists. We understand what you need.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {valueProps.map((prop) => (
            <div key={prop.title} className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <prop.icon className="w-6 h-6 text-amber-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">
                  {prop.title}
                </h3>
                <p className="text-stone-500 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
