import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { MiningLabPage } from './pages/MiningLabPage';
import { CopilotPage } from './pages/CopilotPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { GoalsDecisionsPage } from './pages/GoalsDecisionsPage';
import { IngestPage } from './pages/IngestPage';
import { PeerBenchmarkPage } from './pages/PeerBenchmarkPage';
import { PrivacyVaultPage } from './pages/PrivacyVaultPage';
import { AdminPage } from './pages/AdminPage';
import { LandingPage } from './pages/LandingPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/LoginPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors duration-200">
        <Navbar />

        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />

          <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/mining" element={<MiningLabPage />} />
              <Route path="/copilot" element={<CopilotPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/goals" element={<GoalsDecisionsPage />} />
              <Route path="/ingest" element={<IngestPage />} />
              <Route path="/benchmarks" element={<PeerBenchmarkPage />} />
              <Route path="/privacy" element={<PrivacyVaultPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};
