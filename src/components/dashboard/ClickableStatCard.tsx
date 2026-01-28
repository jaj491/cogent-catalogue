import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ClickableStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function ClickableStatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className,
  iconClassName,
  onClick,
  isActive,
}: ClickableStatCardProps) {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300",
        onClick && "cursor-pointer hover:bg-card/80 hover:border-primary/30 hover:scale-[1.02]",
        isActive && "border-primary/50 bg-card/80 ring-1 ring-primary/20",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.value >= 0 ? "text-emerald-400" : "text-red-400"
                )}>
                  {trend.value >= 0 ? '+' : ''}{trend.value}%
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-muted-foreground/80">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300",
            onClick && "group-hover:scale-110",
            iconClassName || "from-primary/20 to-primary/5"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              iconClassName ? "text-white" : "text-primary"
            )} />
          </div>
        </div>
      </CardContent>
      {onClick && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </Card>
  );
}
