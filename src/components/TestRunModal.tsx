import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEnvironments, useTestTypes } from '../hooks/useSupabaseData';
import toast from 'react-hot-toast';

const testRunSchema = z.object({
  test_type_id: z.string().min(1, 'Test type is required'),
  environment_id: z.string().min(1, 'Environment is required'),
  jira_ticket: z.string().optional(),
  completion_comment: z.string().optional(),
  completion_jira_ticket: z.string().optional(),
  github_branch_frontend: z.string().optional(),
  github_branch_backend: z.string().optional(),
  github_commit_tag_frontend: z.string().optional(),
  github_commit_tag_backend: z.string().optional(),
});

type TestRunForm = z.infer<typeof testRunSchema>;

interface TestRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRun?: any;
  onSuccess: () => void;
}

export function TestRunModal({ isOpen, onClose, editingRun, onSuccess }: TestRunModalProps) {
  const { environments } = useEnvironments();
  const { testTypes } = useTestTypes();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TestRunForm>({
    resolver: zodResolver(testRunSchema),
  });

  useEffect(() => {
    if (editingRun) {
      reset({
        test_type_id: editingRun.test_type_id,
        environment_id: editingRun.environment_id,
        jira_ticket: editingRun.jira_ticket || '',
        completion_comment: editingRun.completion_comment || '',
        completion_jira_ticket: editingRun.completion_jira_ticket || '',
        github_branch_frontend: editingRun.github_branch_frontend || '',
        github_branch_backend: editingRun.github_branch_backend || '',
        github_commit_tag_frontend: editingRun.github_commit_tag_frontend || '',
        github_commit_tag_backend: editingRun.github_commit_tag_backend || '',
      });
    } else {
      reset({
        test_type_id: '',
        environment_id: '',
        jira_ticket: '',
        completion_comment: '',
        completion_jira_ticket: '',
        github_branch_frontend: '',
        github_branch_backend: '',
        github_commit_tag_frontend: '',
        github_commit_tag_backend: '',
      });
    }
  }, [editingRun, reset]);

  const onSubmit = async (data: TestRunForm) => {
    try {
      if (editingRun) {
        const { error } = await supabase
          .from('test_runs')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRun.id);

        if (error) throw error;
        toast.success('Test run updated successfully');
      } else {
        const { error } = await supabase
          .from('test_runs')
          .insert({
            ...data,
            status: 'started',
            started_at: new Date().toISOString(),
          });

        if (error) throw error;
        toast.success('Test run created successfully');
      }

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error saving test run:', error);
      toast.error('Failed to save test run');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingRun ? 'Edit Test Run' : 'New Test Run'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Type
              </label>
              <select
                {...register('test_type_id')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select test type</option>
                {testTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              {errors.test_type_id && (
                <p className="text-red-500 text-sm mt-1">{errors.test_type_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Environment
              </label>
              <select
                {...register('environment_id')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select environment</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
              {errors.environment_id && (
                <p className="text-red-500 text-sm mt-1">{errors.environment_id.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initial JIRA Ticket
            </label>
            <input
              type="url"
              {...register('jira_ticket')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://your-jira.atlassian.net/browse/TICKET-123"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frontend Branch
              </label>
              <input
                type="text"
                {...register('github_branch_frontend')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="feature/new-feature"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backend Branch
              </label>
              <input
                type="text"
                {...register('github_branch_backend')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="feature/new-feature"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frontend Commit Tag
              </label>
              <input
                type="text"
                {...register('github_commit_tag_frontend')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="abc123def"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Backend Commit Tag
              </label>
              <input
                type="text"
                {...register('github_commit_tag_backend')}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="abc123def"
              />
            </div>
          </div>

          {editingRun && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completion Comment
                </label>
                <textarea
                  {...register('completion_comment')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add any completion notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completion JIRA Ticket
                </label>
                <input
                  type="url"
                  {...register('completion_jira_ticket')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://your-jira.atlassian.net/browse/TICKET-456"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingRun ? 'Update Test Run' : 'Create Test Run'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}