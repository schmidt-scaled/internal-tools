import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Environment {
  id: string
  name: string
  description: string | null
}

export function ManageEnvironments() {
  const [environments, setEnvironments] = useState<Environment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchEnvironments()
  }, [])

  const fetchEnvironments = async () => {
    try {
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .order('name')
      
      if (error) throw error
      setEnvironments(data || [])
    } catch (error) {
      console.error('Error fetching environments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (editingEnv) {
        const { error } = await supabase
          .from('environments')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEnv.id)
        if (error) throw error
        setSuccess('Environment updated successfully')
      } else {
        const { error } = await supabase
          .from('environments')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim() || null
          }])
        if (error) throw error
        setSuccess('Environment added successfully')
      }
      
      setFormData({ name: '', description: '' })
      setShowForm(false)
      setEditingEnv(null)
      fetchEnvironments()
    } catch (error) {
      console.error('Error saving environment:', error)
      setError(error.message || 'Failed to save environment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (env: Environment) => {
    setEditingEnv(env)
    setFormData({ name: env.name, description: env.description || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will also delete related reservations.')) return
    
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase
        .from('environments')
        .delete()
        .eq('id', id)
      if (error) throw error
      setSuccess('Environment deleted successfully')
      fetchEnvironments()
    } catch (error) {
      console.error('Error deleting environment:', error)
      setError(error.message || 'Failed to delete environment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading environments...</span>
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Environments</h2>
        <button
          onClick={() => {
            setFormData({ name: '', description: '' })
            setEditingEnv(null)
            setShowForm(true)
            setError(null)
            setSuccess(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Environment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError(null)
                setSuccess(null)
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : (editingEnv ? 'Update' : 'Add')} Environment
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        {environments.length === 0 && !showForm ? (
          <div className="p-8 text-center">
            <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No environments yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first environment.</p>
            <button
              onClick={() => {
                setFormData({ name: '', description: '' })
                setEditingEnv(null)
                setShowForm(true)
                setError(null)
                setSuccess(null)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Environment
            </button>
          </div>
        ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {environments.map((env) => (
              <tr key={env.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{env.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{env.description || '-'}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(env)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(env.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}