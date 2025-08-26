# Test Runs API Documentation

This document describes the API endpoints for managing test runs in the Environment and Test Run Management System.

## Base URL

```
https://your-supabase-project.supabase.co/functions/v1/test-runs
```

## Authentication

All API calls require authentication using your Supabase service role key or anon key:

```
Authorization: Bearer YOUR_SUPABASE_KEY
```

## Endpoints

### 1. Create a New Test Run

**POST** `/test-runs/create`

Creates a new test run with "started" status.

#### Request Body

```json
{
  "test_type_id": "uuid-of-test-type",
  "environment_id": "uuid-of-environment", 
  "jira_ticket": "PROJ-123", // optional
  "github_branch_frontend": "main", // optional
  "github_branch_backend": "develop", // optional
  "github_commit_tag_frontend": "v1.2.3", // optional
  "github_commit_tag_backend": "v2.1.0" // optional
}
```

#### Example Request

```bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/test-runs/create' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "test_type_id": "550e8400-e29b-41d4-a716-446655440000",
    "environment_id": "550e8400-e29b-41d4-a716-446655440001",
    "jira_ticket": "PROJ-123",
    "github_branch_frontend": "main",
    "github_branch_backend": "develop", 
    "github_commit_tag_frontend": "v1.2.3",
    "github_commit_tag_backend": "v2.1.0"
  }'
```

#### Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "test_type_id": "550e8400-e29b-41d4-a716-446655440000",
  "environment_id": "550e8400-e29b-41d4-a716-446655440001",
  "jira_ticket": "PROJ-123",
  "github_branch_frontend": "main",
  "github_branch_backend": "develop",
  "github_commit_tag_frontend": "v1.2.3",
  "github_commit_tag_backend": "v2.1.0",
  "status": "started",
  "started_at": "2024-01-15T10:30:00.000Z",
  "completed_at": null,
  "completion_comment": null,
  "completion_jira_ticket": null,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

### 2. Complete a Test Run

**PUT** `/test-runs/complete`

Completes an existing test run by updating its status and completion details.

#### Request Body

```json
{
  "test_run_id": "uuid-of-test-run",
  "status": "completed", // or "failed"
  "completion_comment": "All tests passed successfully", // optional
  "completion_jira_ticket": "PROJ-124" // optional
}
```

#### Example Request

```bash
curl -X PUT \
  'https://your-project.supabase.co/functions/v1/test-runs/complete' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "test_run_id": "550e8400-e29b-41d4-a716-446655440002",
    "status": "completed",
    "completion_comment": "All tests passed successfully",
    "completion_jira_ticket": "PROJ-124"
  }'
```

#### Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "test_type_id": "550e8400-e29b-41d4-a716-446655440000",
  "environment_id": "550e8400-e29b-41d4-a716-446655440001",
  "jira_ticket": "PROJ-123",
  "github_branch_frontend": "main",
  "github_branch_backend": "develop",
  "github_commit_tag_frontend": "v1.2.3",
  "github_commit_tag_backend": "v2.1.0",
  "status": "completed",
  "started_at": "2024-01-15T10:30:00.000Z",
  "completed_at": "2024-01-15T11:45:00.000Z",
  "completion_comment": "All tests passed successfully",
  "completion_jira_ticket": "PROJ-124",
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T11:45:00.000Z"
}
```

### 3. Get Test Runs (with filtering)

**GET** `/test-runs`

Retrieves test runs with optional filtering parameters.

#### Query Parameters

- `status` (optional): Filter by status (`started`, `completed`, `failed`)
- `environment_id` (optional): Filter by environment UUID
- `test_type_id` (optional): Filter by test type UUID

#### Example Requests

```bash
# Get all test runs
curl -X GET \
  'https://your-project.supabase.co/functions/v1/test-runs' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY'

# Get only started test runs
curl -X GET \
  'https://your-project.supabase.co/functions/v1/test-runs?status=started' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY'

# Get test runs for specific environment
curl -X GET \
  'https://your-project.supabase.co/functions/v1/test-runs?environment_id=550e8400-e29b-41d4-a716-446655440001' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY'
```

#### Response

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "test_type_id": "550e8400-e29b-41d4-a716-446655440000",
    "environment_id": "550e8400-e29b-41d4-a716-446655440001",
    "jira_ticket": "PROJ-123",
    "github_branch_frontend": "main",
    "github_branch_backend": "develop",
    "github_commit_tag_frontend": "v1.2.3",
    "status": "completed",
    "started_at": "2024-01-15T10:30:00.000Z",
    "completed_at": "2024-01-15T11:45:00.000Z",
    "completion_comment": "All tests passed successfully",
    "completion_jira_ticket": "PROJ-124",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:45:00.000Z",
    "test_types": {
      "name": "Integration Tests"
    },
    "environments": {
      "name": "Production"
    }
  }
]
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

### 400 Bad Request
```json
{
  "error": "Missing required field: test_type_id"
}
```

### 404 Not Found
```json
{
  "error": "Test run not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Database connection failed"
}
```

## Getting UUIDs for Environments and Test Types

To get the UUIDs needed for API calls, you can query the database directly:

### Get Environments
```sql
SELECT id, name FROM environments ORDER BY name;
```

### Get Test Types
```sql
SELECT id, name FROM test_types ORDER BY name;
```

Or use the Supabase client:

```javascript
// Get environments
const { data: environments } = await supabase
  .from('environments')
  .select('id, name')
  .order('name');

// Get test types  
const { data: testTypes } = await supabase
  .from('test_types')
  .select('id, name')
  .order('name');
```

## Integration Examples

### CI/CD Pipeline Integration

```bash
#!/bin/bash

# Start a test run
TEST_RUN_ID=$(curl -s -X POST \
  'https://your-project.supabase.co/functions/v1/test-runs/create' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "test_type_id": "'$TEST_TYPE_ID'",
    "environment_id": "'$ENVIRONMENT_ID'",
    "jira_ticket": "'$JIRA_TICKET'",
    "github_branch_frontend": "'$FRONTEND_BRANCH'",
    "github_branch_backend": "'$BACKEND_BRANCH'",
    "github_commit_tag_frontend": "'$FRONTEND_COMMIT'",
    "github_commit_tag_backend": "'$BACKEND_COMMIT'"
  }' | jq -r '.id')

# Run your tests here
./run-tests.sh

# Complete the test run based on test results
if [ $? -eq 0 ]; then
  STATUS="completed"
  COMMENT="All tests passed"
else
  STATUS="failed" 
  COMMENT="Some tests failed"
fi

curl -X PUT \
  'https://your-project.supabase.co/functions/v1/test-runs/complete' \
  -H 'Authorization: Bearer YOUR_SUPABASE_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "test_run_id": "'$TEST_RUN_ID'",
    "status": "'$STATUS'",
    "completion_comment": "'$COMMENT'"
  }'
```

### JavaScript/Node.js Example

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-supabase-key';

async function createTestRun(testTypeId, environmentId, jiraTicket) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/test-runs/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_type_id: testTypeId,
      environment_id: environmentId,
      jira_ticket: jiraTicket,
      github_branch_frontend: 'main',
      github_branch_backend: 'develop',
      github_commit_tag_frontend: 'v1.2.3',
      github_commit_tag_backend: 'v2.1.0'
    })
  });
  
  return await response.json();
}

async function completeTestRun(testRunId, status, comment, jiraTicket) {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/test-runs/complete`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      test_run_id: testRunId,
      status: status,
      completion_comment: comment,
      completion_jira_ticket: jiraTicket
    })
  });
  
  return await response.json();
}

// Usage
const testRun = await createTestRun(
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001', 
  'PROJ-123'
);

// ... run tests ...

await completeTestRun(
  testRun.id,
  'completed',
  'All tests passed successfully',
  'PROJ-124'
);
```