from fastapi import FastAPI
from pydantic import BaseModel
from simulation_agent.engine import run_dmc_simulation

app = FastAPI(title="DMC-Sim: Dynamic Retirement Resilience Simulator")


# -----------------------------
# Input Models
# -----------------------------

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


# -----------------------------
# Core Simulation Endpoint
# -----------------------------

@app.post("/run_simulation")
def run_simulation(data: SimulationInput):
    annual_spending = data.portfolio_amount * data.withdrawal_rate
    annual_contribution = data.monthly_savings * 12

    result = run_dmc_simulation(
        initial_corpus=data.portfolio_amount,
        annual_contribution=annual_contribution,
        annual_spending=annual_spending,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        mean_return=data.mean_return,
        volatility=data.volatility,
        simulations=data.simulations
    )

    return result


# -----------------------------
# Behavioral Event (Commitment Fine)
# -----------------------------

@app.post("/behavioral-event")
def behavioral_event(data: BehavioralEventInput):
    adjusted_corpus = data.portfolio_amount - data.penalty_amount
    adjusted_contribution = (data.monthly_savings * 12) + data.penalty_amount
    annual_spending = data.portfolio_amount * data.withdrawal_rate

    result = run_dmc_simulation(
        initial_corpus=adjusted_corpus,
        annual_contribution=adjusted_contribution,
        annual_spending=annual_spending,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        mean_return=data.mean_return,
        volatility=data.volatility,
        simulations=data.simulations
    )

    return {
        "message": "Commitment fine applied",
        "penalty_amount": data.penalty_amount,
        "updated_result": result
    }
