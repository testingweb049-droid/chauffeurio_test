import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
          <Icon className="h-5 w-5 text-primary dark:text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
        {change && (
          <p
            className={cn(
              "text-xs mt-2 font-medium",
              change.isPositive !== undefined &&
                (change.isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400")
            )}
          >
            {change.isPositive ? "+" : ""}
            {change.value} {change.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

