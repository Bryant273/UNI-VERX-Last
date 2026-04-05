-- Finance & HR
CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    contractor_name VARCHAR(200) NOT NULL,
    contractor_type VARCHAR(50) NOT NULL,
    contract_type VARCHAR(20) NOT NULL,
    role_or_service VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    amount DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'FCFA',
    document_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treasury (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    origin_or_recipient VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL, -- INCOME, EXPENSE
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'COMPLETED',
    reference_number VARCHAR(100) UNIQUE,
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
