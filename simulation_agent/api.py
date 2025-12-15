from simulation_agent.engine import run_dmc_simulation
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="DMC-Sim: Dynamic Retirement Resilience Simulator")

class SimulationInput(BaseModel):
    portfolio_amount: float
    monthly_savings: float
    withdrawal_rate: float
    current_age: int
    retirement_age: int
    mean_return: float
    volatility: float
    simulations: int

class BehavioralEventInput(SimulationInput):
    penalty_amount: float
    
@app.post("/simulate")
def simulate(data: SimulationInput):
    result = run_dmc_simulation(
        data.initial_corpus,
        data.annual_contribution,
        data.annual_spending,
        data.current_age,
        data.retirement_age,
        data.mean_return,
        data.volatility,
        data.simulations
    )
    return result
    
@app.post("/behavioral-event")
def behavioral_event(data: BehavioralEventInput):
    result = run_dmc_simulation(
        data.initial_corpus - data.penalty_amount,   # penalty reduces corpus
        data.annual_contribution + data.penalty_amount,  # penalty boosts savings
        data.annual_spending,
        data.current_age,
        data.retirement_age,
        data.mean_return,
        data.volatility,
        data.simulations
    )

    return {
        "message": "Commitment fine applied",
        "penalty": data.penalty_amount,
        "updated_rsc": result["retirement_safety_score"],
        "full_result": result
    }
    
@app.post("/run_simulation")
def run_simulation(data: SimulationInput):
    annual_spending = data.portfolio_amount * data.withdrawal_rate
    annual_contribution = data.monthly_savings * 12

    result = run_dmc_simulation(
        initial_corpus=data.portfolio_amount,
        annual_contribution=annual_contribution,
        annual_spending=annual_spending,
        current_age=0,
        retirement_age=data.years,
        mean_return=data.market_mean_return,
        volatility=data.market_volatility,
        simulations=data.simulations
    )

    return result
