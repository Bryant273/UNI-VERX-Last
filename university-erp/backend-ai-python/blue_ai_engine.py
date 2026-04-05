import numpy as np
import pandas as pd
from typing import List, Dict, Optional
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

class BlueAiEngine:
    def __init__(self):
        # Initializing weights for performance metrics
        self.weights = {
            "grades": 0.6,
            "attendance": 0.3,
            "participation": 0.1
        }
        
        # Database setup
        self.db_url = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/university")
        self.engine = create_engine(self.db_url)

    def fetch_student_data(self, student_id: int):
        """
        Fetches student grades and attendance from the modular database.
        """
        query = text("""
            SELECT g.score, e.attendance_rate 
            FROM grades g
            JOIN ai_student_performance e ON g.user_id = e.student_id
            WHERE g.user_id = :student_id
        """)
        
        with self.engine.connect() as conn:
            result = conn.execute(query, {"student_id": student_id})
            data = result.fetchall()
            
        if not data:
            return [], 0.0
            
        grades = [row[0] for row in data]
        attendance = data[0][1] if data[0][1] is not None else 0.0
        return grades, float(attendance)

    def calculate_performance_index(self, grades: List[float], attendance_rate: float) -> float:
        """
        Calculates a weighted performance index for a student.
        """
        if not grades:
            avg_grade = 0
        else:
            avg_grade = np.mean(grades) / 20.0 # Normalize to 0-1
            
        index = (avg_grade * self.weights["grades"]) + (attendance_rate * self.weights["attendance"])
        return float(np.clip(index, 0, 1))

    def predict_trend(self, history: List[float]) -> str:
        """
        Predicts the performance trend based on historical indices.
        """
        if len(history) < 2:
            return "STABLE"
        
        diff = history[-1] - history[0]
        if diff > 0.05:
            return "IMPROVING"
        elif diff < -0.05:
            return "DECLINING"
        else:
            return "STABLE"

    def generate_personalized_alert(self, user_id: str, role: str, context: dict) -> dict:
        """
        Generates advanced role-specific alerts with actionable instructions.
        """
        alert = {
            "receiver_id": user_id,
            "role": role,
            "message": "",
            "instructions": "",
            "severity": "INFO",
            "type": "GENERAL"
        }

        # Roles defined: ADMIN, RECTORATE, SECRETARIAT, ACADEMIC_ADVISOR, PROFESSOR, STUDENT, ERP_PROVIDER

        if role == "STUDENT":
            index = context.get("performance_index", 1.0)
            if index < 0.5:
                alert.update({
                    "message": "Alerte Performance : Votre moyenne est tombée sous le seuil de sécurité.",
                    "instructions": "Veuillez prendre rendez-vous avec votre conseiller pédagogique pour établir un plan de soutien.",
                    "severity": "DANGER",
                    "type": "PERFORMANCE"
                })
            elif context.get("attendance", 1.0) < 0.75:
                alert.update({
                    "message": "Alerte Assiduité : Trop d'absences injustifiées détectées.",
                    "instructions": "Justifiez vos absences auprès de la scolarité sous 48h pour éviter une suspension.",
                    "severity": "WARNING",
                    "type": "ATTENDANCE"
                })
            else:
                alert.update({
                    "message": "Félicitations : Vos résultats sont excellents ce semestre.",
                    "instructions": "Continuez ainsi ! Blue AI suggère de postuler pour une bourse d'excellence.",
                    "severity": "SUCCESS",
                    "type": "KUDOS"
                })

        elif role == "PROFESSOR":
            class_avg = context.get("class_average", 12.0)
            if class_avg < 10.0:
                alert.update({
                    "message": f"Alerte Classe : La moyenne de votre module {context.get('course')} est critique.",
                    "instructions": "Blue AI suggère de revoir les concepts du chapitre 3 ou d'organiser une séance de tutorat.",
                    "severity": "WARNING",
                    "type": "PEDAGOGICAL"
                })
            elif context.get("grading_pending", False):
                alert.update({
                    "message": "Retard de notation : Des copies attendent correction.",
                    "instructions": "Veuillez finaliser la saisie des notes avant la date butoir du jury.",
                    "severity": "INFO",
                    "type": "DEADLINE"
                })

        elif role == "ACADEMIC_ADVISOR":
            risk_count = context.get("risk_students_count", 0)
            if risk_count > 5:
                alert.update({
                    "message": f"Attention : {risk_count} étudiants sont en zone rouge dans votre département.",
                    "instructions": "Générez un rapport de suivi et convoquez les étudiants concernés pour un audit.",
                    "severity": "DANGER",
                    "type": "RISK_MANAGEMENT"
                })

        elif role in ["RECTORATE", "SECRETARIAT"]:
            # University Admins
            unpaid = context.get("unpaid_tuition_sum", 0)
            if unpaid > 1000000:
                alert.update({
                    "message": f"Finances : Le cumul des impayés dépasse le seuil ( {unpaid} FCFA ).",
                    "instructions": "Lancez une campagne de relance automatique et vérifiez les blocages d'accès.",
                    "severity": "WARNING",
                    "type": "FINANCIAL"
                })

        elif role == "ERP_PROVIDER":
            # Global Admins
            if context.get("server_load", 0) > 85:
                alert.update({
                    "message": "Infrastructure : Charge serveur critique détectée.",
                    "instructions": "Scalez les instances du microservice Python et vérifiez les fuites mémoire dans le service Rust.",
                    "severity": "CRITICAL",
                    "type": "SYSTEM"
                })
            elif context.get("security_breach", False):
                alert.update({
                    "message": "Sécurité : Tentatives de Brute Force détectées sur l'API Gateway.",
                    "instructions": "Activez le mode 'Strict' sur Redis et vérifiez les logs d'IP blacklistées.",
                    "severity": "CRITICAL",
                    "type": "SECURITY"
                })

        return alert
