import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  LogOut, 
  PlusCircle, 
  Bookmark, 
  Check, 
  Sparkles,
  Menu,
  X,
  Edit3
} from 'lucide-react';
import { playClickSound, playTaDum, toggleSound, isSoundEnabled } from '../services/sound';

export default function Navbar({ 
  user, 
  onLogout, 
  onOpenRegisterModal, 
  onOpenAddModal, 
  myListCount = 0,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  onSwitchProfile,
  isEditMode = false,
  onToggleEditMode
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    playClickSound();
    const state = toggleSound();
    setSoundActive(state);
    if (state) {
      playTaDum();
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'top5', label: 'Top 5' },
    { id: 'arenas', label: 'Arenas' },
    { id: 'episodes', label: 'Episodes (Schedule)' },
    { id: 'mylist', label: `My List ${myListCount > 0 ? `(${myListCount})` : ''}` },
    { id: 'map', label: 'Campus Map' },
    { id: 'venue', label: 'Food & Transit' },
    { id: 'cast', label: 'Cast & Crew' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/5' 
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-5'
      }`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? 'rgba(18, 18, 18, 0.95)' : 'transparent',
        backgroundImage: isScrolled ? 'none' : 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        padding: isScrolled ? '0.75rem 2.5rem' : '1.25rem 2.5rem',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Left Side: Brand Logo & Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          
          {/* Netflix Style Brand Logo */}
          <div 
            onClick={() => { playTaDum(); setActiveTab('home'); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              background: '#E50914',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.4rem',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Montserrat', sans-serif",
              boxShadow: '0 0 15px rgba(229, 9, 20, 0.6)'
            }}>
              N
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ 
                fontFamily: "'Bebas Neue', sans-serif", 
                fontSize: '2.2rem', 
                color: '#E50914', 
                letterSpacing: '2px',
                lineHeight: 0.9,
                textShadow: '0 0 10px rgba(229, 9, 20, 0.4)'
              }}>
                ORKESTRIM
              </span>
              <span style={{ 
                fontSize: '0.62rem', 
                letterSpacing: '3px', 
                color: '#aaa', 
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                2K26 • SRM VEC
              </span>
            </div>
          </div>

          {/* Navigation Links for Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.4rem' }} className="hidden md:flex">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  playClickSound();
                  setActiveTab(link.id);
                  const el = document.getElementById(link.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: activeTab === link.id ? '#ffffff' : '#b3b3b3',
                  fontWeight: activeTab === link.id ? '700' : '500',
                  fontSize: '0.92rem',
                  letterSpacing: '0.3px',
                  transition: 'color 0.2s ease',
                  position: 'relative',
                  padding: '4px 0'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => {
                  if (activeTab !== link.id) e.target.style.color = '#b3b3b3';
                }}
              >
                {link.label}
                {activeTab === link.id && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: '#E50914',
                    borderRadius: '2px'
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Tools, Search, Sound, Notifications, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          
          {/* Interactive Search Bar */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: searchOpen ? 'rgba(0,0,0,0.8)' : 'transparent',
            border: searchOpen ? '1px solid #fff' : '1px solid transparent',
            borderRadius: '4px',
            padding: searchOpen ? '4px 8px' : '4px',
            transition: 'all 0.3s ease'
          }}>
            <button
              onClick={() => {
                playClickSound();
                setSearchOpen(!searchOpen);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Search arenas, schedules & topics"
            >
              <Search size={20} />
            </button>
            {searchOpen && (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Titles, people, genres..."
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.85rem',
                  marginLeft: '8px',
                  width: '180px'
                }}
              />
            )}
          </div>

          {/* Sound FX Toggle (Netflix Ta-dum audio) */}
          <button
            onClick={handleSoundToggle}
            style={{
              background: 'none',
              border: 'none',
              color: soundActive ? '#fff' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}
            title={soundActive ? "Mute Netflix SFX" : "Enable Netflix SFX (Ta-Dum)"}
          >
            {soundActive ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                playClickSound();
                setNotificationsOpen(!notificationsOpen);
                setProfileDropdownOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Notifications"
            >
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#E50914',
                boxShadow: '0 0 8px #E50914'
              }} />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '35px',
                width: '320px',
                backgroundColor: '#181818',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.9)',
                padding: '1rem',
                zIndex: 60
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.8rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.4rem' }}>
                  Symposium Announcements
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.82rem', color: '#ddd', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ color: '#E50914', fontWeight: 600, fontSize: '0.75rem' }}>EPISODE 01 PREMIERE</div>
                    <div>Paper Spark abstract screening submission deadline extended to 20 Oct 2026!</div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#ddd', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ color: '#46d369', fontWeight: 600, fontSize: '0.75rem' }}>CRAFT SERVICES</div>
                    <div>Complimentary continental breakfast & lunch buffet for all registered delegates.</div>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#ddd', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '4px' }}>
                    <div style={{ color: '#e50914', fontWeight: 600, fontSize: '0.75rem' }}>GRAND FINALE</div>
                    <div>Total prize pool of ₹55,000 across 5 arenas up for grabs.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Pitch / Submit Arena Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenAddModal();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Submit a custom challenge or pitch paper"
          >
            <PlusCircle size={15} color="#E50914" />
            <span className="hidden sm:inline">Pitch Arena</span>
          </button>

          {/* Live Edit Mode Button */}
          {onToggleEditMode && (
            <button
              onClick={() => {
                playClickSound();
                onToggleEditMode();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: isEditMode ? '#E50914' : 'rgba(229, 9, 20, 0.15)',
                border: isEditMode ? '1px solid #ff3333' : '1px solid rgba(229, 9, 20, 0.4)',
                borderRadius: '4px',
                padding: '6px 12px',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isEditMode ? '0 0 12px rgba(229, 9, 20, 0.6)' : 'none'
              }}
              title="Toggle Live Editor Mode to edit cards, rules, timings, and prizes directly on the website"
            >
              <Edit3 size={15} color="#fff" />
              <span>{isEditMode ? 'Exit Edit' : 'Live Edit'}</span>
            </button>
          )}

          {/* User Profile Avatar & Menu */}
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => {
                playClickSound();
                setProfileDropdownOpen(!profileDropdownOpen);
                setNotificationsOpen(false);
              }}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#E50914',
                backgroundImage: 'linear-gradient(135deg, #E50914 0%, #831010 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                {user?.username ? user.username.charAt(0).toUpperCase() : 'C'}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e5e5e5' }} className="hidden lg:inline">
                {user?.username || 'The Coder'}
              </span>
            </div>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '42px',
                width: '210px',
                backgroundColor: 'rgba(18, 18, 18, 0.98)',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '4px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
                padding: '0.6rem 0',
                zIndex: 60
              }}>
                <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid #333' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {user?.username || 'The Coder'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>
                    {user?.email || 'delegate@orkestrim.ac.in'}
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '0.68rem', color: '#46d369', fontWeight: 600 }}>
                    VIP DELEGATE PASS ACTIVE
                  </div>
                </div>

                <button
                  onClick={() => {
                    playTaDum();
                    setProfileDropdownOpen(false);
                    onSwitchProfile();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ddd',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Sparkles size={16} color="#E50914" />
                  Switch Who's Watching
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setProfileDropdownOpen(false);
                    setActiveTab('mylist');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ddd',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Bookmark size={16} />
                  My List ({myListCount})
                </button>

                <button
                  onClick={() => {
                    playClickSound();
                    setProfileDropdownOpen(false);
                    onOpenRegisterModal();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ddd',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <Check size={16} color="#46d369" />
                  Registration Desk
                </button>

                <div style={{ height: '1px', backgroundColor: '#333', margin: '4px 0' }} />

                <button
                  onClick={() => {
                    playClickSound();
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    background: 'none',
                    border: 'none',
                    color: '#ff4d4f',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} />
                  Sign Out of Orkestrim
                </button>
              </div>
            )}
          </div>

          {/* Primary CTA: Register Now */}
          <button
            onClick={() => {
              playTaDum();
              onOpenRegisterModal();
            }}
            className="btn-red"
            style={{
              padding: '0.45rem 1.1rem',
              fontSize: '0.85rem'
            }}
          >
            Register Now
          </button>

        </div>
      </div>
    </nav>
  );
}
