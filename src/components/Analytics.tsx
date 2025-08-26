import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useReservations, useTestRuns } from '../hooks/useSupabaseData';
import { format, subDays, isAfter } from 'date-fns';

export function Analytics() {
  const { reservations, loading: reservationsLoading } = useReservations();
  const { testRuns, loading: testRunsLoading } = useTestRuns();

  if (reservationsLoading || testRunsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const last30Days = subDays(new Date(), 30);
  const recentReservations = reservations.filter(r => 
    isAfter(new Date(r.created_at!), last30Days)
  );
  const recentTestRuns = testRuns.filter(r => 
    isAfter(new Date(r.started_at!), last30Days)
  );

  const completedTestRuns = testRuns.filter(r => r.status === 'completed').length;
  const failedTestRuns = testRuns.filter(r => r.status === 'failed').length;
  const successRate = testRuns.length > 0 ? (completedTestRuns / testRuns.length * 100).toFixed(1) : '0';

  const reservationsByStatus = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const testRunsByEnvironment = testRuns.reduce((acc, r) => {
    const envName = r.environments.name;
    acc[envName] = (acc[envName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Analytics Dashboard</h2>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Total Reservations</p>
                <p className="text-2xl font-bold text-blue-900">{reservations.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Test Runs</p>
                <p className="text-2xl font-bold text-green-900">{testRuns.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Success Rate</p>
                <p className="text-2xl font-bold text-purple-900">{successRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Recent Activity</p>
                <p className="text-2xl font-bold text-orange-900">{recentReservations.length + recentTestRuns.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reservations by Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Reservations by Status</h3>
            <div className="space-y-3">
              {Object.entries(reservationsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${(count / reservations.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Runs by Environment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-4">Test Runs by Environment</h3>
            <div className="space-y-3">
              {Object.entries(testRunsByEnvironment).map(([env, count]) => (
                <div key={env} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{env}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(count / testRuns.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-md font-medium text-gray-900 mb-4">Recent Activity (Last 30 Days)</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Reservations</h4>
                <p className="text-2xl font-bold text-indigo-600">{recentReservations.length}</p>
                <p className="text-sm text-gray-500">New reservations created</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Test Runs</h4>
                <p className="text-2xl font-bold text-green-600">{recentTestRuns.length}</p>
                <p className="text-sm text-gray-500">Test runs started</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}