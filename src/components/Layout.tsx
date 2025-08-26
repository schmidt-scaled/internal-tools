import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, TestTube, Settings } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Test Manager</h1>
            <p className="text-sm text-gray-600 mt-1">Environment & Test Runs</p>
          </div>
          
          <nav className="mt-6">
            <Link
              to="/environments"
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/environments')
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Environments
            </Link>
            
            <Link
              to="/test-runs"
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/test-runs')
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TestTube className="w-5 h-5 mr-3" />
              Test Runs
            </Link>
            
            <Link
              to="/settings"
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive('/settings')
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}