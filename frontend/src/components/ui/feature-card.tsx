
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <div className={cn("flex flex-col p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800 card-hover", className)}>
      {Icon && (
        <div className="mb-4 rounded-lg bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-gray-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
