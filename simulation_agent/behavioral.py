from simulation_agent.engine import run_dmc_simulation

def apply_commitment_penalty(config, penalty_amount):
    config["annual_contribution"] += penalty_amount
    return run_dmc_simulation(**config)
