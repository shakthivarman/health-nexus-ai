# Backend for Health Nexus AI

This folder contains the FastAPI backend application.

## How to run

1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Start the server:
   ```sh
   uvicorn app.main:app --reload
   ```

APIs:
- POST /insightsRad
- POST /insightsGenome

Add more endpoints as needed.
