// App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Sidebar from './Navigations/Sidebar';
import TopNavbar from './Navigations/TopNavbar';
import BorrowingScreen from './Borrowing/BorrowingScreens';
import EventManager from './Events/EventManager';
import LoginScreen from './LoginScreen';
import { useAuth } from '../AuthContext';
import Inventory from './Inventory/Inventory';
import Dashboard from './Dashboard/Dashboard';
import RequestPage from './RequestPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem("activeLink") || "Dashboard";
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };

  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      {isAuthenticated ? (
        <div className="layout">
          <Sidebar
            sidebarOpen={sidebarOpen}
            activeLink={activeLink}
            handleLinkClick={handleLinkClick}
          />
          <div className="main-content">
            <TopNavbar toggleSidebar={toggleSidebar} />
            <div className="content-scroll p-3">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/borrowing" element={<BorrowingScreen />} />
                <Route path="/events" element={<EventManager />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<RequestPage />} />
          <Route path="/login" element={<LoginScreen/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
