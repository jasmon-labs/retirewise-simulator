export interface SimulationConfig {
  initial_corpus: number;
  annual_contribution: number;
  annual_spending: number;
  retirement_age: number;
  current_age: number;
  mean_return: number;
  volatility: number;
  simulations: number;
  end_age: number;
  delta_contribution?: number;
  life_event_shock?: {
    age: number;
    amount: number;
    duration: number;
  };
}

export interface SimulationResult {
  rsc: number;
  final_values: number[];
  survival_curve: number[];
}

export interface ScenarioComparison {
  label: string;
  baseRSC: number;
  newRSC: number;
  delta: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export const RISK_PROFILES: Record<RiskProfile, { mean: number; volatility: number }> = {
  conservative: { mean: 0.05, volatility: 0.08 },
  moderate: { mean: 0.07, volatility: 0.12 },
  aggressive: { mean: 0.10, volatility: 0.18 },
};
