/*
  # Add missing GitHub commit tag backend column

  1. Changes
    - Add `github_commit_tag_backend` column to `test_runs` table
    - Column is nullable to maintain compatibility with existing records

  2. Notes
    - This column was referenced in the application code but missing from the database schema
    - Uses conditional logic to avoid errors if column already exists
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'github_commit_tag_backend'
  ) THEN
    ALTER TABLE test_runs ADD COLUMN github_commit_tag_backend text;
  END IF;
END $$;