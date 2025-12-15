from simulation_agent.engine import run_dmc_simulation

def handle_spending_breach(event):
    penalty_amount = event.penalty_amount

    # Reduce liquid portfolio, increase long-term savings
    updated_portfolio = event.portfolio_amount - penalty_amount
    updated_annual_contribution = event.annual_contribution + penalty_amount

    result = run_dmc_simulation(
        initial_corpus=updated_portfolio,
        annual_contribution=updated_annual_contribution,
        annual_spending=event.annual_spending,
        current_age=event.current_age,
        retirement_age=event.retirement_age,
        mean_return=event.mean_return,
        volatility=event.volatility,
        simulations=event.simulations
    )

    return {
        "penalty_applied": penalty_amount,
        "updated_rsc": result["retirement_safety_score"]
    }
