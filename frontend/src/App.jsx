// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';
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
import Notifications from './Notifications/Notifications';
import Users from './User Management/Users';
import ChatWidget from './Chatbot/ChatWidget';

function App() {
  const [chatMessage, setChatMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState(() => {
    return localStorage.getItem("activeLink") || "Dashboard";
  });

    const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const routeMap = {
      '/': 'Dashboard',
      '/inventory': 'Inventory',
      '/users': 'Users',
      '/borrowing': 'Borrowing',
      '/events': 'Events',
      '/notifications': 'Notifications',

    };
    setActiveLink(routeMap[path] || 'Dashboard');

    localStorage.setItem("activeLink", activeLink);
  }, [location]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link);
  };

  const handleAskButton = (message) => {
    setChatMessage(message); 
  };
  const { isAuthenticated, isLoading, role } = useAuth();
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {isAuthenticated  && role === 'admin' ? (
        <div className="layout">
          <Sidebar
            sidebarOpen={sidebarOpen}
            activeLink={activeLink}
            handleLinkClick={handleLinkClick}
          />
          <div className="main-content">
            <TopNavbar toggleSidebar={toggleSidebar} />
            <div className="content-scroll p-3">
              <ChatWidget askMessage={chatMessage}/>
              <Routes>
                <>
                <Route path="/" element={<Dashboard handleAskButton={handleAskButton}/>} />
                <Route path='/users' element={<Users handleAskButton={handleAskButton}/>}/>
                <Route path="/inventory" element={<Inventory handleAskButton={handleAskButton} />} />
                <Route path="/borrowing" element={<BorrowingScreen handleAskButton={handleAskButton} />} />
                <Route path="/events" element={<EventManager handleAskButton={handleAskButton} />} />
                <Route path="/notifications" element={<Notifications  handleAskButton={handleAskButton}/>}/>
                <Route path="*" element={<Navigate to="/" />} />
                </>
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
      </>
  );
}

export default App;
