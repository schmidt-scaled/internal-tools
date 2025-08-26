import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Environments } from './pages/Environments'
import { TestRuns } from './pages/TestRuns'
import { Settings } from './pages/Settings'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/environments" replace />} />
          <Route path="/environments" element={<Environments />} />
          <Route path="/test-runs" element={<TestRuns />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App