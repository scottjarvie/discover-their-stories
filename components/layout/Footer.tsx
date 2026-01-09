/**
 * Footer Component
 * 
 * Purpose: Site footer for all pages
 * 
 * Key Elements:
 * - Logo and brand
 * - Navigation links
 * - Copyright
 * 
 * Dependencies:
 * - next/link
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">
              Tell Their Stories
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-8">
            <Link href="/features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/roadmap" className="hover:text-white transition-colors">
              Roadmap
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm">
            © {new Date().getFullYear()} Tell Their Stories
          </p>
        </div>
      </div>
    </footer>
  );
}
