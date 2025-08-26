import React from 'react'
import { format } from 'date-fns'
import { ExternalLink, Clock, CheckCircle, GitBranch, Trash2, MessageSquare, AlertTriangle } from 'lucide-react'
import { Database } from '../lib/supabase'

type TestRun = Database['public']['Tables']['test_runs']['Row'] & {
  test_types: { name: string } | null
  environments: { name: string } | null
  failure_reasons: { name: string } | null
}

interface TestRunListProps {
  testRuns: TestRun[]
  onComplete: (run: TestRun) => void
  onDelete: (id: string) => void
  onAddComment: (run: TestRun) => void
  getStatusIcon: (status: string) => React.ReactNode
}

export function TestRunList({ testRuns, onComplete, onDelete, onAddComment, getStatusIcon }: TestRunListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDuration = (startedAt: string, completedAt?: string | null) => {
    const start = new Date(startedAt)
    const end = completedAt ? new Date(completedAt) : new Date()
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`
    }
    return `${diffMins}m`
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Test Runs ({testRuns.length})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {testRuns.map((run) => (
          <div key={run.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(run.status)}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {run.test_types?.name}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(run.status)}`}>
                      {run.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{run.environments?.name}</span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {format(new Date(run.started_at), 'MMM d, HH:mm')}
                    </span>
                    <span>Duration: {getDuration(run.started_at, run.completed_at)}</span>
                    {run.completion_comment && (
                      <span 
                        className="flex items-center cursor-help text-blue-600"
                        title={run.completion_comment}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comment
                      </span>
                    )}
                    {run.status === 'failed' && run.failure_reasons && (
                      <span className="flex items-center text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        {run.failure_reasons.name}
                      </span>
                    )}
                  </div>
                  {(run.jira_ticket || run.completion_jira_ticket) && (
                    <div className="flex items-center space-x-2 mt-2">
                      {run.jira_ticket && (
                        <a
                          href={`#${run.jira_ticket}`}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {run.jira_ticket}
                        </a>
                      )}
                      {run.completion_jira_ticket && run.completion_jira_ticket !== run.jira_ticket && (
                        <a
                          href={`#${run.completion_jira_ticket}`}
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {run.completion_jira_ticket}
                        </a>
                      )}
                    </div>
                  )}
                  {(run.github_branch_frontend || run.github_branch_backend) && (
                    <div className="text-xs space-y-1 mt-2">
                      {run.github_branch_frontend && (
                        <div className="flex items-center text-gray-600">
                          <GitBranch className="w-3 h-3 mr-1" />
                          <span className="font-medium">Frontend:</span>
                          <span className="ml-1">{run.github_branch_frontend}</span>
                          {run.github_commit_tag_frontend && (
                            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                              {run.github_commit_tag_frontend}
                            </span>
                          )}
                        </div>
                      )}
                      {run.github_branch_backend && (
                        <div className="flex items-center text-gray-600">
                          <GitBranch className="w-3 h-3 mr-1" />
                          <span className="font-medium">Backend:</span>
                          <span className="ml-1">{run.github_branch_backend}</span>
                          {run.github_commit_tag_backend && (
                            <span className="ml-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono text-xs">
                              {run.github_commit_tag_backend}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {run.status === 'started' && (
                  <>
                    <button
                      onClick={() => onAddComment(run)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Comment
                    </button>
                    <button
                      onClick={() => onComplete(run)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </button>
                  </>
                )}
                <button
                  onClick={() => onDelete(run.id)}
                  className="flex items-center px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {testRuns.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No test runs found</p>
          </div>
        )}
      </div>
    </div>
  )
}