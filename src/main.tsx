import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PGListingPage from './pages/PGListingPage';
import RoommateMatchingPage from './pages/RoommateMatchingPage';
import MessDiscoveryPage from './pages/MessDiscoveryPage';
import BrowseRoommatesPage from './pages/BrowseRoommatesPage';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pg-listing" element={<PGListingPage />} />
        <Route path="/roommate-matching" element={<RoommateMatchingPage />} />
        <Route path="/mess-discovery" element={<MessDiscoveryPage />} />
        <Route path="/browse-roommates" element={<BrowseRoommatesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
