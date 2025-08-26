/*
  # Add missing GitHub columns to test_runs table

  1. Changes
    - Add `github_commit_tag_backend` column to `test_runs` table
    - This column was referenced in the application but missing from the database schema

  2. Notes
    - Column is nullable to maintain compatibility with existing records
    - Uses TEXT type to store commit hashes or tags
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