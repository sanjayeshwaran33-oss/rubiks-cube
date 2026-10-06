import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Check, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Share2, 
  Volume2, 
  VolumeX, 
  Calendar,
  Phone,
  Mail,
  Coffee,
  Bus,
  Wifi,
  Sparkles,
  Search,
  Compass,
  Navigation,
  ExternalLink,
  Edit3
} from 'lucide-react';
import Card from '../components/Card';
import CarouselRow from '../components/CarouselRow';
import LiveEditorModal from '../components/LiveEditorModal';
import { 
  getItems, 
  createItem, 
  updateItem, 
  deleteItem, 
  resetItemsToDefault, 
  exportItemsJSON, 
  importItemsJSON 
} from '../services/api';
import { playClickSound, playTaDum, playHoverSound, isSoundEnabled, toggleSound } from '../services/sound';

export default function Dashboard({ 
  user, 
  onLogout, 
  myList, 
  setMyList,
  searchTerm,
  activeTab,
  setActiveTab,
  showProfileSelector,
  setShowProfileSelector,
  isRegisterModalOpen,
  setIsRegisterModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  isEditMode = false,
  setIsEditMode
}) {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingArena, setEditingArena] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('overview');
  const [soundActive, setSoundActive] = useState(isSoundEnabled());
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: user?.username || 'Alex Morgan',
    email: user?.email || 'alex@orkestrim.ac.in',
    college: 'SRM Valliammai Engineering College',
    arenaId: 'arena-01',
    teamSize: '3'
  });

  // New Custom Arena Form state
  const [newArenaForm, setNewArenaForm] = useState({
    title: '',
    category: 'Coding & Tech',
    tagline: '',
    description: '',
    venue: 'Seminar Hall 2',
    prizePool: '₹5,000'
  });

  // Live Countdown to 24 OCT 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 8,
    minutes: 25,
    seconds: 8
  });

  // Selected Venue Pin on Campus Map
  const [selectedMapVenue, setSelectedMapVenue] = useState('v1');
  const [mapCategoryFilter, setMapCategoryFilter] = useState('all');

  useEffect(() => {
    // Load arenas from API
    async function loadData() {
      const data = await getItems();
      setItems(data);
    }
    loadData();

    // Countdown ticker
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleMyList = (item) => {
    playClickSound();
    setMyList(prev => {
      const exists = prev.some(i => i._id === item._id);
      if (exists) {
        return prev.filter(i => i._id !== item._id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newArenaForm.title) return;
    playClickSound();
    const created = await createItem(newArenaForm);
    setItems(prev => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewArenaForm({
      title: '',
      category: 'Coding & Tech',
      tagline: '',
      description: '',
      venue: 'Seminar Hall 2',
      prizePool: '₹5,000'
    });
    playTaDum();
  };

  const handleOpenEditor = (arena) => {
    playClickSound();
    setEditingArena(arena);
    setIsEditorOpen(true);
  };

  const handleSaveArena = async (id, updatedData) => {
    try {
      const updated = await updateItem(id, updatedData);
      setItems(prev => prev.map(item => item._id === id ? { ...item, ...updated } : item));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(prev => ({ ...prev, ...updated }));
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDeleteArena = async (id) => {
    try {
      await deleteItem(id);
      setItems(prev => prev.filter(item => item._id !== id));
      if (selectedItem && selectedItem._id === id) {
        setSelectedItem(null);
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleResetDefaults = () => {
    playTaDum();
    const defaults = resetItemsToDefault();
    setItems(defaults);
    if (selectedItem) {
      const match = defaults.find(d => d._id === selectedItem._id);
      setSelectedItem(match || defaults[0]);
    }
    setIsEditorOpen(false);
  };

  const handleImportJSON = (jsonStr) => {
    try {
      playTaDum();
      const imported = importItemsJSON(jsonStr);
      setItems(imported);
      setIsEditorOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    playTaDum();
    setRegistrationSuccess(true);
    setTimeout(() => {
      setRegistrationSuccess(false);
      setIsRegisterModalOpen(false);
    }, 2500);
  };

  const categories = [
    'All',
    'Coding & Tech',
    'Research & Demo',
    'Quiz & Logic',
    'Ads & Treasure Hunt'
  ];

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const top5Items = items.slice(0, 5);

  const episodes = [
    {
      ep: 'EPISODE 01',
      time: '09:00 AM — 09:45 AM',
      title: 'Pilot: Grand Check-In & Opening Keynote',
      venue: 'Main Auditorium (Central Wing)',
      desc: 'Distribution of symposium delegate kits, RFID badge passes, continental breakfast buffet, and opening keynote by distinguished chief guests.',
      image: '/assets/hero-backdrop.jpg',
      duration: '45m'
    },
    {
      ep: 'EPISODE 02',
      time: '10:00 AM — 11:30 AM',
      title: 'Wednesday: Paper Spark — The Nevermore Manuscripts',
      venue: 'Seminar Hall 1',
      desc: 'Gothic academic research defense across AI, Neural Networks, IoT, and Next-Gen Computing before a discerning faculty panel.',
      image: '/assets/poster-wednesday.jpg',
      duration: '90m'
    },
    {
      ep: 'EPISODE 03',
      time: '11:30 AM — 12:45 PM',
      title: "Arcane: Brainiac's Battle — Piltover & Zaun Synapse Duel",
      venue: 'Main Auditorium Arena',
      desc: 'Hextech algorithmic pattern trivia, rapid-fire elimination prelims, and live stage electronic buzzer rounds.',
      image: '/assets/poster-arcane.jpg',
      duration: '75m'
    },
    {
      ep: 'EPISODE 04',
      time: '01:00 PM — 02:00 PM',
      title: 'Craft Services: Binge Lunch & Networking',
      venue: 'Central Lawns & Dining Hall',
      desc: 'Complimentary executive multi-course lunch buffet for all delegates. Networking lounges open for inter-college collaboration.',
      image: '/assets/hero-backdrop.jpg',
      duration: '60m'
    },
    {
      ep: 'EPISODE 05',
      time: '02:00 PM — 03:15 PM',
      title: 'Money Heist: Techno Connect — The Royal Mint Decryption',
      venue: 'Cyber Systems Lab 304',
      desc: "El Profesor's master plan: decrypting visual links, corrupted memory dumps, and reverse-engineering obfuscated terminal flags.",
      image: '/assets/poster-moneyheist.jpg',
      duration: '75m'
    },
    {
      ep: 'EPISODE 06',
      time: '02:15 PM — 03:30 PM',
      title: 'Black Mirror: Techno Ads — The 2049 Dystopian Infomercial',
      venue: 'Open-Air Amphitheater',
      desc: 'Pitching alarming futuristic consumer tech gadgets live on stage to a ruthless venture panel and live audience.',
      image: '/assets/poster-blackmirror.jpg',
      duration: '75m'
    },
    {
      ep: 'EPISODE 07',
      time: '03:30 PM — 05:00 PM',
      title: 'The Witcher: Techno Treasure — Kaer Morhen Relic Hunt',
      venue: 'Campus Wide • Briefing at Tech Plaza',
      desc: 'High-speed physical-digital geocaching, cracking cryptographic runic markers, and hunting lost grand relics across SRM VEC.',
      image: '/assets/poster-witcher.jpg',
      duration: '90m'
    },
    {
      ep: 'EPISODE 08',
      time: '05:00 PM — 06:00 PM',
      title: 'Season Finale: Cash Prize Awards Ceremony',
      venue: 'Main Auditorium',
      desc: 'Crowning the symposium champions, distribution of ₹55,000+ cash prizes, delegate shields, certificates, and closing DJ performance.',
      image: '/assets/hero-backdrop.jpg',
      duration: '60m'
    }
  ];

  const campusVenues = [
    {
      id: 'v1',
      name: 'Seminar Hall 1',
      building: 'Admin Block (Wing A)',
      floor: '2nd Floor, Room 204',
      theme: 'Wednesday // Paper Spark',
      show: 'Wednesday',
      color: '#a855f7',
      poster: '/assets/poster-wednesday.jpg',
      type: 'competition',
      walkingTime: '2 min walk from Main Entrance',
      desc: 'The Nevermore manuscripts research tribunal. Equipped with 4K digital projection, acoustic microphones, and dedicated delegate prep suite.',
      landmarks: 'Take the central elevator or staircase A from Admin Foyer. Turn right on 2nd floor.',
      capacity: '250 Delegates',
      arenaId: 'arena-01',
      coords: { x: 26, y: 32 }
    },
    {
      id: 'v2',
      name: 'Main Auditorium',
      building: 'Central Council Complex',
      floor: 'Ground Floor, Foyer Entrance',
      theme: "Arcane // Brainiac's Battle",
      show: 'Arcane',
      color: '#00f0ff',
      poster: '/assets/poster-arcane.jpg',
      type: 'competition',
      walkingTime: '3 min walk from Main Entrance',
      desc: 'The Grand Piltover Council auditorium. 1,200 air-conditioned seats, dual 30ft LED broadcast screens, and live electronic Hextech buzzer consoles.',
      landmarks: 'Directly across the central lawn fountain. Large glass double-door main entry.',
      capacity: '1,200 Delegates',
      arenaId: 'arena-02',
      coords: { x: 54, y: 28 }
    },
    {
      id: 'v3',
      name: 'Cyber Systems Lab 304',
      building: 'Information Technology Block',
      floor: '3rd Floor, Wing C',
      theme: 'Money Heist // Techno Connect',
      show: 'Money Heist',
      color: '#E50914',
      poster: '/assets/poster-moneyheist.jpg',
      type: 'competition',
      walkingTime: '4 min walk from Main Entrance',
      desc: 'The Royal Mint cyber command vault. 75 high-performance dual-screen Ubuntu workstations, isolated cryptographic sandbox subnet, and terminal consoles.',
      landmarks: 'Enter IT Block, take elevator to 3rd floor. Look for the red Dali mask checkpoint banner.',
      capacity: '150 Hackers',
      arenaId: 'arena-03',
      coords: { x: 78, y: 42 }
    },
    {
      id: 'v4',
      name: 'Open-Air Amphitheater',
      building: 'Tech Plaza Quadrangle',
      floor: 'Outdoor Stepped Arena',
      theme: 'Black Mirror // Techno Ads',
      show: 'Black Mirror',
      color: '#06b6d4',
      poster: '/assets/poster-blackmirror.jpg',
      type: 'competition',
      walkingTime: '2.5 min walk from Main Entrance',
      desc: 'The 2049 Dystopian Broadcast Stage. Stepped tiered seating, line-array audio rig, presentation dais, and live holographic infomercial screens.',
      landmarks: 'Located in the open quadrangle between Civil and Mechanical blocks.',
      capacity: '500 Spectators',
      arenaId: 'arena-04',
      coords: { x: 44, y: 64 }
    },
    {
      id: 'v5',
      name: 'Tech Plaza & Campus Grounds',
      building: 'Kaer Morhen Base Camp',
      floor: 'Outdoor Central Lawns',
      theme: 'The Witcher // Techno Treasure',
      show: 'The Witcher',
      color: '#eab308',
      poster: '/assets/poster-witcher.jpg',
      type: 'competition',
      walkingTime: '1 min walk from Main Entrance',
      desc: 'Briefing grounds for the campus-wide relic hunt. AR tracking coordinates checkpoint, RFID beacon maps, and live GPS leaderboard display.',
      landmarks: 'Under the giant white canopy tent on Tech Plaza lawn.',
      capacity: 'Campus Wide Perimeter',
      arenaId: 'arena-05',
      coords: { x: 30, y: 68 }
    },
    {
      id: 'v6',
      name: 'Central Dining Pavilion',
      building: 'Hospitality & Food Court',
      floor: 'Ground & 1st Floor',
      theme: 'Craft Services Buffet & Lounge',
      show: 'Craft Services',
      color: '#46d369',
      poster: '/assets/hero-backdrop.jpg',
      type: 'craft_services',
      walkingTime: '4 min walk from Main Entrance',
      desc: 'Executive buffet hall for continental breakfast, multi-course biryani/pulao lunch, and afternoon tea service with networking zones.',
      landmarks: 'Behind the Mechanical Engineering wing, adjacent to student hostel grounds.',
      capacity: '800 Diners per batch',
      coords: { x: 82, y: 74 }
    },
    {
      id: 'v7',
      name: 'Main Campus Gate & Bus Terminal',
      building: 'SRM Nagar Main Entrance',
      floor: 'Ground Perimeter',
      theme: 'Transit Fleets & Registration Reception',
      show: 'Campus Reception',
      color: '#f97316',
      poster: '/assets/hero-backdrop.jpg',
      type: 'transit',
      walkingTime: 'Starting Point',
      desc: 'Arrival point for all college special buses, registration reception desks, delegate kit issue, security turnstiles, and parking bays.',
      landmarks: 'Facing GST Road highway, SRM Nagar main arches.',
      capacity: 'All Delegates',
      coords: { x: 14, y: 88 }
    }
  ];

  return (
    <div style={{ backgroundColor: '#141414', minHeight: '100vh', color: '#fff' }}>
      
      {/* ---------------- WHO'S WATCHING PROFILE SELECTOR MODAL ---------------- */}
      {showProfileSelector && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#141414',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 500,
            marginBottom: '2.5rem',
            color: '#fff',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            Who's Watching?
          </h1>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { name: 'The Coder', role: 'Full-Stack Slayer', color: '#E50914' },
              { name: 'AI Visionary', role: 'Paper Spark Lead', color: '#0071eb' },
              { name: 'The Brainiac', role: 'Quiz Master', color: '#ffd700' },
              { name: 'Cyber Scout', role: 'Treasure Hunter', color: '#46d369' },
              { name: 'Guest Delegate', role: 'Visitor', color: '#888888' }
            ].map((prof, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playTaDum();
                  setShowProfileSelector(false);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '6px',
                  backgroundColor: prof.color,
                  backgroundImage: `linear-gradient(135deg, ${prof.color} 0%, rgba(0,0,0,0.6) 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  fontWeight: 900,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
                  border: '3px solid transparent',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ffffff'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {prof.name.charAt(0)}
                </div>
                <span style={{ fontSize: '1.1rem', color: '#999', fontWeight: 600 }}>
                  {prof.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#666', marginTop: '-0.4rem' }}>
                  {prof.role}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowProfileSelector(false);
            }}
            style={{
              marginTop: '3.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              color: '#888',
              fontSize: '1rem',
              letterSpacing: '2px',
              padding: '0.6rem 2rem',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fff';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#666';
              e.currentTarget.style.color = '#888';
            }}
          >
            Manage Profiles
          </button>
        </div>
      )}

      {/* ---------------- CINEMATIC HERO BILLBOARD ---------------- */}
      <section 
        id="home"
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '8.5rem 3.5rem 5rem 3.5rem',
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(20,20,20,0.2) 40%, rgba(20,20,20,0.85) 85%, #141414 100%), url('/assets/hero-backdrop.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div style={{ maxWidth: '820px', zIndex: 10 }}>
          
          {/* Symposium Original Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
            <span style={{
              background: '#E50914',
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.9rem',
              padding: '1px 6px',
              borderRadius: '2px',
              fontFamily: "'Montserrat', sans-serif"
            }}>
              N
            </span>
            <span style={{
              fontSize: '0.85rem',
              letterSpacing: '4px',
              fontWeight: 800,
              color: '#fff',
              textTransform: 'uppercase',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
            }}>
              S Y M P O S I U M // O R I G I N A L
            </span>
          </div>

          {/* Grand Title */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '5.5rem',
            lineHeight: 0.92,
            letterSpacing: '3px',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 40px rgba(229, 9, 20, 0.4)',
            marginBottom: '1.2rem'
          }}>
            ORKESTRIM 2K26
          </h1>

          {/* Metadata Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            <span style={{ color: '#46d369', fontWeight: 800, fontSize: '0.95rem' }}>
              99% Match
            </span>
            <span style={{ color: '#aaa', fontSize: '0.9rem', fontWeight: 600 }}>
              2026
            </span>
            <span style={{
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '2px 8px',
              borderRadius: '2px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#ddd'
            }}>
              U/A 16+
            </span>
            <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>
              5 Arenas
            </span>
            <span style={{
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '2px 6px',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              ULTRA HD 4K
            </span>
            <span style={{
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '2px 6px',
              borderRadius: '2px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              5.1 SOUND
            </span>
            <span style={{
              backgroundColor: '#E50914',
              color: '#fff',
              padding: '3px 10px',
              borderRadius: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              boxShadow: '0 2px 10px rgba(229,9,20,0.5)'
            }}>
              ★ #1 in College Events Today
            </span>
          </div>

          {/* Synopsis */}
          <p style={{
            fontSize: '1.15rem',
            color: '#e5e5e5',
            lineHeight: 1.5,
            marginBottom: '1.8rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)'
          }}>
            Where ideas become the main event. Five original arenas. One grand stage for bold thinking, high-velocity engineering, and the next generation of builders. Choose your arena and take the crown.
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playTaDum();
                setIsRegisterModalOpen(true);
              }}
              className="btn-primary"
            >
              <Play size={20} fill="#000" />
              Register Now
            </button>

            <button
              onClick={() => {
                playClickSound();
                if (items[0]) setSelectedItem(items[0]);
              }}
              className="btn-secondary"
            >
              <Info size={20} />
              More Info
            </button>

            <button
              onClick={() => {
                playClickSound();
                const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Orkestrim+2K26+Symposium&dates=20261024T033000Z/20261024T123000Z&details=SRM+VEC+National+Technical+Symposium&location=SRM+Valliammai+Engineering+College`;
                window.open(calendarUrl, '_blank');
              }}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.4rem' }}
            >
              <Calendar size={18} />
              Add to Calendar
            </button>
          </div>

          {/* Live Countdown Shelf */}
          <div style={{ 
            marginTop: '2.5rem', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '0.8rem 1.4rem',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.1)',
            width: 'fit-content'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#E50914', letterSpacing: '2px', textTransform: 'uppercase' }}>
              PREMIERE AIRDATE: 24 OCT 2026 // COUNTDOWN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{timeLeft.days}</span>
                <span style={{ fontSize: '0.65rem', color: '#888' }}>DAYS</span>
              </div>
              <span style={{ color: '#E50914', fontWeight: 900 }}>:</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', color: '#888' }}>HRS</span>
              </div>
              <span style={{ color: '#E50914', fontWeight: 900 }}>:</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff' }}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', color: '#888' }}>MIN</span>
              </div>
              <span style={{ color: '#E50914', fontWeight: 900 }}>:</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#E50914' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span style={{ fontSize: '0.65rem', color: '#888' }}>SEC</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Edge: Age Maturity Rating Tag */}
        <div style={{
          position: 'absolute',
          right: 0,
          bottom: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            backgroundColor: 'rgba(51, 51, 51, 0.65)',
            borderLeft: '3px solid #dcdcdc',
            padding: '6px 14px',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#fff',
            backdropFilter: 'blur(6px)'
          }}>
            U/A 16+
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORY PILLS BAR ---------------- */}
      <section style={{ padding: '1rem 3.5rem 1.5rem 3.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', overflowX: 'auto' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              playClickSound();
              setSelectedCategory(cat);
            }}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #fff' : '1px solid rgba(255,255,255,0.15)',
              backgroundColor: selectedCategory === cat ? '#ffffff' : 'rgba(30,30,30,0.7)',
              color: selectedCategory === cat ? '#000000' : '#e5e5e5',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat === 'All' ? 'All Arenas' : cat}
          </button>
        ))}
      </section>

      {/* ---------------- ROW 1: TOP 5 ARENAS IN ORKESTRIM TODAY ---------------- */}
      <CarouselRow
        id="top5"
        title="TOP 5 ARENAS IN ORKESTRIM TODAY"
        subtitle={`Ranked for ${user?.username || 'The Coder'} • Live Match Scores & High Adrenaline (Click & Drag or use Arrows to move horizontally)`}
      >
        {top5Items.map((item, index) => (
          <Card
            key={item._id}
            item={item}
            rank={index + 1}
            onSelect={(it) => setSelectedItem(it)}
            onToggleMyList={handleToggleMyList}
            isMyList={myList.some(i => i._id === item._id)}
            onQuickRegister={() => setIsRegisterModalOpen(true)}
            isEditMode={isEditMode}
            onEdit={(it) => handleOpenEditor(it)}
          />
        ))}
      </CarouselRow>

      {/* ---------------- ROW 2: ORIGINAL ARENAS // TECHNICAL COMPETITIONS ---------------- */}
      <CarouselRow
        id="arenas"
        title="ORIGINAL ARENAS // TECHNICAL COMPETITIONS"
        subtitle="Season 2026 Blockbusters • High-Stakes Engineering Tournaments (Click & Drag or use Arrows to move horizontally)"
      >
        {filteredItems.map((item) => (
          <Card
            key={item._id}
            item={item}
            onSelect={(it) => setSelectedItem(it)}
            onToggleMyList={handleToggleMyList}
            isMyList={myList.some(i => i._id === item._id)}
            onQuickRegister={() => setIsRegisterModalOpen(true)}
            isEditMode={isEditMode}
            onEdit={(it) => handleOpenEditor(it)}
          />
        ))}
      </CarouselRow>

      {/* ---------------- ROW 3: BINGE THE SCHEDULE // EPISODES GUIDE ---------------- */}
      <section id="episodes" style={{ padding: '2.5rem 3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2.2rem',
              letterSpacing: '1.5px',
              margin: 0
            }}>
              EPISODES // BINGE THE TIMELINE
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#999', margin: '4px 0 0 0' }}>
              Season 1 • 24 October 2026 • Live Broadcast at SRM VEC Campus
            </p>
          </div>

          <span style={{
            fontSize: '0.85rem',
            color: '#E50914',
            fontWeight: 700,
            border: '1px solid rgba(229,9,20,0.4)',
            padding: '4px 12px',
            borderRadius: '4px'
          }}>
            8 Episodes Total
          </span>
        </div>

        {/* Episode Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {episodes.map((ep, idx) => (
            <div
              key={idx}
              onClick={() => playClickSound()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.8rem',
                padding: '1.2rem 1.6rem',
                backgroundColor: '#1b1b1b',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#252525';
                e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1b1b1b';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Episode Index */}
              <span style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#666',
                fontFamily: "'Montserrat', sans-serif",
                minWidth: '35px'
              }}>
                {idx + 1}
              </span>

              {/* Episode Thumbnail */}
              <div style={{
                position: 'relative',
                width: '140px',
                height: '80px',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={ep.image}
                  alt={ep.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: '1px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={14} fill="#fff" />
                  </div>
                </div>
              </div>

              {/* Episode Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                    {ep.title}
                  </h4>
                  <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 600 }}>
                    {ep.duration}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#E50914', fontWeight: 700, marginBottom: '6px' }}>
                  <span>{ep.time}</span>
                  <span style={{ color: '#666' }}>•</span>
                  <span style={{ color: '#46d369' }}>{ep.venue}</span>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#b3b3b3', margin: 0, lineHeight: 1.35 }}>
                  {ep.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- INTERACTIVE CAMPUS VENUE & NAVIGATION MAP ---------------- */}
      <section id="map" style={{ padding: '2.5rem 3.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#E50914',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '2px 6px',
                borderRadius: '2px',
                fontFamily: "'Montserrat', sans-serif"
              }}>N</span>
              <span style={{ color: '#E50914', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                INTERACTIVE VENUE DISCOVERY
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '2.4rem',
              letterSpacing: '1.5px',
              margin: 0
            }}>
              CAMPUS VENUE MAP // SRM VEC GRID
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#999', margin: '4px 0 0 0' }}>
              Live interactive campus coordinates, walking directions, and arena staging zones
            </p>
          </div>

          {/* Quick Action Google Maps GPS Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=SRM+Valliammai+Engineering+College,+Kattankulathur"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', textDecoration: 'none' }}
              onClick={() => playClickSound()}
            >
              <Navigation size={16} color="#46d369" />
              Live GPS Directions
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => {
                playClickSound();
                const v = campusVenues.find(x => x.id === selectedMapVenue);
                if (v && v.arenaId) {
                  const arena = items.find(i => i._id === v.arenaId);
                  if (arena) setSelectedItem(arena);
                }
              }}
              className="btn-red"
              style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
            >
              <Sparkles size={16} />
              Inspect Selected Arena
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Locations (7)' },
            { id: 'competition', label: 'Competition Arenas (5)' },
            { id: 'craft_services', label: 'Craft Services & Dining' },
            { id: 'transit', label: 'Transit & Main Gate' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                playClickSound();
                setMapCategoryFilter(f.id);
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                border: mapCategoryFilter === f.id ? '1px solid #E50914' : '1px solid rgba(255,255,255,0.15)',
                backgroundColor: mapCategoryFilter === f.id ? 'rgba(229, 9, 20, 0.2)' : 'rgba(255,255,255,0.05)',
                color: mapCategoryFilter === f.id ? '#fff' : '#aaa',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2-Column Layout: Stylized Interactive Visual Map on Left, Detailed Venue Inspector Card on Right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left: Stylized Interactive Campus Blueprint / Grid */}
          <div style={{
            position: 'relative',
            height: '460px',
            backgroundColor: '#121212',
            backgroundImage: `
              radial-gradient(rgba(229, 9, 20, 0.12) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 40px 40px, 40px 40px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
          }}>
            {/* Ambient Campus Boundaries & Schematic Labels */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              color: '#888',
              letterSpacing: '1px',
              fontWeight: 700
            }}>
              <Compass size={16} color="#E50914" />
              SRM VEC CAMPUS BLUEPRINT • 12.8231° N, 80.0442° E
            </div>

            {/* Scale legend */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              fontSize: '0.68rem',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ width: '40px', height: '2px', backgroundColor: '#666', display: 'inline-block' }} />
              <span>100 METERS</span>
            </div>

            {/* Stylized Campus Zones / Blocks Outline */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {/* Walking pathways */}
              <line x1="14%" y1="88%" x2="30%" y2="68%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="30%" y1="68%" x2="44%" y2="64%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="30%" y1="68%" x2="26%" y2="32%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="26%" y1="32%" x2="54%" y2="28%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="54%" y1="28%" x2="78%" y2="42%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="78%" y1="42%" x2="82%" y2="74%" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* Building outlines */}
              <rect x="20%" y="24%" width="16%" height="18%" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x="21%" y="21%" fill="#555" fontSize="9" fontWeight="bold">ADMIN BLOCK</text>

              <rect x="46%" y="18%" width="22%" height="22%" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x="47%" y="15%" fill="#555" fontSize="9" fontWeight="bold">CENTRAL AUDITORIUM</text>

              <rect x="70%" y="34%" width="20%" height="20%" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x="71%" y="31%" fill="#555" fontSize="9" fontWeight="bold">IT & COMPUTING</text>

              <rect x="36%" y="58%" width="18%" height="16%" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x="37%" y="55%" fill="#555" fontSize="9" fontWeight="bold">AMPHITHEATER</text>

              <rect x="74%" y="68%" width="18%" height="16%" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
              <text x="75%" y="65%" fill="#555" fontSize="9" fontWeight="bold">DINING COMPLEX</text>
            </svg>

            {/* Clickable Venue Markers */}
            {campusVenues
              .filter(v => mapCategoryFilter === 'all' || v.type === mapCategoryFilter)
              .map(v => {
                const isSelected = selectedMapVenue === v.id;
                return (
                  <div
                    key={v.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedMapVenue(v.id);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${v.coords.x}%`,
                      top: `${v.coords.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: isSelected ? 30 : 10,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    {/* Pulsing Pin Marker */}
                    <div style={{
                      position: 'relative',
                      width: isSelected ? '40px' : '32px',
                      height: isSelected ? '40px' : '32px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? v.color : '#222',
                      border: `2px solid ${v.color}`,
                      boxShadow: isSelected 
                        ? `0 0 25px ${v.color}, 0 0 10px #fff` 
                        : '0 4px 10px rgba(0,0,0,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#000' : '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}>
                      <MapPin size={isSelected ? 20 : 16} fill={isSelected ? '#000' : v.color} />
                    </div>

                    {/* Pin Label Tag */}
                    <div style={{
                      marginTop: '4px',
                      backgroundColor: isSelected ? 'rgba(0,0,0,0.95)' : 'rgba(20,20,20,0.8)',
                      border: isSelected ? `1px solid ${v.color}` : '1px solid rgba(255,255,255,0.15)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.68rem',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? '#fff' : '#ccc',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none'
                    }}>
                      {v.name}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Right: Detailed Venue Inspector Card */}
          {(() => {
            const currentVenue = campusVenues.find(v => v.id === selectedMapVenue) || campusVenues[0];
            return (
              <div style={{
                backgroundColor: '#181818',
                borderRadius: '8px',
                border: `1px solid ${currentVenue.color || 'rgba(255,255,255,0.15)'}`,
                boxShadow: `0 15px 35px rgba(0,0,0,0.8), 0 0 20px ${currentVenue.color}33`,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Header Poster Banner */}
                <div style={{
                  position: 'relative',
                  height: '170px',
                  backgroundImage: `linear-gradient(180deg, transparent 20%, #181818 100%), url(${currentVenue.poster})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{
                      backgroundColor: currentVenue.color,
                      color: '#000',
                      fontSize: '0.65rem',
                      fontWeight: 900,
                      padding: '1px 5px',
                      borderRadius: '2px',
                      textTransform: 'uppercase'
                    }}>
                      {currentVenue.show}
                    </span>
                    <span style={{ color: '#46d369', fontSize: '0.75rem', fontWeight: 700 }}>
                      • {currentVenue.walkingTime}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '2rem',
                    letterSpacing: '1px',
                    margin: 0,
                    color: '#fff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.9)'
                  }}>
                    {currentVenue.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#ccc' }}>
                    {currentVenue.building} • {currentVenue.floor}
                  </span>
                </div>

                {/* Details Body */}
                <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.88rem', color: '#ddd', lineHeight: 1.5, margin: 0 }}>
                    {currentVenue.desc}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.8rem',
                    backgroundColor: '#202020',
                    padding: '0.9rem',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600 }}>CAMPUS SECTOR</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{currentVenue.building}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 600 }}>VENUE CAPACITY</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#46d369' }}>{currentVenue.capacity}</div>
                    </div>
                  </div>

                  {/* Navigation Landmarks */}
                  <div style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderLeft: `3px solid ${currentVenue.color}`,
                    padding: '0.7rem 1rem',
                    borderRadius: '0 4px 4px 0',
                    fontSize: '0.8rem',
                    color: '#bbb',
                    lineHeight: 1.4
                  }}>
                    <strong style={{ color: '#fff' }}>Nav Guide:</strong> {currentVenue.landmarks}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    {currentVenue.arenaId && (
                      <button
                        onClick={() => {
                          playClickSound();
                          const arena = items.find(i => i._id === currentVenue.arenaId);
                          if (arena) setSelectedItem(arena);
                        }}
                        className="btn-red"
                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem' }}
                      >
                        <Play size={15} fill="#fff" />
                        Arena Details
                      </button>
                    )}

                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=SRM+Valliammai+Engineering+College"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', textDecoration: 'none' }}
                      onClick={() => playClickSound()}
                    >
                      <Navigation size={15} />
                      Navigate GPS
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Embedded Google Maps Container */}
        <div style={{ marginTop: '1.8rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            backgroundColor: '#181818',
            padding: '0.8rem 1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#ddd' }}>
              <MapPin size={16} color="#E50914" />
              <span>SRM Valliammai Engineering College, SRM Nagar, Kattankulathur, Tamil Nadu 603203</span>
            </div>
            <a
              href="https://maps.google.com/?q=SRM+Valliammai+Engineering+College"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0071eb', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}
            >
              Open Full Google Map ↗
            </a>
          </div>
          <iframe
            title="SRM Valliammai Engineering College Map"
            src="https://maps.google.com/maps?q=SRM%20Valliammai%20Engineering%20College%20Kattankulathur&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="260"
            style={{ border: 0, display: 'block', filter: 'invert(90%) hue-rotate(180deg) contrast(110%)' }}
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      {/* ---------------- ROW 4: CRAFT SERVICES & COMMUTE (FOOD & VENUE) ---------------- */}
      <section id="venue" style={{ padding: '2.5rem 3.5rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2.2rem',
          letterSpacing: '1.5px',
          marginBottom: '0.2rem'
        }}>
          CRAFT SERVICES & COMMUTE // AMENITIES
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem' }}>
          Hospitality, Shuttle Fleets, Wi-Fi Connectivity & Campus Navigation
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Card 1: Food & Hospitality */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(229,9,20,0.15)', borderRadius: '6px' }}>
                <Coffee size={24} color="#E50914" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Craft Services & Dining</h3>
                <span style={{ fontSize: '0.75rem', color: '#46d369', fontWeight: 600 }}>Included for All Registered Delegates</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.4 }}>
              • <strong>Morning Buffet (8:30 - 9:45 AM):</strong> Fresh Idlis, Medu Vada, Pongal, Sambhar & Filter Coffee.<br />
              • <strong>Executive Binge Lunch (1:00 - 2:00 PM):</strong> Fragrant Dum Biryani, Veg Pulao, Paneer Butter Masala, Gulab Jamun & Ice Cream.<br />
              • <strong>Evening High Tea (4:30 PM):</strong> Hot Samosas, Cookies, Masala Chai & Green Tea.
            </p>
          </div>

          {/* Card 2: Transport & Buses */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(0,113,235,0.15)', borderRadius: '6px' }}>
                <Bus size={24} color="#0071eb" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>College Fleet Transit</h3>
                <span style={{ fontSize: '0.75rem', color: '#0071eb', fontWeight: 600 }}>Complimentary Pickup & Drop</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.4 }}>
              • <strong>Route 1:</strong> Tambaram Railway Station (Opp. West Gate) — 07:45 AM<br />
              • <strong>Route 2:</strong> Guindy Asiad Bus Stop — 07:20 AM<br />
              • <strong>Route 3:</strong> Chengalpattu New Bus Stand — 08:00 AM<br />
              • <strong>Return Shuttle:</strong> Departs campus gate at 05:45 PM after the Award Ceremony.
            </p>
          </div>

          {/* Card 3: Wi-Fi & Venue Grid */}
          <div style={{
            backgroundColor: '#1c1c1c',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: 'rgba(70,211,105,0.15)', borderRadius: '6px' }}>
                <Wifi size={24} color="#46d369" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>High-Velocity Campus Wi-Fi</h3>
                <span style={{ fontSize: '0.75rem', color: '#46d369', fontWeight: 600 }}>1 Gbps Fiber Pipeline</span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#bbb', lineHeight: 1.4 }}>
              • <strong>SSID:</strong> SRM-ORKESTRIM-GUEST<br />
              • <strong>WPA-Key:</strong> ORKESTRIM2K26<br />
              • <strong>Location:</strong> SRM Valliammai Engineering College, SRM Nagar, Kattankulathur, Chennai - 603203.<br />
              • <strong>Help Desk:</strong> Tech Support Stall at Ground Floor Admin Foyer.
            </p>
          </div>

        </div>
      </section>

      {/* ---------------- ROW 5: CAST & CREW // COORDINATORS ---------------- */}
      <section id="cast" style={{ padding: '2.5rem 3.5rem 5rem 3.5rem' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2.2rem',
          letterSpacing: '1.5px',
          marginBottom: '0.2rem'
        }}>
          CAST & CREW // SYMPOSIUM HEADS
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '1.5rem' }}>
          Executive Producers, Faculty Chairs & Student Showrunners
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { name: 'Dr. K. Raman', role: 'Staff Convener // HOD', dept: 'Information Technology', phone: '+91 98401 23456' },
            { name: 'Sarah Jenkins', role: 'Student President', dept: 'Final Year IT', phone: '+91 98401 23457' },
            { name: 'Liam Thorne', role: 'Vice President & Quiz Lead', dept: 'Third Year IT', phone: '+91 97890 54322' },
            { name: 'Amelia Clark', role: 'Operations & Event Director', dept: 'Final Year IT', phone: '+91 99620 44557' }
          ].map((crew, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#181818',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '6px',
                padding: '1.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                {crew.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#E50914', fontWeight: 700 }}>
                {crew.role}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#888' }}>
                {crew.dept}
              </div>
              <a
                href={`tel:${crew.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '6px',
                  color: '#46d369',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <Phone size={14} />
                {crew.phone}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- MY LIST SECTION (IF SELECTED) ---------------- */}
      {activeTab === 'mylist' && (
        <section id="mylist" style={{ padding: '3.5rem', minHeight: '60vh' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', marginBottom: '1rem' }}>
            MY LIST // BOOKMARKED ARENAS
          </h2>
          {myList.length === 0 ? (
            <div style={{ color: '#888', fontSize: '1.1rem', padding: '3rem 0' }}>
              You haven't added any arenas to your list yet. Click the <strong>＋</strong> button on any arena card to save it here!
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {myList.map(item => (
                <Card
                  key={item._id}
                  item={item}
                  onSelect={(it) => setSelectedItem(it)}
                  onToggleMyList={handleToggleMyList}
                  isMyList={true}
                  onQuickRegister={() => setIsRegisterModalOpen(true)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ---------------- DETAILED NETFLIX PREVIEW MODAL ---------------- */}
      {selectedItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          overflowY: 'auto'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '850px',
            backgroundColor: '#181818',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.95)',
            border: '1px solid rgba(255,255,255,0.15)',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Close Button */}
            <button
              onClick={() => {
                playClickSound();
                setSelectedItem(null);
              }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(20,20,20,0.8)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 20
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Header Poster Banner */}
            <div style={{
              position: 'relative',
              height: '340px',
              backgroundImage: `linear-gradient(180deg, transparent 40%, #181818 100%), url(${selectedItem.poster})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2rem 2.5rem'
            }}>
              {selectedItem.franchise && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{
                    backgroundColor: selectedItem.themeColor || '#E50914',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    padding: '2px 6px',
                    borderRadius: '2px',
                    fontFamily: "'Montserrat', sans-serif"
                  }}>N</span>
                  <span style={{
                    color: selectedItem.themeColor || '#E50914',
                    fontSize: '0.85rem',
                    letterSpacing: '2.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                  }}>
                    {selectedItem.franchise}
                  </span>
                </div>
              )}
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '3.5rem',
                letterSpacing: '2px',
                margin: '0 0 0.8rem 0',
                color: '#fff',
                textShadow: '0 2px 10px rgba(0,0,0,0.9)'
              }}>
                {selectedItem.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    playTaDum();
                    setSelectedItem(null);
                    setIsRegisterModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ padding: '0.6rem 1.6rem', fontSize: '1rem' }}
                >
                  <Play size={18} fill="#000" />
                  Register Now
                </button>

                <button
                  onClick={() => handleToggleMyList(selectedItem)}
                  className="btn-secondary"
                  style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                >
                  {myList.some(i => i._id === selectedItem._id) ? (
                    <>
                      <Check size={18} color="#46d369" />
                      In My List
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add to My List
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    handleOpenEditor(selectedItem);
                  }}
                  className="btn-secondary"
                  style={{ 
                    padding: '0.6rem 1.2rem', 
                    fontSize: '0.9rem', 
                    backgroundColor: 'rgba(229, 9, 20, 0.2)', 
                    border: '1px solid #E50914',
                    color: '#fff'
                  }}
                  title="Edit details for this arena"
                >
                  <Edit3 size={16} color="#E50914" />
                  Edit Arena
                </button>

                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#46d369', fontWeight: 800, fontSize: '1rem' }}>
                    {selectedItem.matchScore}% Match
                  </span>
                  <span style={{ border: '1px solid #666', padding: '1px 6px', fontSize: '0.75rem', borderRadius: '2px' }}>
                    {selectedItem.ageRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid #333',
              padding: '0 2.5rem',
              backgroundColor: '#181818'
            }}>
              {[
                { id: 'overview', label: 'Overview & Specifications' },
                { id: 'rules', label: 'Rules & Guidelines' },
                { id: 'coordinators', label: 'Student Coordinators' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound();
                    setActiveModalTab(tab.id);
                  }}
                  style={{
                    padding: '1rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeModalTab === tab.id ? '3px solid #E50914' : '3px solid transparent',
                    color: activeModalTab === tab.id ? '#ffffff' : '#888',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body Content */}
            <div style={{ padding: '2rem 2.5rem', overflowY: 'auto' }}>
              
              {activeModalTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#e5e5e5' }}>
                    {selectedItem.description}
                  </p>

                  {selectedItem.quote && (
                    <div style={{
                      fontStyle: 'italic',
                      color: '#ddd',
                      borderLeft: `3px solid ${selectedItem.themeColor || '#E50914'}`,
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      padding: '0.9rem 1.2rem',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.92rem',
                      lineHeight: 1.5
                    }}>
                      {selectedItem.quote}
                    </div>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                    backgroundColor: '#202020',
                    padding: '1.2rem',
                    borderRadius: '6px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>DATE & TIMING</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{selectedItem.timing}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>VENUE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#46d369' }}>{selectedItem.venue}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>SQUAD / TEAM SIZE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{selectedItem.teamSize}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>CASH PRIZE POOL</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffd700' }}>{selectedItem.prizePool}</div>
                    </div>
                  </div>

                  {selectedItem.tags && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {selectedItem.tags.map((tg, idx) => (
                        <span key={idx} style={{
                          backgroundColor: '#2b2b2b',
                          color: '#ccc',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeModalTab === 'rules' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#E50914' }}>
                    Official Symposium Regulations & Protocol
                  </h4>
                  <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#ddd' }}>
                    {selectedItem.rules?.map((rule, idx) => (
                      <li key={idx} style={{ lineHeight: 1.4, fontSize: '0.95rem' }}>
                        {rule}
                      </li>
                    )) || (
                      <li>Standard rules apply. Refer to the event coordinators for queries.</li>
                    )}
                  </ul>
                </div>
              )}

              {activeModalTab === 'coordinators' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    Official Event Staff & Student Showrunners
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {selectedItem.coordinators?.map((c, idx) => (
                      <div key={idx} style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '6px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{c.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#E50914', fontWeight: 600 }}>{c.role}</div>
                        <a href={`tel:${c.phone}`} style={{ color: '#46d369', fontSize: '0.85rem', marginTop: '6px', display: 'block', textDecoration: 'none' }}>
                          {c.phone}
                        </a>
                      </div>
                    )) || (
                      <div>Contact symposium registration desk at main auditorium.</div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ---------------- REGISTER NOW MODAL ---------------- */}
      {isRegisterModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#181818',
            border: '1px solid rgba(229, 9, 20, 0.4)',
            borderRadius: '8px',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.95)'
          }}>
            <button
              onClick={() => {
                playClickSound();
                setIsRegisterModalOpen(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {registrationSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(70,211,105,0.2)',
                  border: '2px solid #46d369',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem auto'
                }}>
                  <Check size={32} color="#46d369" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', color: '#fff' }}>
                  DELEGATE PASS CONFIRMED!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>
                  Your digital entry badge for <strong>Orkestrim 2K26</strong> has been issued. Check your email for RFID scan code.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#E50914', color: '#fff', fontWeight: 900, padding: '1px 6px', borderRadius: '2px' }}>N</span>
                  <h3 style={{ fontSize: '1.6rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', margin: 0 }}>
                    OFFICIAL ARENA REGISTRATION
                  </h3>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
                  Free entry included with delegate pass. Instant team confirmation.
                </p>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Lead Participant Name</label>
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>College / University</label>
                  <input
                    type="text"
                    required
                    value={registerForm.college}
                    onChange={(e) => setRegisterForm({ ...registerForm, college: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Target Arena</label>
                  <select
                    value={registerForm.arenaId}
                    onChange={(e) => setRegisterForm({ ...registerForm, arenaId: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  >
                    {items.map(it => (
                      <option key={it._id} value={it._id}>{it.title} ({it.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Squad Members (1 to 4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={registerForm.teamSize}
                    onChange={(e) => setRegisterForm({ ...registerForm, teamSize: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-red"
                  style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
                >
                  Confirm Delegate Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ---------------- PITCH / ADD CUSTOM ARENA MODAL ---------------- */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#181818',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '2.5rem',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.95)'
          }}>
            <button
              onClick={() => {
                playClickSound();
                setIsAddModalOpen(false);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <form onSubmit={handleAddNewItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.6rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px', margin: 0 }}>
                PITCH A NEW ARENA / PAPER
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
                Propose an innovative competition or challenge for the Orkestrim board.
              </p>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Arena Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prompt Heist, Reverse Crypto, Cyber Sprint"
                  value={newArenaForm.title}
                  onChange={(e) => setNewArenaForm({ ...newArenaForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Category</label>
                <select
                  value={newArenaForm.category}
                  onChange={(e) => setNewArenaForm({ ...newArenaForm, category: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                >
                  <option value="Coding & Tech">Coding & Tech</option>
                  <option value="Research & Demo">Research & Demo</option>
                  <option value="Quiz & Logic">Quiz & Logic</option>
                  <option value="Ads & Treasure Hunt">Ads & Treasure Hunt</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Punchy Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. The fastest fingers write the future."
                  value={newArenaForm.tagline}
                  onChange={(e) => setNewArenaForm({ ...newArenaForm, tagline: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#bbb', display: 'block', marginBottom: '4px' }}>Brief Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe rules, objectives, and judging criteria..."
                  value={newArenaForm.description}
                  onChange={(e) => setNewArenaForm({ ...newArenaForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#282828', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
                />
              </div>

              <button
                type="submit"
                className="btn-red"
                style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '1rem' }}
              >
                Submit Arena to Board
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- SLICK NETFLIX FOOTER ---------------- */}
      <footer style={{
        backgroundColor: '#0b0b0b',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '3.5rem 3.5rem 2rem 3.5rem',
        color: '#737373',
        fontSize: '0.82rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
            Questions? Call +91 98401 23456 • SRM Valliammai Engineering College
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span>FAQ & Registration</span>
              <span>Investor Relations</span>
              <span>Privacy Statement</span>
              <span>Speed Test</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span>Help Center</span>
              <span>Student Coordinators</span>
              <span>Cookie Preferences</span>
              <span>Legal Notices</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span>Account Pass</span>
              <span>Ways to Stream</span>
              <span>Corporate Information</span>
              <span>Only on Orkestrim</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <span>Media Center</span>
              <span>Terms of Use</span>
              <span>Contact Secretariat</span>
              <span>SRM VEC Portal</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              © 2026 ORKESTRIM. SRM Valliammai Engineering College. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                background: '#E50914',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '2px 5px',
                borderRadius: '2px'
              }}>N</span>
              <span style={{ color: '#fff', fontWeight: 700 }}>ORIGINAL EXPERIENCE</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ---------------- LIVE IN-APP EDITOR MODAL ---------------- */}
      <LiveEditorModal
        arena={editingArena}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveArena}
        onDelete={handleDeleteArena}
        onResetDefaults={handleResetDefaults}
        onExportJSON={exportItemsJSON}
        onImportJSON={handleImportJSON}
      />

    </div>
  );
}
