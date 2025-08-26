/*
  # Add GitHub fields to test runs

  1. Schema Changes
    - Add `github_branch_frontend` (text, optional)
    - Add `github_branch_backend` (text, optional) 
    - Add `github_commit_tag_frontend` (text, optional)

  2. Notes
    - All fields are optional to maintain backward compatibility
    - Fields support branch names and commit tags/hashes
*/

DO $$
BEGIN
  -- Add github_branch_frontend column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'github_branch_frontend'
  ) THEN
    ALTER TABLE test_runs ADD COLUMN github_branch_frontend text;
  END IF;

  -- Add github_branch_backend column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'github_branch_backend'
  ) THEN
    ALTER TABLE test_runs ADD COLUMN github_branch_backend text;
  END IF;

  -- Add github_commit_tag_frontend column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'test_runs' AND column_name = 'github_commit_tag_frontend'
  ) THEN
    ALTER TABLE test_runs ADD COLUMN github_commit_tag_frontend text;
  END IF;
END $$;