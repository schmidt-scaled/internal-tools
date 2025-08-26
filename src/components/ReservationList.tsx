import React from 'react'
import { format } from 'date-fns'
import { Edit, Trash2, GitBranch } from 'lucide-react'
import { Database } from '../lib/supabase'

type Reservation = Database['public']['Tables']['environment_reservations']['Row'] & {
  environments: { name: string } | null
  users: { name: string } | null
}

interface ReservationListProps {
  reservations: Reservation[]
  onEdit: (reservation: Reservation) => void
  onDelete: (id: string) => void
}

export function ReservationList({ reservations, onEdit, onDelete }: ReservationListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-100 text-gray-800'
      case 'deployed': return 'bg-blue-100 text-blue-800'
      case 'running': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">All Reservations</h3>
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
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branches
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.environment_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.environments?.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.users?.name || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(reservation.start_date), 'MMM d')} - {format(new Date(reservation.end_date), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-xs space-y-1">
                    {reservation.sbcli_branch && (
                      <div className="flex items-center text-gray-600">
                        <GitBranch className="w-3 h-3 mr-1" />
                        SBCLI: {reservation.sbcli_branch}
                        {reservation.sbcli_commit && (
                          <span className="ml-1 text-gray-400">({reservation.sbcli_commit.slice(0, 7)})</span>
                        )}
                      </div>
                    )}
                    {reservation.ultra_branch && (
                      <div className="flex items-center text-gray-600">
                        <GitBranch className="w-3 h-3 mr-1" />
                        Ultra: {reservation.ultra_branch}
                        {reservation.ultra_commit && (
                          <span className="ml-1 text-gray-400">({reservation.ultra_commit.slice(0, 7)})</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(reservation)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reservation.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
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
    </div>
  )
}