from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from blue_ai_engine import BlueAiEngine

app = FastAPI(title="Blue AI v2 - Intelligence Engine")
engine = BlueAiEngine()

class PerformanceMetrics(BaseModel):
    student_id: int
    grades: Optional[List[float]] = None
    attendance_rate: Optional[float] = None
    history: Optional[List[float]] = []

class AlertRequest(BaseModel):
    user_id: str
    role: str 
    context: dict

@app.get("/health")
async def health():
    return {"status": "Blue AI is learning and ready"}

@app.get("/analyze/student/{student_id}")
async def analyze_student(student_id: int):
    """
    Automated analysis: Pulls data from DB and calculates performance + trend.
    """
    grades, attendance = engine.fetch_student_data(student_id)
    if not grades and attendance == 0.0:
        raise HTTPException(status_code=404, detail="Student data not found")
        
    index = engine.calculate_performance_index(grades, attendance)
    trend = engine.predict_trend([index]) 
    
    return {
        "student_id": student_id,
        "performance_index": index,
        "trend": trend,
        "raw_data": {
            "grades": grades,
            "attendance": attendance
        }
    }

@app.post("/analyze/performance")
async def analyze_performance(metrics: PerformanceMetrics):
    """
    Manual analysis: Accepts data via POST and returns indices.
    """
    # Defensive logic to satisfy IDE static analysis
    safe_grades = metrics.grades if metrics.grades else []
    safe_attendance = metrics.attendance_rate if metrics.attendance_rate else 0.0
    safe_history = metrics.history if metrics.history else []
    
    index = engine.calculate_performance_index(safe_grades, safe_attendance)
    full_history = safe_history + [index]
    trend = engine.predict_trend(full_history)
    
    return {
        "student_id": metrics.student_id,
        "performance_index": index,
        "trend": trend
    }

@app.post("/generate/alert")
async def generate_alert(request: AlertRequest):
    """
    Generates role-specific personalized alerts with instructional logic.
    """
    alert = engine.generate_personalized_alert(
        request.user_id, 
        request.role, 
        request.context
    )
    return alert

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
