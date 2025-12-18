import { useMutation } from '@tanstack/react-query';
import { runSimulation } from '@/lib/api';
import { SimulationConfig, SimulationResult } from '@/types/simulation';

export const useSimulation = () => {
  return useMutation<SimulationResult, Error, SimulationConfig>({
    mutationFn: runSimulation,
  });
};
