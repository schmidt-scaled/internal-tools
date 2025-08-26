import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import { supabase } from '../lib/supabase'

const schema = yup.object({
  test_type_id: yup.string().required('Test type is required'),
  environment_id: yup.string().required('Environment is required'),
  jira_ticket: yup.string(),
  github_branch_frontend: yup.string(),
  github_branch_backend: yup.string(),
  github_commit_tag_frontend: yup.string(),
  github_commit_tag_backend: yup.string(),
})

type FormData = yup.InferType<typeof schema>

interface TestRunFormProps {
  onSave: () => void
  onCancel: () => void
}

export function TestRunForm({ onSave, onCancel }: TestRunFormProps) {
  const [testTypes, setTestTypes] = useState<any[]>([])
  const [environments, setEnvironments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    fetchTestTypes()
    fetchEnvironments()
  }, [])

  const fetchTestTypes = async () => {
    const { data } = await supabase.from('test_types').select('*').order('name')
    setTestTypes(data || [])
  }

  const fetchEnvironments = async () => {
    const { data } = await supabase.from('environments').select('*').order('name')
    setEnvironments(data || [])
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('test_runs')
        .insert([{
          ...data,
          status: 'started',
          started_at: new Date().toISOString(),
        }])
      if (error) throw error
      onSave()
    } catch (error) {
      console.error('Error creating test run:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">New Test Run</h2>
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
              Test Type
            </label>
            <select
              {...register('test_type_id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select test type</option>
              {testTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.test_type_id && (
              <p className="text-red-600 text-sm mt-1">{errors.test_type_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment
            </label>
            <select
              {...register('environment_id')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select environment</option>
              {environments.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
            {errors.environment_id && (
              <p className="text-red-600 text-sm mt-1">{errors.environment_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jira Ticket (Optional)
            </label>
            <input
              {...register('jira_ticket')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., PROJ-123"
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Branch Frontend (Optional)
                </label>
                <input
                  {...register('github_branch_frontend')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., main, develop, feature/xyz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Branch Backend (Optional)
                </label>
                <input
                  {...register('github_branch_backend')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., main, develop, feature/abc"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Commit/Tag Frontend (Optional)
              </label>
              <input
                {...register('github_commit_tag_frontend')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., abc123, v1.2.3, latest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Commit/Tag Backend (Optional)
              </label>
              <input
                {...register('github_commit_tag_backend')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., def456, v2.1.0, latest"
              />
            </div>
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
              {loading ? 'Starting...' : 'Start Test Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}