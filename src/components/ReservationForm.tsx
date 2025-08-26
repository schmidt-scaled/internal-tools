import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { X } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'

const schema = yup.object({
  environment_id: yup.string().required('Environment is required'),
  user_id: yup.string().required('User is required'),
  environment_name: yup.string().required('Environment name is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  sbcli_branch: yup.string(),
  sbcli_commit: yup.string(),
  ultra_branch: yup.string(),
  ultra_commit: yup.string(),
  status: yup.string().oneOf(['empty', 'deployed', 'running', 'completed']).required(),
})

type FormData = yup.InferType<typeof schema>

interface ReservationFormProps {
  reservation?: Database['public']['Tables']['environment_reservations']['Row'] | null
  onSave: () => void
  onCancel: () => void
}

export function ReservationForm({ reservation, onSave, onCancel }: ReservationFormProps) {
  const [environments, setEnvironments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      environment_id: reservation?.environment_id || '',
      user_id: reservation?.user_id || '',
      environment_name: reservation?.environment_name || '',
      start_date: reservation?.start_date || '',
      end_date: reservation?.end_date || '',
      sbcli_branch: reservation?.sbcli_branch || '',
      sbcli_commit: reservation?.sbcli_commit || '',
      ultra_branch: reservation?.ultra_branch || '',
      ultra_commit: reservation?.ultra_commit || '',
      status: reservation?.status || 'empty',
    },
  })

  useEffect(() => {
    fetchEnvironments()
    fetchUsers()
  }, [])

  const fetchEnvironments = async () => {
    const { data } = await supabase.from('environments').select('*').order('name')
    setEnvironments(data || [])
  }

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*').order('name')
    setUsers(data || [])
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (reservation) {
        const { error } = await supabase
          .from('environment_reservations')
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', reservation.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('environment_reservations')
          .insert([data])
        if (error) throw error
      }
      onSave()
    } catch (error) {
      console.error('Error saving reservation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {reservation ? 'Edit Reservation' : 'New Reservation'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                User
              </label>
              <select
                {...register('user_id')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.user_id && (
                <p className="text-red-600 text-sm mt-1">{errors.user_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Environment Name
            </label>
            <input
              {...register('environment_name')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.environment_name && (
              <p className="text-red-600 text-sm mt-1">{errors.environment_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                {...register('start_date')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.start_date && (
                <p className="text-red-600 text-sm mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                {...register('end_date')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.end_date && (
                <p className="text-red-600 text-sm mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SBCLI Branch
              </label>
              <input
                {...register('sbcli_branch')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., main, develop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SBCLI Commit
              </label>
              <input
                {...register('sbcli_commit')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., abc123"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ultra Branch
              </label>
              <input
                {...register('ultra_branch')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., main, develop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ultra Commit
              </label>
              <input
                {...register('ultra_commit')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., def456"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="empty">Empty</option>
              <option value="deployed">Deployed</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
            </select>
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
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}