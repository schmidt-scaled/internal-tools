import React, { useState } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'

type TestRun = Database['public']['Tables']['test_runs']['Row']

interface CompleteRunModalProps {
  testRun: TestRun
  onComplete: () => void
  onCancel: () => void
}

interface FormData {
  status: 'completed' | 'failed'
  completion_comment: string
  completion_jira_ticket: string
  failure_reason_id: string
}

export function CompleteRunModal({ testRun, onComplete, onCancel }: CompleteRunModalProps) {
  const [loading, setLoading] = useState(false)
  const [failureReasons, setFailureReasons] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      status: 'completed',
      completion_comment: '',
      completion_jira_ticket: testRun.jira_ticket || '',
      failure_reason_id: '',
    },
  })

  const watchedStatus = watch('status')

  useEffect(() => {
    fetchFailureReasons()
  }, [])

  const fetchFailureReasons = async () => {
    const { data } = await supabase.from('failure_reasons').select('*').order('name')
    setFailureReasons(data || [])
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const updateData: any = {
        status: data.status,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completion_comment: data.completion_comment || null,
        completion_jira_ticket: data.completion_jira_ticket || null,
      }

      if (data.status === 'failed' && data.failure_reason_id) {
        updateData.failure_reason_id = data.failure_reason_id
      }

      const { error } = await supabase
        .from('test_runs')
        .update(updateData)
        .eq('id', testRun.id)

      if (error) throw error
      onComplete()
    } catch (error) {
      console.error('Error completing test run:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Complete Test Run</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments (Optional)
            </label>
            <textarea
              {...register('completion_comment')}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any notes about the test run..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jira Ticket (Optional)
            </label>
            <input
              {...register('completion_jira_ticket')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PROJ-123"
            />
          </div>

          {watchedStatus === 'failed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Failure Reason
              </label>
              <select
                {...register('failure_reason_id')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select failure reason (optional)</option>
                {failureReasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}