import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown } from 'lucide-react';

interface SurvivalChartProps {
  survivalCurve: number[] | null;
  currentAge: number;
  retirementAge: number;
}

const SurvivalChart = ({ survivalCurve, currentAge, retirementAge }: SurvivalChartProps) => {
  if (!survivalCurve || survivalCurve.length === 0) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
            <TrendingDown className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Survival Probability Curve</h3>
          <p className="text-muted-foreground text-sm">
            Run the simulation to see your survival probability over time
          </p>
        </CardContent>
      </Card>
    );
  }

  const data = survivalCurve.map((prob, index) => ({
    age: currentAge + index,
    probability: Math.round(prob * 100),
  }));

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Survival Probability
        </CardTitle>
        <CardDescription>
          Probability that your corpus survives each year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="survivalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="age" 
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                className="text-muted-foreground"
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelFormatter={(age) => `Age ${age}`}
                formatter={(value: number) => [`${value}%`, 'Survival Probability']}
              />
              <ReferenceLine 
                x={retirementAge} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Retirement', 
                  position: 'top',
                  fill: 'hsl(var(--muted-foreground))',
                  fontSize: 12
                }}
              />
              <Area
                type="monotone"
                dataKey="probability"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#survivalGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurvivalChart;
