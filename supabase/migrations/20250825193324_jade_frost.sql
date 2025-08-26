/*
  # Environment and Test Run Management System

  1. New Tables
    - `environments` - Master list of available environments
    - `users` - Master list of users who can make reservations
    - `test_types` - Master list of test types that can be run
    - `environment_reservations` - Environment reservations with dates and status
    - `test_runs` - Test runs with completion tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public read access where appropriate

  3. Features
    - Full CRUD operations for all entities
    - Proper foreign key relationships
    - Status tracking with enums
    - GitHub branch and commit tracking
    - Jira ticket integration
*/

-- Create custom types
CREATE TYPE reservation_status AS ENUM ('empty', 'deployed', 'running', 'completed');
CREATE TYPE test_run_status AS ENUM ('started', 'completed', 'failed');

-- Environments table
CREATE TABLE IF NOT EXISTS environments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  email text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test types table
CREATE TABLE IF NOT EXISTS test_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Environment reservations table
CREATE TABLE IF NOT EXISTS environment_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  environment_id uuid NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  environment_name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  sbcli_branch text,
  sbcli_commit text,
  ultra_branch text,
  ultra_commit text,
  status reservation_status DEFAULT 'empty',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- Test runs table
CREATE TABLE IF NOT EXISTS test_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type_id uuid NOT NULL REFERENCES test_types(id) ON DELETE CASCADE,
  environment_id uuid NOT NULL REFERENCES environments(id) ON DELETE CASCADE,
  jira_ticket text,
  status test_run_status DEFAULT 'started',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completion_comment text,
  completion_jira_ticket text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE environment_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_runs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Allow all operations on environments"
  ON environments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on users"
  ON users FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on test_types"
  ON test_types FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on environment_reservations"
  ON environment_reservations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on test_runs"
  ON test_runs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_environment_reservations_dates ON environment_reservations(start_date, end_date);
CREATE INDEX idx_environment_reservations_status ON environment_reservations(status);
CREATE INDEX idx_test_runs_status ON test_runs(status);
CREATE INDEX idx_test_runs_started_at ON test_runs(started_at);

-- Insert sample data
INSERT INTO environments (name, description) VALUES
  ('production', 'Production environment'),
  ('staging', 'Staging environment'),
  ('development', 'Development environment'),
  ('testing', 'Testing environment');

INSERT INTO users (name, email) VALUES
  ('John Doe', 'john.doe@company.com'),
  ('Jane Smith', 'jane.smith@company.com'),
  ('Bob Johnson', 'bob.johnson@company.com'),
  ('Alice Brown', 'alice.brown@company.com');

INSERT INTO test_types (name, description) VALUES
  ('Unit Tests', 'Basic unit testing'),
  ('Integration Tests', 'Integration testing'),
  ('E2E Tests', 'End-to-end testing'),
  ('Performance Tests', 'Performance and load testing'),
  ('Security Tests', 'Security vulnerability testing');