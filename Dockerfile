FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY simulation_agent ./simulation_agent

EXPOSE 8000

CMD ["uvicorn", "simulation_agent.api:app", "--host", "0.0.0.0", "--port", "8000"]
