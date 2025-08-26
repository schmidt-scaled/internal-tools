import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Filter } from 'lucide-react';
import { useReservations, useEnvironments } from '../hooks/useSupabaseData';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function ReservationsList() {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { reservations, loading, refetch } = useReservations();
  const { environments } = useEnvironments();

  const filteredReservations = reservations.filter(reservation => {
    const environmentMatch = selectedEnvironment === 'all' || reservation.environment_id === selectedEnvironment;
    const statusMatch = selectedStatus === 'all' || reservation.status === selectedStatus;
    return environmentMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-100 text-gray-800';
      case 'deployed': return 'bg-blue-100 text-blue-800';
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('environment_reservations')
        .update({ 
          status: newStatus as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', reservationId);

      if (error) throw error;

      toast.success('Status updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (reservationId: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    try {
      const { error } = await supabase
        .from('environment_reservations')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;

      toast.success('Reservation deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Failed to delete reservation');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Environment Reservations</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedEnvironment}
                onChange={(e) => setSelectedEnvironment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Environments</option>
                {environments.map(env => (
                  <option key={env.id} value={env.id}>{env.name}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="empty">Empty</option>
                <option value="deployed">Deployed</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Environment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.environments.name}
                  </div>
                  {reservation.environments.description && (
                    <div className="text-sm text-gray-500">
                      {reservation.environments.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.users.name}</div>
                  {reservation.users.email && (
                    <div className="text-sm text-gray-500">{reservation.users.email}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>{format(new Date(reservation.start_date), 'MMM d, yyyy')}</div>
                  <div className="text-gray-500">to {format(new Date(reservation.end_date), 'MMM d, yyyy')}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={reservation.status}
                    onChange={(e) => handleStatusUpdate(reservation.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(reservation.status)}`}
                  >
                    <option value="empty">Empty</option>
                    <option value="deployed">Deployed</option>
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {reservation.sbcli_branch && (
                    <div>SBCLI: {reservation.sbcli_branch}</div>
                  )}
                  {reservation.ultra_branch && (
                    <div>Ultra: {reservation.ultra_branch}</div>
                  )}
                  {!reservation.sbcli_branch && !reservation.ultra_branch && (
                    <span className="text-gray-400">No branches</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(reservation.id)}
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
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No reservations found matching your filters.</p>
        </div>
      )}
    </div>
  );
}