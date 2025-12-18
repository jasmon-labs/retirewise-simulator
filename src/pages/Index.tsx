import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SimulatorForm from '@/components/SimulatorForm';
import RSCDisplay from '@/components/RSCDisplay';
import SurvivalChart from '@/components/SurvivalChart';
import ScenarioPanel from '@/components/ScenarioPanel';
import { useSimulation } from '@/hooks/useSimulation';
import { SimulationConfig, SimulationResult } from '@/types/simulation';
import { useToast } from '@/hooks/use-toast';

interface ScenarioResult {
  label: string;
  description: string;
  rscDelta: number;
  newRSC: number;
}

const Index = () => {
  const { toast } = useToast();
  const simulation = useSimulation();
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [lastConfig, setLastConfig] = useState<SimulationConfig | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);

  const handleSubmit = async (config: SimulationConfig) => {
    setLastConfig(config);
    setScenarios([]);
    
    try {
      const data = await simulation.mutateAsync(config);
      setResult(data);
      toast({
        title: 'Simulation Complete',
        description: `Your RSC is ${Math.round(data.rsc * 100)}%`,
      });
    } catch (error) {
      toast({
        title: 'Simulation Failed',
        description: 'Could not connect to the backend. Make sure the API is running.',
        variant: 'destructive',
      });
    }
  };

  const handleScenario = async (scenarioId: string) => {
    if (!lastConfig || !result) return;

    let modifiedConfig = { ...lastConfig };
    let label = '';
    let description = '';

    switch (scenarioId) {
      case 'save_more':
        modifiedConfig.annual_contribution += 120000;
        label = 'Save ₹10K more/month';
        description = 'Increased monthly contribution by ₹10,000';
        break;
      case 'retire_early':
        modifiedConfig.retirement_age -= 5;
        label = 'Retire 5 years earlier';
        description = `Retirement at age ${modifiedConfig.retirement_age}`;
        break;
      case 'market_crash':
        modifiedConfig.initial_corpus *= 0.8;
        label = 'Market crash';
        description = 'Initial corpus reduced by 20%';
        break;
      case 'spend_less':
        modifiedConfig.annual_spending -= 120000;
        label = 'Spend ₹10K less/month';
        description = 'Reduced monthly spending by ₹10,000';
        break;
      default:
        return;
    }

    try {
      const scenarioResult = await simulation.mutateAsync(modifiedConfig);
      const newScenario: ScenarioResult = {
        label,
        description,
        rscDelta: scenarioResult.rsc - result.rsc,
        newRSC: scenarioResult.rsc,
      };
      setScenarios((prev) => [...prev, newScenario]);
    } catch (error) {
      toast({
        title: 'Scenario Failed',
        description: 'Could not run the scenario simulation.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <SimulatorForm onSubmit={handleSubmit} isLoading={simulation.isPending} />
          </div>
          
          {/* Right Column - Results */}
          <div className="space-y-6">
            <RSCDisplay rsc={result?.rsc ?? null} isLoading={simulation.isPending} />
            <SurvivalChart
              survivalCurve={result?.survival_curve ?? null}
              currentAge={lastConfig?.current_age ?? 30}
              retirementAge={lastConfig?.retirement_age ?? 55}
            />
          </div>
        </div>
        
        {/* Scenario Panel - Full Width */}
        <div className="mt-8">
          <ScenarioPanel
            baseRSC={result?.rsc ?? null}
            onScenario={handleScenario}
            isLoading={simulation.isPending}
            scenarios={scenarios}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
