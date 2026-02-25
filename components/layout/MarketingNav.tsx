/**
 * MarketingNav Component
 * 
 * Purpose: Navigation bar for marketing/public pages
 * 
 * Key Elements:
 * - Logo/brand link
 * - Navigation links (Features, About, Roadmap)
 * - CTA button to app
 * 
 * Dependencies:
 * - next/link
 * - @/components/ui/button
 * 
 * Last Updated: Initial setup
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/extension", label: "Extension" },
  { href: "/about", label: "About" },
  { href: "/roadmap", label: "Roadmap" },
];

export function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center group-hover:bg-amber-800 transition-colors">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-stone-900 hidden sm:block">
              Discover Their Stories
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-600 hover:text-stone-900 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-amber-700 hover:bg-amber-800">
              <Link href="/app">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-stone-600"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-stone-600 hover:text-stone-900 transition-colors font-medium px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="bg-amber-700 hover:bg-amber-800 mt-2">
                <Link href="/app">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
