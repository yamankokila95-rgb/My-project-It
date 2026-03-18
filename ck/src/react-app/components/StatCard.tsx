import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  accentColor?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, accentColor }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-card p-5 shadow-sm border border-border/50">
      <div 
        className="absolute top-0 right-0 w-24 h-24 opacity-10 rounded-full -translate-y-8 translate-x-8"
        style={{ backgroundColor: accentColor || 'hsl(var(--primary))' }}
      />
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {typeof value === 'number' ? `₹${value.toLocaleString()}` : value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-500'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}% from last month</span>
            </div>
          )}
        </div>
        
        <div 
          className="flex items-center justify-center w-11 h-11 rounded-lg"
          style={{ backgroundColor: `${accentColor || 'hsl(var(--primary))'}20` }}
        >
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}
