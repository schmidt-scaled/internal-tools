import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'

type TestRun = Database['public']['Tables']['test_runs']['Row']

interface AddCommentModalProps {
  testRun: TestRun
  onSave: () => void
  onCancel: () => void
}

interface FormData {
  completion_comment: string
}

export function AddCommentModal({ testRun, onSave, onCancel }: AddCommentModalProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      completion_comment: testRun.completion_comment || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('test_runs')
        .update({
          completion_comment: data.completion_comment,
          updated_at: new Date().toISOString(),
        })
        .eq('id', testRun.id)

      if (error) throw error
      onSave()
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Comment</h2>
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
              Comment
            </label>
            <textarea
              {...register('completion_comment', { required: 'Comment is required' })}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about the test run progress..."
            />
            {errors.completion_comment && (
              <p className="text-red-600 text-sm mt-1">{errors.completion_comment.message}</p>
            )}
          </div>

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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}