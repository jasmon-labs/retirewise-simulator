from fastapi import FastAPI
from pydantic import BaseModel
from simulation_agent.engine import run_dmc_simulation
from pydantic import Field

app = FastAPI(title="DMC-Sim: Dynamic Retirement Resilience Simulator")

# -------------------------------------------------
# Input Models
# -------------------------------------------------

class SimulationInput(BaseModel):
    portfolio_amount: float = Field(ge=0)
    monthly_savings: float = Field(ge=0)
    withdrawal_rate: float = Field(gt=0, lt=0.1)
    current_age: int = Field(ge=18, le=60)
    retirement_age: int = Field(gt=18, le=70)
    mean_return: float = Field(gt=-0.2, lt=0.2)
    volatility: float = Field(gt=0, lt=0.5)
    simulations: int = Field(gt=100, le=5000)


class BehavioralEventInput(SimulationInput):
    penalty_amount: float


# -------------------------------------------------
# Helper: RSC Interpretation (STEP 1)
# -------------------------------------------------

def interpret_rsc(rsc: int, success_probability: float):
    if rsc >= 80:
        return {
            "label": "Very Safe",
            "message": "Your retirement plan is highly resilient even under market volatility."
        }
    elif rsc >= 65:
        return {
            "label": "Moderately Safe",
            "message": "Your retirement plan is likely to succeed, but market shocks could impact sustainability."
        }
    elif rsc >= 50:
        return {
            "label": "At Risk",
            "message": "Your retirement plan is vulnerable and may fail under adverse conditions."
        }
    else:
        return {
            "label": "High Risk",
            "message": "Your retirement plan is very likely to fail without immediate behavioral or savings intervention."
        }


# -------------------------------------------------
# Core Simulation Endpoint
# -------------------------------------------------

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

    interpretation = interpret_rsc(
        result["rsc"],
        result["success_probability"]
    )

    return {
        "rsc": result["rsc"],
        "success_probability": result["success_probability"],
        "rsc_label": interpretation["label"],
        "interpretation": interpretation["message"]
    }


# -------------------------------------------------
# Behavioral Event: Commitment Fine
# -------------------------------------------------

@app.post("/behavioral-event")
def behavioral_event(data: BehavioralEventInput):
    annual_spending = data.portfolio_amount * data.withdrawal_rate
    adjusted_corpus = data.portfolio_amount - data.penalty_amount
    adjusted_contribution = (data.monthly_savings * 12) + data.penalty_amount

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

    interpretation = interpret_rsc(
        result["rsc"],
        result["success_probability"]
    )

    return {
        "message": "Commitment fine applied",
        "penalty_amount": data.penalty_amount,
        "updated_rsc": result["rsc"],
        "updated_success_probability": result["success_probability"],
        "rsc_label": interpretation["label"],
        "interpretation": interpretation["message"]
    }


# -------------------------------------------------
# Behavioral Impact Comparison (STEP 2)
# -------------------------------------------------

@app.post("/behavioral-impact")
def behavioral_impact(data: BehavioralEventInput):
    annual_spending = data.portfolio_amount * data.withdrawal_rate
    annual_contribution = data.monthly_savings * 12

    # BEFORE penalty
    before = run_dmc_simulation(
        initial_corpus=data.portfolio_amount,
        annual_contribution=annual_contribution,
        annual_spending=annual_spending,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        mean_return=data.mean_return,
        volatility=data.volatility,
        simulations=data.simulations
    )

    # AFTER penalty
    after = run_dmc_simulation(
        initial_corpus=data.portfolio_amount - data.penalty_amount,
        annual_contribution=annual_contribution + data.penalty_amount,
        annual_spending=annual_spending,
        current_age=data.current_age,
        retirement_age=data.retirement_age,
        mean_return=data.mean_return,
        volatility=data.volatility,
        simulations=data.simulations
    )

    return {
        "before_commitment_fine": before,
        "after_commitment_fine": after,
        "impact": {
            "rsc_change": after["rsc"] - before["rsc"],
            "success_probability_change": round(
                after["success_probability"] - before["success_probability"], 3
            )
        }
    }
