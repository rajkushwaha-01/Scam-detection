import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DetectPage from './components/DetectPage';
import HistoryPage from './components/HistoryPage';
import AuthModal from './components/AuthModal';
import { fetchCurrentUser, logoutUser } from './services/api';

const HISTORY_STORAGE_KEY = 'scamshield_detection_history';

export default function App() {
  const [activePage, setActivePage] = useState('landing'); // Defaults to 'landing' when opened without login
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialScenarioId, setInitialScenarioId] = useState(null);

  // Load local scan history
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Check auth session on startup: if logged in go to detect, otherwise stay on landing
  useEffect(() => {
    fetchCurrentUser().then((userData) => {
      if (userData) {
        setUser(userData);
        setActivePage('detect');
      } else {
        setActivePage('landing');
      }
    });
  }, []);

  // Save history to localStorage
  const handleSaveHistory = (scanEntry) => {
    setHistory((prev) => {
      const updated = [scanEntry, ...prev].slice(0, 50); // Keep last 50 scans
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not persist history to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (err) {
      console.warn('Could not clear history in localStorage', err);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setActivePage('landing');
  };

  const handleLoadScenarioFromLanding = (scenarioId) => {
    setInitialScenarioId(scenarioId);
    setActivePage('detect');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#191919] flex flex-col font-sans selection:bg-[#EBF3FC] selection:text-[#191919]">
      {/* STRICT REQUIREMENT: Single horizontal top navigation bar across all pages. NO SIDEBAR ANYWHERE. */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'detect') setInitialScenarioId(null);
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activePage === 'landing' && (
          <LandingPage
            onStartDetection={() => setActivePage('detect')}
            onLoadScenario={handleLoadScenarioFromLanding}
          />
        )}

        {activePage === 'detect' && (
          <DetectPage
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSaveHistory={handleSaveHistory}
            initialScenarioId={initialScenarioId}
          />
        )}

        {activePage === 'history' && (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onGoToDetect={() => setActivePage('detect')}
          />
        )}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(authedUser) => {
          setUser(authedUser);
          setActivePage('detect');
        }}
      />
    </div>
  );
}

