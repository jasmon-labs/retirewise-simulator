# DMC-Sim — Dynamic Retirement Resilience Simulator

> **A behavior-aware Monte Carlo simulation engine for retirement planning**

DMC-Sim is a backend-first financial simulation system that evaluates long-term retirement resilience under uncertain market conditions **while explicitly modeling human behavior** (overspending, missed savings, penalties).

Unlike traditional retirement calculators that assume perfect discipline, DMC-Sim introduces **behavioral friction** and **commitment mechanisms** to reflect how people actually behave in real life.

---

## 🚀 Core Idea

Most retirement tools answer:

> *“If everything goes right, will I be okay?”*

DMC-Sim instead asks:

> *“How resilient is this plan when things go wrong?”*

The output is a **Retirement Safety / Resilience Score (RSC)** derived from thousands of Monte Carlo paths.

---

## 🧠 Key Concepts

### 1. Monte Carlo Simulation

* Simulates thousands of possible market futures
* Each path models annual returns using:

  * Expected mean return
  * Volatility (risk)

### 2. Sequence-of-Returns Risk

* Captures the disproportionate damage caused by **early market crashes**
* A major real-world retirement risk often ignored by static calculators

### 3. Behavioral Finance Layer

DMC-Sim models *human behavior*, not just math:

* Overspending
* Missed savings
* Commitment penalties (loss aversion)

This layer allows us to simulate how behavioral nudges can **increase long-term financial resilience**.

---

## 🧮 Inputs

| Parameter          | Description                   |
| ------------------ | ----------------------------- |
| `portfolio_amount` | Current invested corpus       |
| `monthly_savings`  | Monthly contribution          |
| `withdrawal_rate`  | Annual withdrawal %           |
| `current_age`      | User's current age            |
| `retirement_age`   | Target retirement age         |
| `mean_return`      | Expected annual market return |
| `volatility`       | Market volatility             |
| `simulations`      | Number of Monte Carlo runs    |

---

## 📤 Outputs

### Retirement Safety / Resilience Score (RSC)

* Scaled score representing robustness of retirement plan
* Higher = more resilient to market + behavioral shocks

### Success Probability

* % of simulation paths where corpus survives until retirement

---

## 🔌 API Endpoints

### 1️⃣ Run Base Simulation

`POST /run_simulation`

Simulates retirement outcome assuming standard behavior.

**Purpose:**

* Baseline retirement resilience

---

### 2️⃣ Behavioral Event Simulation

`POST /behavioral-event`

Applies a **commitment penalty** to model real-life corrective behavior.

**Example:**

* Overspending triggers a penalty
* Penalty reduces current corpus
* Same amount is redirected to future savings

**Behavioral Insight:** Short-term pain → long-term discipline → improved resilience

---

## ⚠️ Real-Life Edge Cases Considered

### 1. Early Career Market Crash

* Severe impact due to sequence-of-returns risk
* Monte Carlo volatility naturally captures this

### 2. Job Loss / Zero Savings Periods

* Monthly savings can drop to zero
* Simulation continues and reflects vulnerability

### 3. Repeated Overspending

* Multiple behavioral penalties compound over time
* Demonstrates loss aversion and habit correction

### 4. Over-Optimistic Market Assumptions

* High expected returns increase volatility exposure
* RSC reflects hidden fragility

### 5. Late Start to Retirement Planning

* Reduced compounding window
* Higher withdrawal pressure
* Lower resilience score

---

## 🧪 Why Monte Carlo?

| Traditional Calculator     | DMC-Sim                          |
| -------------------------- | -------------------------------- |
| Single deterministic path  | Thousands of probabilistic paths |
| Assumes perfect discipline | Models behavioral failure        |
| Optimistic outcomes        | Realistic risk exposure          |

---

## 🏗️ Architecture Overview

```
simulation_agent/
│
├── engine.py        # Monte Carlo simulation core
├── api.py           # FastAPI interface
└── models.py        # (optional) shared schemas
```

---

## 🔮 Future Enhancements (Planned)

* Job-loss shock modeling
* Inflation-adjusted spending
* Dynamic asset allocation
* Frontend dashboard (React)
* Personal risk profiling

---

## 🎯 Project Goal

DMC-Sim is designed as:

* A **research-backed academic project**
* A **behavior-aware financial engineering system**
* A foundation for future fintech tooling

---

## 🧑‍💻 Team Notes

This backend is intentionally modular and extensible. Edge cases are explicitly documented to demonstrate engineering maturity without overfitting complexity prematurely.

---

## 📌 Disclaimer

This project is for educational and simulation purposes only. It does not constitute financial advice.

---

**Built with:** FastAPI · Python · Monte Carlo Simulation · Behavioral Finance
