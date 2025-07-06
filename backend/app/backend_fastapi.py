from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import sqlite3
import json
import os
import sys

# Fix the import - since genome_agent_inference.py is in the same directory
import genome_agent_inference

app = FastAPI()

# Pydantic models for request bodies
class RadiologyInsightRequest(BaseModel):
    patient_id: Optional[str] = None
    image_data: Optional[str] = None
    study_type: Optional[str] = None
    findings: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "patient_id": "patient-001",
                "image_data": "base64_encoded_image_data",
                "study_type": "chest_xray",
                "findings": "chest pain evaluation"
            }
        }
    }

class GenomeInsightRequest(BaseModel):
    patient_id: Optional[str] = None
    subject: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "patient_id": "patient-001",
                "subject": "Patient/patient-001"
            }
        }
    }

@app.get("/")
def read_root():
    return {"message": "Health Nexus AI Backend is running."}

@app.post("/insightsRad")
async def insights_rad(request: RadiologyInsightRequest):
    """
    Get radiology insights for a patient
    """
    # Convert Pydantic model to dict
    data = request.dict()
    # TODO: Call your radiology agent here
    return JSONResponse(content={"insight": "Radiology insights will be here.", "input": data})

@app.post("/insightsGenome")
async def insights_genome(request: GenomeInsightRequest):
    """
    Get genome insights for a patient
    """
    # Convert Pydantic model to dict for backward compatibility
    data = request.dict()
    
    patient_id = data.get("patient_id")
    subject = data.get("subject")
    
    if not patient_id and not subject:
        return JSONResponse(status_code=400, content={"error": "Missing patient_id or subject in request body."})
    
    # Accept either patient_id (e.g., 'patient-001') or subject (e.g., 'Patient/patient-001')
    if not subject and patient_id:
        subject = f"Patient/{patient_id}"
    
    # Query the observations table for this subject
    conn = sqlite3.connect(os.path.join(os.path.dirname(__file__), '../scripts/patients.db'))
    c = conn.cursor()
    c.execute("SELECT component FROM observations WHERE subject = ? ORDER BY effective DESC", (subject,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return JSONResponse(status_code=404, content={"error": f"No observation found for subject {subject}"})
    
    component_json = row[0]
    
    # Prepare input for genome agent
    input_text = component_json
    
    # Call the genome agent inference
    agent_output = genome_agent_inference.run_genome_agent(input_text)
    
    return JSONResponse(content={"insight": agent_output, "input": input_text})

# You can add more endpoints as needed, e.g., /insightsPath for pathology, etc.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend_fastapi:app", host="0.0.0.0", port=8000, reload=True)