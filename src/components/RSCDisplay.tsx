import { Shield, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface RSCDisplayProps {
  rsc: number | null;
  isLoading: boolean;
}

const getRSCStatus = (rsc: number) => {
  if (rsc < 0.5) return { label: 'At Risk', color: 'text-destructive', bg: 'bg-destructive/10', icon: AlertTriangle };
  if (rsc < 0.7) return { label: 'Needs Attention', color: 'text-warning', bg: 'bg-warning/10', icon: AlertTriangle };
  if (rsc < 0.85) return { label: 'Good', color: 'text-success', bg: 'bg-success/10', icon: CheckCircle2 };
  return { label: 'Excellent', color: 'text-success', bg: 'bg-success/10', icon: TrendingUp };
};

const getInsight = (rsc: number) => {
  if (rsc < 0.5) return "Your plan needs significant adjustments. Consider increasing contributions or reducing spending.";
  if (rsc < 0.7) return "Your plan could use some improvement. Small changes can make a big difference.";
  if (rsc < 0.85) return "Your plan can weather most market conditions. You're on a good track.";
  return "Excellent! Your retirement plan is highly resilient to market volatility.";
};

const RSCDisplay = ({ rsc, isLoading }: RSCDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-24 w-24 rounded-full bg-muted mx-auto" />
            <div className="h-4 w-48 bg-muted mx-auto rounded" />
            <div className="h-3 w-64 bg-muted mx-auto rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (rsc === null) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
            <Shield className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Your Retirement Safety Score</h3>
          <p className="text-muted-foreground text-sm">
            Adjust your parameters and run the simulation to see your score
          </p>
        </CardContent>
      </Card>
    );
  }

  const status = getRSCStatus(rsc);
  const StatusIcon = status.icon;
  const percentage = Math.round(rsc * 100);

  return (
    <Card className="border-border/50 shadow-lg overflow-hidden">
      <div className={`${status.bg} p-6`}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm mb-4">
            <StatusIcon className={`h-4 w-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>
          
          <div className="relative inline-block">
            <div className={`text-7xl font-bold ${status.color} tabular-nums`}>
              {percentage}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Retirement Safety Score</div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <Progress value={percentage} className="h-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          {getInsight(rsc)}
        </p>
      </CardContent>
    </Card>
  );
};

export default RSCDisplay;
