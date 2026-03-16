-- Blue AI Neural Tables
CREATE TABLE IF NOT EXISTS ai_alerts (
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_student_performance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    average_grade DECIMAL(4,2),
    attendance_rate DECIMAL(5,2),
    predicted_success_rate DECIMAL(3,2),
    trend VARCHAR(20),
    last_analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
