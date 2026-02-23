/**
 * About Page
 * 
 * Purpose: Mission, story, and background of the project
 * 
 * Key Elements:
 * - Mission statement
 * - Philosophy section
 * - How it works
 * 
 * Dependencies:
 * - @/components/layout/MarketingNav
 * - @/components/layout/Footer
 * 
 * Last Updated: Initial setup
 */

import { MarketingNav } from "@/components/layout/MarketingNav";
import { Footer } from "@/components/layout/Footer";
import { Heart, Shield, Lightbulb, Users } from "lucide-react";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "Learn the mission behind Tell Their Stories and the principles guiding this family history platform.",
  path: "/about",
});

const principles = [
  {
    icon: Heart,
    title: "Storytelling First",
    description: "We believe family history is about stories, not just data. Every ancestor was a person with hopes, fears, and a life worth remembering.",
  },
  {
    icon: Shield,
    title: "Your Data, Your Control",
    description: "All your work stays on your computer. We don't store your family data on servers. Export everything in open formats.",
  },
  {
    icon: Lightbulb,
    title: "AI as Assistant",
    description: "AI helps with the heavy lifting—analysis, synthesis, writing—but you stay in control. The human researcher makes the decisions.",
  },
  {
    icon: Users,
    title: "Built for Researchers",
    description: "Created by genealogists who understand the unique challenges of family history research. We know what matters.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 mb-6">
              About Tell Their Stories
            </h1>
            <p className="text-xl text-stone-500">
              A different approach to family history tools
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Our Mission</h2>
            <div className="prose prose-stone prose-lg max-w-none">
              <p className="text-stone-600 leading-relaxed">
                Traditional genealogy software focuses on building trees—collecting names, 
                dates, and connecting relationships. That&apos;s important work, but it&apos;s only 
                the beginning.
              </p>
              <p className="text-stone-600 leading-relaxed">
                <strong>Tell Their Stories</strong> picks up where the tree ends. We help you 
                go deeper into the research, understand the context of your ancestors&apos; lives, 
                and transform that research into content your family will actually read and cherish.
              </p>
              <p className="text-stone-600 leading-relaxed">
                With AI assistance, we make the tedious parts faster—extracting information, 
                identifying patterns, suggesting connections—so you can spend your time on 
                what matters: understanding and sharing the lives of those who came before.
              </p>
            </div>
          </section>

          {/* Principles */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Our Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {principles.map((principle) => (
                <div key={principle.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <principle.icon className="w-5 h-5 text-amber-700" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">
                      {principle.title}
                    </h3>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">How It Works</h2>
            <div className="bg-stone-50 rounded-2xl p-8">
              <ol className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Extract</h3>
                    <p className="text-stone-500">
                      Use our browser extension to capture sources from FamilySearch. 
                      All the indexed information, citations, and context—extracted in seconds.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Document</h3>
                    <p className="text-stone-500">
                      The raw data becomes a clean evidence document—organized, 
                      searchable, and stored locally on your computer.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Contextualize</h3>
                    <p className="text-stone-500">
                      AI analyzes your sources—finding patterns, identifying conflicts, 
                      grouping duplicates, and suggesting research directions.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <h3 className="font-semibold text-stone-900">Tell</h3>
                    <p className="text-stone-500">
                      Transform your research into stories, timelines, and shareable 
                      content that brings your ancestors to life for your family.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Open Source Note */}
          <section className="text-center">
            <p className="text-stone-500">
              Tell Their Stories is a personal project built with love for family history.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
