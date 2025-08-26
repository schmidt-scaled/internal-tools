import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface CreateTestRunRequest {
  test_type_id: string
  environment_id: string
  jira_ticket?: string
  github_branch_frontend?: string
  github_branch_backend?: string
  github_commit_tag_frontend?: string
  github_commit_tag_backend?: string
}

interface CompleteTestRunRequest {
  test_run_id: string
  status: 'completed' | 'failed'
  completion_comment?: string
  completion_jira_ticket?: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create a new test run
    if (req.method === 'POST' && url.pathname.endsWith('/create')) {
      const body: CreateTestRunRequest = await req.json()
      
      const { data, error } = await supabaseClient
        .from('test_runs')
        .insert([{
          test_type_id: body.test_type_id,
          environment_id: body.environment_id,
          jira_ticket: body.jira_ticket,
          github_branch_frontend: body.github_branch_frontend,
          github_branch_backend: body.github_branch_backend,
          github_commit_tag_frontend: body.github_commit_tag_frontend,
          github_commit_tag_backend: body.github_commit_tag_backend,
          status: 'started',
          started_at: new Date().toISOString(),
        }])
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Complete a test run
    if (req.method === 'PUT' && url.pathname.endsWith('/complete')) {
      const body: CompleteTestRunRequest = await req.json()
      
      const { data, error } = await supabaseClient
        .from('test_runs')
        .update({
          status: body.status,
          completed_at: new Date().toISOString(),
          completion_comment: body.completion_comment,
          completion_jira_ticket: body.completion_jira_ticket,
          updated_at: new Date().toISOString(),
        })
        .eq('id', body.test_run_id)
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get test runs with optional filtering
    if (req.method === 'GET') {
      const status = url.searchParams.get('status')
      const environment_id = url.searchParams.get('environment_id')
      const test_type_id = url.searchParams.get('test_type_id')
      
      let query = supabaseClient
        .from('test_runs')
        .select(`
          *,
          test_types (name),
          environments (name)
        `)
        .order('started_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }
      if (environment_id) {
        query = query.eq('environment_id', environment_id)
      }
      if (test_type_id) {
        query = query.eq('test_type_id', test_type_id)
      }

      const { data, error } = await query

      if (error) throw error

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})