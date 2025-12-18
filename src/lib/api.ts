import { SimulationConfig, SimulationResult } from '@/types/simulation';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const runSimulation = async (config: SimulationConfig): Promise<SimulationResult> => {
  const response = await fetch(`${API_BASE}/run-simulation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    throw new Error('Simulation failed');
  }
  
  return response.json();
};
