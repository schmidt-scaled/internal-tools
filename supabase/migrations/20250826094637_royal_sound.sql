/*
  # Add GitHub commit tag for backend

  1. Changes
    - Add `github_commit_tag_backend` column to `test_runs` table
    - This complements the existing frontend commit tag field
    - Allows tracking of both frontend and backend commit hashes/tags

  2. Security
    - No RLS changes needed as test_runs table already has proper policies
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