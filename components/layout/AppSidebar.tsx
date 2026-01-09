/**
 * AppSidebar Component
 * 
 * Purpose: Sidebar navigation for the app section
 * 
 * Key Elements:
 * - Logo/brand
 * - Tool navigation links
 * - Settings link
 * - Collapse functionality
 * 
 * Dependencies:
 * - next/link
 * - next/navigation
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  PenTool,
  Clock
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/app",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/app/source-docs",
    label: "Source Docs",
    icon: FileText,
    available: true,
  },
  {
    href: "/app/story-writer",
    label: "Story Writer",
    icon: PenTool,
    comingSoon: true,
  },
  {
    href: "/app/timeline",
    label: "Timeline",
    icon: Clock,
    comingSoon: true,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-stone-900 text-white flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-stone-800">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm">Tell Their Stories</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className={cn("px-3 mb-2", collapsed && "px-2")}>
          {!collapsed && (
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Tools
            </span>
          )}
        </div>
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.comingSoon ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  isActive(item.href, item.exact)
                    ? "bg-amber-700 text-white"
                    : item.comingSoon
                    ? "text-stone-500 cursor-not-allowed"
                    : "text-stone-400 hover:text-white hover:bg-stone-800",
                  collapsed && "justify-center px-2"
                )}
                onClick={(e) => item.comingSoon && e.preventDefault()}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="flex-1">{item.label}</span>
                )}
                {!collapsed && item.comingSoon && (
                  <span className="text-xs bg-stone-700 px-2 py-0.5 rounded">
                    Soon
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings */}
      <div className="border-t border-stone-800 p-2">
        <Link
          href="/app/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            isActive("/app/settings")
              ? "bg-amber-700 text-white"
              : "text-stone-400 hover:text-white hover:bg-stone-800",
            collapsed && "justify-center px-2"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-stone-800 border border-stone-700 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
