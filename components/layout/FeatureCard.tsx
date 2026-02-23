/**
 * FeatureCard Component
 * 
 * Purpose: Card component for displaying features on marketing pages
 * 
 * Key Elements:
 * - Icon display
 * - Title and description
 * - Status badge (available, coming soon)
 * - CTA link
 * 
 * Dependencies:
 * - next/link
 * - @/components/ui/card
 * - @/components/ui/badge
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "available" | "coming-soon" | "planned";
  href?: string;
}

export function FeatureCard({ title, description, icon: Icon, status, href }: FeatureCardProps) {
  const isAvailable = status === "available";
  const ctaLabel = href?.startsWith("/features/") ? "Learn More" : "Try Now";
  
  const cardContent = (
    <Card className={`h-full transition-all duration-300 ${
      isAvailable 
        ? "hover:shadow-lg hover:border-amber-300 cursor-pointer" 
        : "opacity-80"
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isAvailable ? "bg-amber-100" : "bg-stone-100"
          }`}>
            <Icon className={`w-6 h-6 ${
              isAvailable ? "text-amber-700" : "text-stone-400"
            }`} />
          </div>
          <Badge 
            variant={isAvailable ? "default" : "secondary"}
            className={isAvailable ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
          >
            {status === "available" && "Available"}
            {status === "coming-soon" && "Coming Soon"}
            {status === "planned" && "Planned"}
          </Badge>
        </div>
        <CardTitle className="text-xl text-stone-900">{title}</CardTitle>
        <CardDescription className="text-stone-500 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      {isAvailable && href && (
        <CardContent>
          <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-sm group">
            {ctaLabel}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </CardContent>
      )}
    </Card>
  );

  if (isAvailable && href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
