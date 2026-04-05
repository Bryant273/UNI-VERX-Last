-- Pedagogy & Maquettes - Core Structure
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    credits INTEGER DEFAULT 3,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    level VARCHAR(50) NOT NULL, -- L1, L2, L3, M1, M2
    department_id INTEGER REFERENCES departments(id),
    academic_year VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- LECTURE_HALL, CLASSROOM, LAB
    building VARCHAR(100),
    status VARCHAR(50) DEFAULT 'AVAILABLE'
);
