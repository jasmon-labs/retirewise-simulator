import numpy as np

def run_dmc_simulation(
    initial_corpus,
    annual_contribution,
    annual_spending,
    current_age,
    retirement_age,
    mean_return,
    volatility,
    simulations=1000
):
    years = retirement_age - current_age
    final_values = []
    survival_count = 0

    for _ in range(simulations):
        corpus = initial_corpus
        survived = True

        for _ in range(years):
            yearly_return = np.random.normal(mean_return, volatility)
            corpus = corpus * (1 + yearly_return)
            corpus += annual_contribution
            corpus -= annual_spending

            if corpus <= 0:
                survived = False
                break

        if survived:
            survival_count += 1
            final_values.append(corpus)
        else:
            final_values.append(0)

    rsc = survival_count / simulations

    return {
        "retirement_safety_score": round(rsc, 3),
        "percentile_10": float(np.percentile(final_values, 10)),
        "percentile_50": float(np.percentile(final_values, 50)),
        "percentile_90": float(np.percentile(final_values, 90)),
    }
