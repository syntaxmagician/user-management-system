-- Seed data untuk User Management System
-- CATATAN PENTING: 
-- File ini hanya sebagai alternatif. DISARANKAN menggunakan script TypeScript: npm run db:seed
-- karena password hash di-generate dengan bcrypt secara dinamis.

-- Password untuk semua user: password123
-- Hash di bawah ini adalah contoh hash untuk "password123" dengan bcrypt (salt rounds 10)

-- Admin user
INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin User', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Dummy users (10 users)
-- Semua menggunakan password yang sama: password123
INSERT INTO users (id, email, name, password_hash, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000002', 'john.doe@example.com', 'John Doe', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('00000000-0000-0000-0000-000000000003', 'jane.smith@example.com', 'Jane Smith', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('00000000-0000-0000-0000-000000000004', 'bob.johnson@example.com', 'Bob Johnson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('00000000-0000-0000-0000-000000000005', 'alice.williams@example.com', 'Alice Williams', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('00000000-0000-0000-0000-000000000006', 'charlie.brown@example.com', 'Charlie Brown', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('00000000-0000-0000-0000-000000000007', 'diana.davis@example.com', 'Diana Davis', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000008', 'edward.miller@example.com', 'Edward Miller', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('00000000-0000-0000-0000-000000000009', 'fiona.wilson@example.com', 'Fiona Wilson', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000010', 'george.moore@example.com', 'George Moore', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('00000000-0000-0000-0000-000000000011', 'helen.taylor@example.com', 'Helen Taylor', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT (email) DO NOTHING;
