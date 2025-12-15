import numpy as np


def run_dmc_simulation(
    initial_corpus: float,
    annual_contribution: float,
    annual_spending: float,
    current_age: int,
    retirement_age: int,
    mean_return: float,
    volatility: float,
    simulations: int
):
    # your Monte Carlo logic
    return {
        "rsc": 72,
        "success_probability": 0.78
    }
    years = retirement_age - current_age
    successful_runs = 0
    survival_curve = []

    for _ in range(simulations):
        corpus = initial_corpus
        survived = True

        for year in range(years):
            # Market return (non-linear, stochastic)
            annual_return = np.random.normal(mean_return, volatility)

            corpus = corpus * (1 + annual_return)
            corpus += annual_contribution
            corpus -= annual_spending

            if corpus <= 0:
                survived = False
                break

        survival_curve.append(corpus if survived else 0)

        if survived:
            successful_runs += 1

    rsc = (successful_runs / simulations) * 100

    return {
        "retirement_safety_score": round(rsc, 2),
        "successful_simulations": successful_runs,
        "total_simulations": simulations,
        "survival_curve": survival_curve[:100]  # trimmed for frontend
    }
