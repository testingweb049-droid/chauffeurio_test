-- Complete Database Schema for Chauffeurio
-- Execute this file in PgAdmin to create ALL tables for the application
-- This includes: orders table + admin tables

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chauffeurio_order (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic booking details
    category VARCHAR NOT NULL,
    price VARCHAR NOT NULL,
    car VARCHAR NOT NULL,
    distance VARCHAR,
    stops TEXT[],
    
    -- Trip & timing info
    pickup_date TIMESTAMP,
    pickup_time VARCHAR,
    return_date TIMESTAMP,
    return_time VARCHAR,
    is_return BOOLEAN,
    
    -- Locations
    pickup_location VARCHAR NOT NULL,
    dropoff_location VARCHAR,
    
    -- Passenger details
    passengers INTEGER NOT NULL,
    kids INTEGER NOT NULL,
    bags INTEGER NOT NULL,
    
    -- Contact info
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    
    -- Flight & payment
    flight_name VARCHAR,
    flight_number VARCHAR,
    is_airport_pickup BOOLEAN,
    car_image VARCHAR,
    
    payment_id VARCHAR,
    payment_method VARCHAR,
    duration INTEGER,
    flight_track BOOLEAN,
    meet_greet BOOLEAN,
    
    -- Extras Fields
    child_seat VARCHAR,
    infant_seat VARCHAR,
    booster_seat VARCHAR,
    extras_description TEXT,
    extras_total VARCHAR,
    extras_flight_track VARCHAR,
    extras_meet_greet VARCHAR,
    extra_stops VARCHAR,
    
    payment_status VARCHAR NOT NULL DEFAULT 'pending',
    payment_secret VARCHAR NOT NULL,
    session_id VARCHAR,
    
    -- Audit
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add comment to orders table
COMMENT ON TABLE chauffeurio_order IS 'Stores all booking orders from customers';

-- ============================================
-- ADMIN TABLES
-- ============================================

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS admins_email_idx ON admins(email);

-- Create admin_sessions table for session management
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes on admin_sessions
CREATE INDEX IF NOT EXISTS admin_sessions_token_idx ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx ON admin_sessions(admin_id);

-- Create admin_logs table for activity tracking
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes on admin_logs
CREATE INDEX IF NOT EXISTS admin_logs_admin_id_idx ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS admin_logs_created_at_idx ON admin_logs(created_at);

-- Add comments to admin tables
COMMENT ON TABLE admins IS 'Stores admin user accounts with authentication credentials';
COMMENT ON TABLE admin_sessions IS 'Stores active admin sessions for cookie-based authentication';
COMMENT ON TABLE admin_logs IS 'Stores admin activity logs for audit purposes';

-- ============================================
-- VERIFICATION QUERIES (Optional - Run to verify)
-- ============================================

-- Check if tables exist:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('chauffeurio_order', 'admins', 'admin_sessions', 'admin_logs');

-- Check table structures:
-- \d chauffeurio_order
-- \d admins
-- \d admin_sessions
-- \d admin_logs

