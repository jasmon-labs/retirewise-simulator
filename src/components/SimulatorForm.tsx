import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Play, Settings2 } from 'lucide-react';
import { SimulationConfig, RiskProfile, RISK_PROFILES } from '@/types/simulation';

interface SimulatorFormProps {
  onSubmit: (config: SimulationConfig) => void;
  isLoading: boolean;
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  return `₹${value.toLocaleString()}`;
};

const SimulatorForm = ({ onSubmit, isLoading }: SimulatorFormProps) => {
  const [initialCorpus, setInitialCorpus] = useState(5000000);
  const [monthlyContribution, setMonthlyContribution] = useState(50000);
  const [monthlySpending, setMonthlySpending] = useState(80000);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(55);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customMean, setCustomMean] = useState(7);
  const [customVolatility, setCustomVolatility] = useState(12);
  const [simulations, setSimulations] = useState(10000);

  const handleSubmit = () => {
    const profile = RISK_PROFILES[riskProfile];
    const config: SimulationConfig = {
      initial_corpus: initialCorpus,
      annual_contribution: monthlyContribution * 12,
      annual_spending: monthlySpending * 12,
      current_age: currentAge,
      retirement_age: retirementAge,
      mean_return: showAdvanced ? customMean / 100 : profile.mean,
      volatility: showAdvanced ? customVolatility / 100 : profile.volatility,
      simulations,
      end_age: 95,
    };
    onSubmit(config);
  };

  return (
    <Card className="border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Your Retirement Plan
        </CardTitle>
        <CardDescription>Adjust the parameters to simulate your retirement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Savings */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Current Savings</Label>
            <span className="text-sm font-semibold text-primary">{formatCurrency(initialCorpus)}</span>
          </div>
          <Slider
            value={[initialCorpus]}
            onValueChange={([v]) => setInitialCorpus(v)}
            min={100000}
            max={50000000}
            step={100000}
            className="cursor-pointer"
          />
        </div>

        {/* Monthly Contribution */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Monthly Contribution</Label>
            <span className="text-sm font-semibold text-primary">{formatCurrency(monthlyContribution)}</span>
          </div>
          <Slider
            value={[monthlyContribution]}
            onValueChange={([v]) => setMonthlyContribution(v)}
            min={5000}
            max={500000}
            step={5000}
            className="cursor-pointer"
          />
        </div>

        {/* Monthly Spending */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Monthly Spending (Retirement)</Label>
            <span className="text-sm font-semibold text-primary">{formatCurrency(monthlySpending)}</span>
          </div>
          <Slider
            value={[monthlySpending]}
            onValueChange={([v]) => setMonthlySpending(v)}
            min={10000}
            max={500000}
            step={5000}
            className="cursor-pointer"
          />
        </div>

        {/* Age Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current Age</Label>
            <Input
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              min={18}
              max={70}
            />
          </div>
          <div className="space-y-2">
            <Label>Retirement Age</Label>
            <Input
              type="number"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              min={currentAge + 1}
              max={80}
            />
          </div>
        </div>

        {/* Risk Profile */}
        <div className="space-y-2">
          <Label>Risk Tolerance</Label>
          <Select value={riskProfile} onValueChange={(v: RiskProfile) => setRiskProfile(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative (5% return, 8% vol)</SelectItem>
              <SelectItem value="moderate">Moderate (7% return, 12% vol)</SelectItem>
              <SelectItem value="aggressive">Aggressive (10% return, 18% vol)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            Advanced Options
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Return (%)</Label>
                <Input
                  type="number"
                  value={customMean}
                  onChange={(e) => setCustomMean(Number(e.target.value))}
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <Label>Volatility (%)</Label>
                <Input
                  type="number"
                  value={customVolatility}
                  onChange={(e) => setCustomVolatility(Number(e.target.value))}
                  min={1}
                  max={30}
                  step={0.5}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Simulations</Label>
              <Input
                type="number"
                value={simulations}
                onChange={(e) => setSimulations(Number(e.target.value))}
                min={1000}
                max={100000}
                step={1000}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Running Simulation...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4" /> Run Simulation
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimulatorForm;
