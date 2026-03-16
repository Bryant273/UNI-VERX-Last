-- Organization
CREATE TABLE IF NOT EXISTS faculties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    faculty_id INTEGER REFERENCES faculties(id),
    head_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'Active'
);
