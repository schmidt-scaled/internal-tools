/*
  # Add failure reasons table and update test runs

  1. New Tables
    - `failure_reasons`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to existing tables
    - Add `failure_reason_id` to `test_runs` table

  3. Security
    - Enable RLS on `failure_reasons` table
    - Add policy for authenticated users to manage failure reasons
*/

CREATE TABLE IF NOT EXISTS failure_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE failure_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on failure_reasons"
  ON failure_reasons
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add failure_reason_id to test_runs table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'failure_reason_id'
  ) THEN
    ALTER TABLE test_runs ADD COLUMN failure_reason_id uuid REFERENCES failure_reasons(id);
  END IF;
END $$;

-- Insert some default failure reasons
INSERT INTO failure_reasons (name, description) VALUES
  ('Environment Issue', 'Problems with the test environment setup or configuration'),
  ('Test Data Issue', 'Issues with test data or database state'),
  ('Code Bug', 'Bug in the application code being tested'),
  ('Test Script Error', 'Error in the test automation scripts'),
  ('Infrastructure Failure', 'Network, server, or infrastructure related failures'),
  ('Timeout', 'Test execution exceeded time limits'),
  ('Configuration Error', 'Incorrect configuration settings')
ON CONFLICT (name) DO NOTHING;