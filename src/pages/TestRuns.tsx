import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Play, CheckCircle } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'
import { TestRunForm } from '../components/TestRunForm'
import { TestRunList } from '../components/TestRunList'
import { CompleteRunModal } from '../components/CompleteRunModal'
import { AddCommentModal } from '../components/AddCommentModal'

type TestRun = Database['public']['Tables']['test_runs']['Row'] & {
  test_types: { name: string } | null
  environments: { name: string } | null
}

export function TestRuns() {
  const [testRuns, setTestRuns] = useState<TestRun[]>([])
  const [filteredRuns, setFilteredRuns] = useState<TestRun[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [completingRun, setCompletingRun] = useState<TestRun | null>(null)
  const [commentingRun, setCommentingRun] = useState<TestRun | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTestRuns()
  }, [])

  useEffect(() => {
    filterRuns()
  }, [testRuns, searchTerm, statusFilter])

  const fetchTestRuns = async () => {
    try {
      const { data, error } = await supabase
        .from('test_runs')
        .select(`
          *,
          test_types (name),
          environments (name),
          failure_reasons (name)
        `)
        .order('started_at', { ascending: false })

      if (error) throw error
      setTestRuns(data || [])
    } catch (error) {
      console.error('Error fetching test runs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRuns = () => {
    let filtered = testRuns

    if (searchTerm) {
      filtered = filtered.filter(run =>
        run.test_types?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.environments?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.jira_ticket?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.completion_comment?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(run => run.status === statusFilter)
    }

    setFilteredRuns(filtered)
  }

  const handleRunSave = () => {
    fetchTestRuns()
    setShowForm(false)
  }

  const handleCompleteRun = (run: TestRun) => {
    setCompletingRun(run)
    setShowCompleteModal(true)
  }

  const handleAddComment = (run: TestRun) => {
    setCommentingRun(run)
    setShowCommentModal(true)
  }

  const handleDeleteRun = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test run?')) return

    try {
      const { error } = await supabase
        .from('test_runs')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchTestRuns()
    } catch (error) {
      console.error('Error deleting test run:', error)
    }
  }

  const handleRunCompleted = () => {
    fetchTestRuns()
    setShowCompleteModal(false)
    setCompletingRun(null)
  }

  const handleCommentAdded = () => {
    fetchTestRuns()
    setShowCommentModal(false)
    setCommentingRun(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'started': return <Play className="w-4 h-4 text-blue-600" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed': return <CheckCircle className="w-4 h-4 text-red-600" />
      default: return <Play className="w-4 h-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Runs</h1>
          <p className="text-gray-600 mt-1">Track and manage test execution</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test Run
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search test runs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="started">Started</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <TestRunList
        testRuns={filteredRuns}
        onComplete={handleCompleteRun}
        onDelete={handleDeleteRun}
        onAddComment={handleAddComment}
        getStatusIcon={getStatusIcon}
      />

      {showForm && (
        <TestRunForm
          onSave={handleRunSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showCompleteModal && completingRun && (
        <CompleteRunModal
          testRun={completingRun}
          onComplete={handleRunCompleted}
          onCancel={() => {
            setShowCompleteModal(false)
            setCompletingRun(null)
          }}
        />
      )}

      {showCommentModal && commentingRun && (
        <AddCommentModal
          testRun={commentingRun}
          onSave={handleCommentAdded}
          onCancel={() => {
            setShowCommentModal(false)
            setCommentingRun(null)
          }}
        />
      )}
    </div>
  )
}