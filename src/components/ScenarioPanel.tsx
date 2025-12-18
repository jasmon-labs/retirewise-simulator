import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

interface ScenarioResult {
  label: string;
  description: string;
  rscDelta: number;
  newRSC: number;
}

interface ScenarioPanelProps {
  baseRSC: number | null;
  onScenario: (scenario: string) => void;
  isLoading: boolean;
  scenarios: ScenarioResult[];
}

const ScenarioPanel = ({ baseRSC, onScenario, isLoading, scenarios }: ScenarioPanelProps) => {
  const scenarioButtons = [
    { id: 'save_more', label: 'Save ₹10K more/month', icon: TrendingUp },
    { id: 'retire_early', label: 'Retire 5 years earlier', icon: Zap },
    { id: 'market_crash', label: 'Market crash (-20%)', icon: TrendingDown },
    { id: 'spend_less', label: 'Spend ₹10K less/month', icon: Minus },
  ];

  if (baseRSC === null) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
            <Lightbulb className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">What-If Scenarios</h3>
          <p className="text-muted-foreground text-sm">
            Run the base simulation first to explore different scenarios
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          What-If Scenarios
        </CardTitle>
        <CardDescription>
          Explore how changes affect your retirement safety
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scenario Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {scenarioButtons.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              size="sm"
              onClick={() => onScenario(scenario.id)}
              disabled={isLoading}
              className="h-auto py-3 px-3 justify-start"
            >
              <scenario.icon className="h-4 w-4 mr-2 shrink-0" />
              <span className="text-xs text-left">{scenario.label}</span>
            </Button>
          ))}
        </div>

        {/* Scenario Results */}
        {scenarios.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground">Results</h4>
            {scenarios.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{result.label}</p>
                  <p className="text-xs text-muted-foreground">{result.description}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={result.rscDelta >= 0 ? 'default' : 'destructive'}
                    className="font-mono"
                  >
                    {result.rscDelta >= 0 ? '+' : ''}{Math.round(result.rscDelta * 100)}%
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    New RSC: {Math.round(result.newRSC * 100)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioPanel;
