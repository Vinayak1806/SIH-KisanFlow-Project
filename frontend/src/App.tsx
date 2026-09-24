import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { TopNav } from './components/TopNav';
import { BottomNav } from './components/BottomNav';
import { DemoFlowBar } from './components/DemoFlowBar';

import { WelcomeLanding } from './pages/WelcomeLanding';
import { FarmerRegistration } from './pages/FarmerRegistration';
import { FarmerHome } from './pages/FarmerHome';
import { FindCenter } from './pages/FindCenter';
import { SmartRecommendation } from './pages/SmartRecommendation';
import { TokenBooking } from './pages/TokenBooking';
import { DigitalToken } from './pages/DigitalToken';
import { LiveQueue } from './pages/LiveQueue';
import { ProcurementTracking } from './pages/ProcurementTracking';
import { WeighingScreen } from './pages/WeighingScreen';
import { ProcurementComplete } from './pages/ProcurementComplete';
import { PaymentTracking } from './pages/PaymentTracking';
import { NotificationsScreen } from './pages/NotificationsScreen';
import { HistoryScreen } from './pages/HistoryScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-[#FAF7F0] flex flex-col font-sans w-full max-w-full overflow-x-hidden">
            
            {/* Top Navigation */}
            <TopNav />

            {/* Evaluator Flow Assistance Bar */}
            <DemoFlowBar />

            {/* Main Application Body with top padding for fixed bars */}
            <main className="flex-1 pt-7 w-full max-w-full overflow-x-hidden">
              <Routes>
                {/* 16 Farmer Screens */}
                <Route path="/" element={<WelcomeLanding />} />
                <Route path="/languages" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<FarmerRegistration />} />
                <Route path="/dashboard" element={<FarmerHome />} />
                <Route path="/centers" element={<FindCenter />} />
                <Route path="/recommendation" element={<SmartRecommendation />} />
                <Route path="/book-slot" element={<TokenBooking />} />
                <Route path="/token" element={<DigitalToken />} />
                <Route path="/queue" element={<LiveQueue />} />
                <Route path="/tracking" element={<ProcurementTracking />} />
                <Route path="/weighing" element={<WeighingScreen />} />
                <Route path="/complete" element={<ProcurementComplete />} />
                <Route path="/payment-tracking" element={<PaymentTracking />} />
                <Route path="/notifications" element={<NotificationsScreen />} />
                <Route path="/history" element={<HistoryScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />

                {/* Operations & Government Command */}
                <Route path="/officer" element={<OfficerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />

                {/* Catch-all redirect to welcome landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Farmer Mobile Bottom Navigation */}
            <BottomNav />

          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
