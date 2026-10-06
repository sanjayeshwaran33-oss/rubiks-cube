import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { playTaDum } from './services/sound';

export default function App() {
  const DEFAULT_USER = {
    id: 'vip_all_access',
    username: 'VIP All-Access Delegate',
    email: 'delegate@orkestrim.ac.in',
    role: 'all_access',
    badge: 'UNRESTRICTED ACCESS UNLOCKED'
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('orkestrim_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [myList, setMyList] = useState(() => {
    try {
      const saved = localStorage.getItem('orkestrim_mylist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Sync My List to localStorage
  useEffect(() => {
    localStorage.setItem('orkestrim_mylist', JSON.stringify(myList));
  }, [myList]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('orkestrim_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('orkestrim_user');
  };

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: '#fff' }}>
      {user ? (
        <>
          <Navbar
            user={user}
            onLogout={handleLogout}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            myListCount={myList.length}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSwitchProfile={() => setShowProfileSelector(true)}
            isEditMode={isEditMode}
            onToggleEditMode={() => setIsEditMode(prev => !prev)}
          />

          <Dashboard
            user={user}
            onLogout={handleLogout}
            myList={myList}
            setMyList={setMyList}
            searchTerm={searchTerm}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showProfileSelector={showProfileSelector}
            setShowProfileSelector={setShowProfileSelector}
            isRegisterModalOpen={isRegisterModalOpen}
            setIsRegisterModalOpen={setIsRegisterModalOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
