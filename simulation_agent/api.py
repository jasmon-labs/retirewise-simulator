from fastapi import FastAPI
from pydantic import BaseModel
from simulation_agent.engine import run_dmc_simulation

app = FastAPI(title="DMC-Sim: Dynamic Retirement Resilience Simulator")

class SimulationInput(BaseModel):
    initial_corpus: float
    annual_contribution: float
    annual_spending: float
    current_age: int
    retirement_age: int
    mean_return: float
    volatility: float
    simulations: int = 1000


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
def behavioral_event(data: SimulationInput, penalty: float):
    result = run_dmc_simulation(
        data.initial_corpus,
        data.annual_contribution + penalty,
        data.annual_spending,
        data.current_age,
        data.retirement_age,
        data.mean_return,
        data.volatility,
        data.simulations
    )
    return {
        "message": "Commitment fine applied",
        "updated_result": result
    }
@app.post("/run_simulation")
def run_simulation(data: SimulationRequest):
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
