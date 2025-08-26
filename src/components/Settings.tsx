import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, Server, TestTube, X } from 'lucide-react';
import { useUsers, useEnvironments, useTestTypes } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'users' | 'environments' | 'test-types'>('users');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', description: '' });

  const { users, loading: usersLoading, refetch: refetchUsers } = useUsers();
  const { environments, loading: environmentsLoading, refetch: refetchEnvironments } = useEnvironments();
  const { testTypes, loading: testTypesLoading, refetch: refetchTestTypes } = useTestTypes();

  const tabs = [
    { id: 'users', name: 'Users', icon: Users },
    { id: 'environments', name: 'Environments', icon: Server },
    { id: 'test-types', name: 'Test Types', icon: TestTube },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (activeTab === 'users') {
        if (editingItem) {
          const { error } = await supabase
            .from('users')
            .update({ 
              name: formData.name, 
              email: formData.email || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingItem.id);
          if (error) throw error;
          toast.success('User updated successfully');
        } else {
          const { error } = await supabase
            .from('users')
            .insert({ 
              name: formData.name, 
              email: formData.email || null 
            });
          if (error) throw error;
          toast.success('User created successfully');
        }
        refetchUsers();
      } else if (activeTab === 'environments') {
        if (editingItem) {
          const { error } = await supabase
            .from('environments')
            .update({ 
              name: formData.name, 
              description: formData.description || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingItem.id);
          if (error) throw error;
          toast.success('Environment updated successfully');
        } else {
          const { error } = await supabase
            .from('environments')
            .insert({ 
              name: formData.name, 
              description: formData.description || null 
            });
          if (error) throw error;
          toast.success('Environment created successfully');
        }
        refetchEnvironments();
      } else if (activeTab === 'test-types') {
        if (editingItem) {
          const { error } = await supabase
            .from('test_types')
            .update({ 
              name: formData.name, 
              description: formData.description || null,
              updated_at: new Date().toISOString()
            })
            .eq('id', editingItem.id);
          if (error) throw error;
          toast.success('Test type updated successfully');
        } else {
          const { error } = await supabase
            .from('test_types')
            .insert({ 
              name: formData.name, 
              description: formData.description || null 
            });
          if (error) throw error;
          toast.success('Test type created successfully');
        }
        refetchTestTypes();
      }

      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', email: '', description: '' });
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      email: item.email || '',
      description: item.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string, table: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Item deleted successfully');
      
      if (table === 'users') refetchUsers();
      else if (table === 'environments') refetchEnvironments();
      else if (table === 'test_types') refetchTestTypes();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const openModal = () => {
    setEditingItem(null);
    setFormData({ name: '', email: '', description: '' });
    setShowModal(true);
  };

  const renderTable = () => {
    let data: any[] = [];
    let loading = false;
    let tableName = '';

    switch (activeTab) {
      case 'users':
        data = users;
        loading = usersLoading;
        tableName = 'users';
        break;
      case 'environments':
        data = environments;
        loading = environmentsLoading;
        tableName = 'environments';
        break;
      case 'test-types':
        data = testTypes;
        loading = testTypesLoading;
        tableName = 'test_types';
        break;
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              {activeTab === 'users' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              )}
              {(activeTab === 'environments' || activeTab === 'test-types') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                {activeTab === 'users' && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.email || 'No email'}</div>
                  </td>
                )}
                {(activeTab === 'environments' || activeTab === 'test-types') && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.description || 'No description'}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, tableName)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">
              Manage {tabs.find(t => t.id === activeTab)?.name}
            </h2>
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add {activeTab === 'test-types' ? 'Test Type' : activeTab.slice(0, -1)}
            </button>
          </div>

          {renderTable()}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit' : 'Add'} {activeTab === 'test-types' ? 'Test Type' : activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {activeTab === 'users' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {(activeTab === 'environments' || activeTab === 'test-types') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
