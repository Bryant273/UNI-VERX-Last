-- Performance Indices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_grades_user_id ON grades(user_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_ai_performance_student ON ai_student_performance(student_id);
