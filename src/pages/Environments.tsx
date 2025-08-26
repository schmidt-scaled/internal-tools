import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar'
import moment from 'moment'
import { Plus, List, CalendarIcon, Edit, Trash2, Filter } from 'lucide-react'
import { supabase, Database } from '../lib/supabase'
import { ReservationForm } from '../components/ReservationForm'
import { ReservationList } from '../components/ReservationList'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment)

type Reservation = Database['public']['Tables']['environment_reservations']['Row'] & {
  environments: { name: string } | null
  users: { name: string } | null
}

export function Environments() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([])
  const [environments, setEnvironments] = useState<any[]>([])
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [showForm, setShowForm] = useState(false)
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null)
  const [environmentFilter, setEnvironmentFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReservations()
    fetchEnvironments()
  }, [])

  useEffect(() => {
    filterReservations()
  }, [reservations, environmentFilter])

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from('environment_reservations')
        .select(`
          *,
          environments (name),
          users (name)
        `)
        .order('start_date', { ascending: true })

      if (error) throw error
      setReservations(data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

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
    }
  }

  const filterReservations = () => {
    let filtered = reservations

    if (environmentFilter !== 'all') {
      filtered = filtered.filter(reservation => 
        reservation.environment_id === environmentFilter
      )
    }

    setFilteredReservations(filtered)
  }

  const handleReservationSave = () => {
    fetchReservations()
    setShowForm(false)
    setEditingReservation(null)
  }

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return

    try {
      const { error } = await supabase
        .from('environment_reservations')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchReservations()
    } catch (error) {
      console.error('Error deleting reservation:', error)
    }
  }

  const calendarEvents = filteredReservations.map(reservation => ({
    id: reservation.id,
    title: `${reservation.environment_name} - ${reservation.users?.name || 'Unknown'}`,
    start: new Date(reservation.start_date),
    end: new Date(reservation.end_date),
    resource: reservation,
    allDay: true
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-gray-100 text-gray-800'
      case 'deployed': return 'bg-blue-100 text-blue-800'
      case 'running': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Environment Reservations</h1>
          <p className="text-gray-600 mt-1">Manage environment reservations and deployments</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={environmentFilter}
              onChange={(e) => setEnvironmentFilter(e.target.value)}
              className="border-0 focus:ring-0 focus:outline-none text-sm"
            >
              <option value="all">All Environments</option>
              {environments.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex bg-white border border-gray-300 rounded-lg">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarIcon className="w-4 h-4 mr-2 inline" />
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <List className="w-4 h-4 mr-2 inline" />
              List
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="bg-white rounded-lg shadow p-6" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            defaultView={Views.MONTH}
            eventPropGetter={(event) => ({
              className: `${getStatusColor(event.resource.status)} border-0 rounded px-2 py-1`,
            })}
            onSelectEvent={(event) => handleEdit(event.resource)}
            components={{
              event: ({ event }) => (
                <div className="text-xs">
                  <div className="font-semibold">{event.resource.environment_name}</div>
                  <div>{event.resource.users?.name}</div>
                  <div className="capitalize">{event.resource.status}</div>
                </div>
              ),
            }}
          />
        </div>
      ) : (
        <ReservationList
          reservations={filteredReservations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ReservationForm
          reservation={editingReservation}
          onSave={handleReservationSave}
          onCancel={() => {
            setShowForm(false)
            setEditingReservation(null)
          }}
        />
      )}
    </div>
  )
}