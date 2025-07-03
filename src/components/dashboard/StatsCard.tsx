
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "navy" | "orange" | "blue" | "green" | "red";
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = "navy",
  onClick
}: StatsCardProps) {
  const colorClasses = {
    navy: "from-navy to-blue-800",
    orange: "from-secondary to-orange-600", 
    blue: "from-light-blue to-blue-500",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <Card className="p-6 hover-lift border-0 card-shadow-lg bg-white relative group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-navy mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {trend.value}
              </span>
              <span className="text-xs text-gray-500">vs. mês anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      
      {onClick && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
          onClick={onClick}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </Card>
  );
}
