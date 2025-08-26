import React, { useState } from 'react';
import { format } from 'date-fns';
import { Play, Pause, CheckCircle, XCircle, Plus, Trash2 } from 'lucide-react';
import { useTestRuns } from '../hooks/useSupabaseData';
import { TestRunModal } from './TestRunModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function TestRuns() {
  const [showModal, setShowModal] = useState(false);
  const [editingRun, setEditingRun] = useState<any>(null);
  
  const { testRuns, loading, refetch } = useTestRuns();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'started': return <Play className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Play className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'started': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (runId: string, newStatus: 'started' | 'completed' | 'failed') => {
    try {
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (newStatus === 'completed' && !testRuns.find(r => r.id === runId)?.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('test_runs')
        .update(updateData)
        .eq('id', runId);

      if (error) throw error;

      toast.success('Status updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (runId: string) => {
    if (!confirm('Are you sure you want to delete this test run?')) return;

    try {
      const { error } = await supabase
        .from('test_runs')
        .delete()
        .eq('id', runId);

      if (error) throw error;

      toast.success('Test run deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting test run:', error);
      toast.error('Failed to delete test run');
    }
  };

  const handleEdit = (run: any) => {
    setEditingRun(run);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Test Runs</h2>
            <button
              onClick={() => {
                setEditingRun(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Test Run
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GitHub Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  JIRA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {testRuns.map((run) => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {run.test_types.name}
                    </div>
                    {run.test_types.description && (
                      <div className="text-sm text-gray-500">
                        {run.test_types.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{run.environments.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(run.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>Started: {format(new Date(run.started_at!), 'MMM d, HH:mm')}</div>
                    {run.completed_at && (
                      <div className="text-gray-500">
                        Completed: {format(new Date(run.completed_at), 'MMM d, HH:mm')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {run.github_branch_frontend && (
                      <div>FE: {run.github_branch_frontend}</div>
                    )}
                    {run.github_branch_backend && (
                      <div>BE: {run.github_branch_backend}</div>
                    )}
                    {!run.github_branch_frontend && !run.github_branch_backend && (
                      <span className="text-gray-400">No branches</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {run.jira_ticket && (
                      <div>
                        <a 
                          href={run.jira_ticket} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Initial
                        </a>
                      </div>
                    )}
                    {run.completion_jira_ticket && (
                      <div>
                        <a 
                          href={run.completion_jira_ticket} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Completion
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {run.status === 'started' && (
                        <button
                          onClick={() => handleStatusUpdate(run.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Complete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {run.status === 'started' && (
                        <button
                          onClick={() => handleStatusUpdate(run.id, 'failed')}
                          className="text-red-600 hover:text-red-900"
                          title="Mark as Failed"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(run)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(run.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {testRuns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No test runs found.</p>
          </div>
        )}
      </div>

      {showModal && (
        <TestRunModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingRun(null);
          }}
          editingRun={editingRun}
          onSuccess={() => {
            refetch();
            setShowModal(false);
            setEditingRun(null);
          }}
        />
      )}
    </div>
  );
}