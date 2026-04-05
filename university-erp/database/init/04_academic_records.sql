-- Academic Records - Dynamic Data
CREATE TABLE IF NOT EXISTS timetable_events (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id),
    room_id INTEGER REFERENCES rooms(id),
    teacher_id INTEGER REFERENCES users(id),
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type VARCHAR(20) NOT NULL -- CM, TD, TP, EXAM
);

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    file_status VARCHAR(50) DEFAULT 'Incomplet',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    score DECIMAL(4,2) CHECK (score >= 0 AND score <= 20),
    appraisal VARCHAR(50),
    coefficient DECIMAL(3,1) DEFAULT 1.0,
    semester VARCHAR(20) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    graded_by INTEGER REFERENCES users(id),
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
