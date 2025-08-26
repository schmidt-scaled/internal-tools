import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ReservationCalendar } from './components/ReservationCalendar';
import { ReservationsList } from './components/ReservationsList';
import { TestRuns } from './components/TestRuns';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';

function App() {
  console.log('App component rendering');
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<ReservationCalendar />} />
            <Route path="/reservations" element={<ReservationsList />} />
            <Route path="/test-runs" element={<TestRuns />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
