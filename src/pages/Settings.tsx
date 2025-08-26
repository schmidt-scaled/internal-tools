import React, { useState } from 'react'
import { Settings as SettingsIcon, Database, Users, TestTube, AlertTriangle } from 'lucide-react'
import { ManageEnvironments } from '../components/ManageEnvironments'
import { ManageUsers } from '../components/ManageUsers'
import { ManageTestTypes } from '../components/ManageTestTypes'
import { ManageFailureReasons } from '../components/ManageFailureReasons'

export function Settings() {
  const [activeTab, setActiveTab] = useState<'environments' | 'users' | 'test-types' | 'failure-reasons'>('environments')

  const tabs = [
    { id: 'environments' as const, label: 'Environments', icon: Database },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'test-types' as const, label: 'Test Types', icon: TestTube },
    { id: 'failure-reasons' as const, label: 'Failure Reasons', icon: AlertTriangle },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center">
          <SettingsIcon className="w-8 h-8 text-gray-700 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600 mt-1">Manage environments, users, and test types</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <div className="min-h-[400px]">
            {activeTab === 'environments' && (
              <div key="environments">
                <ManageEnvironments />
              </div>
            )}
            {activeTab === 'users' && (
              <div key="users">
                <ManageUsers />
              </div>
            )}
            {activeTab === 'test-types' && (
              <div key="test-types">
                <ManageTestTypes />
              </div>
            )}
            {activeTab === 'failure-reasons' && (
              <div key="failure-reasons">
                <ManageFailureReasons />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}