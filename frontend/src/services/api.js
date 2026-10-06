// API Service Lead - standard fetch handler with themed Netflix Franchise mock data
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEFAULT_ARENAS = [
  {
    _id: 'arena-01',
    title: 'Paper Spark',
    theme: 'Wednesday',
    franchise: 'A WEDNESDAY ORIGINAL',
    franchiseTag: 'Gothic Academia • Mystery • Dark Research',
    tagline: 'She writes their end. Wednesday unveils the manuscript.',
    quote: '"I find social algorithms repulsive, but I find bad papers even worse." — Wednesday Addams',
    description: 'Gothic mystery meets cutting-edge algorithmic research. In the secluded halls of Nevermore Academy, defend your breakthrough research papers across Artificial Intelligence, Distributed Systems, IoT, Cybersecurity, and Next-Gen Computing before an uncompromising tribunal of faculty and industry veterans.',
    poster: '/assets/poster-wednesday.jpg',
    backdrop: '/assets/hero-backdrop.jpg',
    themeColor: '#a855f7',
    matchScore: 99,
    ageRating: 'U/A 16+',
    duration: '90m',
    rank: 1,
    isOriginal: true,
    isTop10: true,
    timing: '24 Oct 2026 • 10:00 AM — 11:30 AM',
    venue: 'Seminar Hall 1 (Admin Block 2nd Floor)',
    teamSize: '1 to 3 Members',
    fee: 'Free Entry / Included with Delegate Pass',
    prizePool: '₹15,000 Total (₹10,000 Winner + ₹5,000 Runner Up)',
    coordinators: [
      { name: 'Dr. K. Raman', role: 'Nevermore Faculty Chair', phone: '+91 98401 23456' },
      { name: 'Sarah Jenkins', role: 'Student President // Enid Sinclair', phone: '+91 98401 23457' }
    ],
    rules: [
      'Each team is allotted 8 minutes for oral manuscript presentation + 2 minutes defense against panel inquisitors.',
      'Submissions must strictly follow standard IEEE two-column conference guidelines.',
      'Plagiarism index must not exceed 15% (Wednesday will personally examine doubtful citations).',
      'Digital PPT slide decks must be handed over 20 minutes prior to session premiere.'
    ],
    tags: ['Wednesday', 'Nevermore', 'AI Research', 'Peer Defense', 'IEEE Format']
  },
  {
    _id: 'arena-02',
    title: "Brainiac's Battle",
    theme: 'Arcane',
    franchise: 'AN ARCANE ORIGINAL',
    franchiseTag: 'Hextech vs Zaun • Electric Synapse Duel',
    tagline: 'Hextech intellect vs Zaun instinct. The war for progress.',
    quote: '"In the pursuit of great minds, we failed to do good. Now, fight for the spark." — Viktor & Jayce',
    description: 'Where Piltover’s pristine inventors face off against the raw, volatile genius of the Undercity. A high-voltage, multi-round cerebral tournament: rapid-fire trivia, algorithmic pattern recognition, and buzzer duels beneath the neon hum of Zaun and the gilded spires of Piltover.',
    poster: '/assets/poster-arcane.jpg',
    backdrop: '/assets/hero-backdrop.jpg',
    themeColor: '#00f0ff',
    matchScore: 99,
    ageRating: 'U/A 16+',
    duration: '75m',
    rank: 2,
    isOriginal: true,
    isTop10: true,
    timing: '24 Oct 2026 • 11:30 AM — 12:45 PM',
    venue: 'Main Auditorium (Central Council Chamber)',
    teamSize: '2 Members per Squad',
    fee: 'Free Entry / Included with Delegate Pass',
    prizePool: '₹12,000 Total (₹8,000 Winner + ₹4,000 Runner Up)',
    coordinators: [
      { name: 'Prof. S. Arvind', role: 'Council Dean', phone: '+91 97890 54321' },
      { name: 'Liam Thorne', role: 'Hextech Arbiter // Student Lead', phone: '+91 97890 54322' }
    ],
    rules: [
      'Round 1: 40 questions in 30 minutes covering algorithms, tech lore, pop culture & deduction.',
      'Top 6 squads advance to the live electronic Hextech buzzer stage round.',
      'Smartphones, smartwatches, and external shimmer aids will result in immediate disqualification.',
      'Quiz Arbiter decisions are absolute and final.'
    ],
    tags: ['Arcane', 'Hextech', 'Zaun', 'Live Buzzer', 'High-Octane']
  },
  {
    _id: 'arena-03',
    title: 'Techno Connect',
    theme: 'Money Heist',
    franchise: 'A LA CASA DE PAPEL ORIGINAL',
    franchiseTag: 'El Profesor Heist • Cryptic Network Breach',
    tagline: "The code. The heist. The net. They're inside the system.",
    quote: '"Time is greater than money. In this heist, only the purest logic breaches the vault." — El Profesor',
    description: 'Don your red jumpsuits and Salvador Dalí masks. El Profesor has drawn up the blueprint for the grandest cyber heist in campus history. Decrypt visual connection puzzles, trace red-string forensic evidence, and reverse-engineer obfuscated security terminals before the sirens wail.',
    poster: '/assets/poster-moneyheist.jpg',
    backdrop: '/assets/hero-backdrop.jpg',
    themeColor: '#E50914',
    matchScore: 98,
    ageRating: 'U/A 16+',
    duration: '75m',
    rank: 3,
    isOriginal: true,
    isTop10: true,
    timing: '24 Oct 2026 • 02:00 PM — 03:15 PM',
    venue: 'Cyber Systems Lab 304 (The Mint)',
    teamSize: '1 or 2 Members',
    fee: 'Free Entry / Included with Delegate Pass',
    prizePool: '₹10,000 Total (₹7,000 Winner + ₹3,000 Runner Up)',
    coordinators: [
      { name: 'Dr. N. Priya', role: 'The Inspector', phone: '+91 94441 98765' },
      { name: 'Kendall Roy', role: 'Field Marshall // Berlin', phone: '+91 94441 98766' }
    ],
    rules: [
      'Round 1: 25 cryptic visual link challenges connecting icons to world-altering cyber breakthroughs.',
      'Round 2: Solving a multi-stage cryptographic vault puzzle under time pressure.',
      'Participants may use offline code editors and terminal utilities provided.',
      'Time bonus awarded for earliest valid decrypt keys.'
    ],
    tags: ['Money Heist', 'Dali Mask', 'Bella Ciao', 'Cryptic Clues', 'Reverse Engineering']
  },
  {
    _id: 'arena-04',
    title: 'Techno Ads',
    theme: 'Black Mirror',
    franchise: 'A BLACK MIRROR ORIGINAL',
    franchiseTag: 'Dystopian Satire • The Pitch from 2049',
    tagline: 'The revolution is here. Rate us 5 stars, or face obsolescence.',
    quote: '"Technology is a drug—and its side effects are hilariously terrifying." — Charlie Brooker',
    description: 'Step through the shattered looking glass. In a near-future corporate dystopia, charismatic tech evangelists battle to market alarming consumer prototypes—from memory-recording neuro-implants to social-credit smart toasters. Pitch your commercial live on stage to a ruthless venture panel.',
    poster: '/assets/poster-blackmirror.jpg',
    backdrop: '/assets/hero-backdrop.jpg',
    themeColor: '#06b6d4',
    matchScore: 97,
    ageRating: '18+',
    duration: '60m',
    rank: 4,
    isOriginal: true,
    isTop10: true,
    timing: '24 Oct 2026 • 02:15 PM — 03:30 PM',
    venue: 'Open-Air Amphitheater (Broadcast Arena)',
    teamSize: '2 to 4 Members',
    fee: 'Free Entry / Included with Delegate Pass',
    prizePool: '₹9,000 Total (₹6,000 Winner + ₹3,000 Runner Up)',
    coordinators: [
      { name: 'Prof. M. Devi', role: 'Executive Producer', phone: '+91 98840 11223' },
      { name: 'Leo Chen', role: 'Showrunner // Lacie Pound', phone: '+91 98840 11224' }
    ],
    rules: [
      'Teams are assigned a dystopian futuristic tech invention topic.',
      'Teams receive 20 minutes to script a 3-minute television commercial.',
      'Dark satirical humor, inventive props, and theatrics score highest.',
      'Evaluation: Persuasiveness (40%), Dystopian Satire Wit (30%), Stage Presence (30%).'
    ],
    tags: ['Black Mirror', 'Nosedive', 'Dystopian Pitch', 'Satire Comedy', 'Venture Capital']
  },
  {
    _id: 'arena-05',
    title: 'Techno Treasure',
    theme: 'The Witcher',
    franchise: 'A THE WITCHER ORIGINAL',
    franchiseTag: 'Continent Relic Hunt • Digital Alchemy',
    tagline: 'Toss a coin to your hacker. The hunt for ancient relics begins.',
    quote: '"Evil is evil... but locating the digital treasure vault first is absolute." — Geralt of Rivia',
    description: 'Equip your cyber medallion, ready your silver blade, and tune your terminal senses. An adrenaline-charged physical and digital relic hunt across SRM VEC. Decode hidden RFID runes, navigate the ancient campus perimeter, and unearth the lost grand vault before competing witcher schools claim the bounty.',
    poster: '/assets/poster-witcher.jpg',
    backdrop: '/assets/hero-backdrop.jpg',
    themeColor: '#eab308',
    matchScore: 98,
    ageRating: 'U/A 16+',
    duration: '90m',
    rank: 5,
    isOriginal: true,
    isTop10: true,
    timing: '24 Oct 2026 • 03:30 PM — 05:00 PM',
    venue: 'Campus Wide • Briefing at Tech Plaza Lawn (Kaer Morhen)',
    teamSize: '3 to 4 Members',
    fee: 'Free Entry / Included with Delegate Pass',
    prizePool: '₹15,000 Total (₹10,000 Winner + ₹5,000 Runner Up)',
    coordinators: [
      { name: 'Dr. V. Rajesh', role: 'Grandmaster Witcher', phone: '+91 99620 44556' },
      { name: 'Amelia Clark', role: 'School of the Wolf Lead', phone: '+91 99620 44557' }
    ],
    rules: [
      'Squads must register with at least one camera- and GPS-enabled device.',
      'Chained clues: cracking Rune N unlocks coordinate telemetry for Rune N+1.',
      'Sanctuary boundaries strictly enforced: no entering unauthorized campus sectors.',
      'First school to enter the decrypt cipher at the central vault wins the grand bounty.'
    ],
    tags: ['The Witcher', 'Geralt', 'Kaer Morhen', 'Campus Heist', 'AR Tracking']
  }
];

// Always return fresh themed arenas if localStorage is stale
const getLocalItems = () => {
  try {
    const saved = localStorage.getItem('orkestrim_arenas_themed_v2');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  localStorage.setItem('orkestrim_arenas_themed_v2', JSON.stringify(DEFAULT_ARENAS));
  return DEFAULT_ARENAS;
};

// 1. loginUser(credentials)
export async function loginUser(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Login failed');
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend unavailable, using local mock auth:', error.message);
    const mockUser = {
      id: 'usr_' + Date.now(),
      username: credentials.email ? credentials.email.split('@')[0] : 'The Coder',
      email: credentials.email || 'coder@orkestrim.ac.in',
      token: 'jwt_mock_token_netflix_' + Date.now(),
    };
    localStorage.setItem('orkestrim_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser, token: mockUser.token };
  }
}

// 2. registerUser(userData)
export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Registration failed');
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend unavailable, using local mock registration:', error.message);
    const mockUser = {
      id: 'usr_' + Date.now(),
      username: userData.username || 'The Coder',
      email: userData.email || 'coder@orkestrim.ac.in',
      token: 'jwt_mock_token_netflix_' + Date.now(),
    };
    localStorage.setItem('orkestrim_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser, token: mockUser.token };
  }
}

// 3. getItems()
export async function getItems() {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data : getLocalItems();
  } catch (error) {
    return getLocalItems();
  }
}

// 4. createItem(itemData)
export async function createItem(itemData) {
  try {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      throw new Error('Failed to create item');
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend offline, saving item locally:', error.message);
    const current = getLocalItems();
    const newItem = {
      _id: 'arena-' + Date.now(),
      title: itemData.title || 'Custom Pitch',
      theme: 'Custom Series',
      franchise: 'COMMUNITY ORIGINAL',
      tagline: itemData.tagline || 'New challenge awaiting champions.',
      description: itemData.description || 'Custom symposium competition submitted by delegate.',
      poster: '/assets/poster-arcane.jpg',
      backdrop: '/assets/hero-backdrop.jpg',
      themeColor: '#E50914',
      matchScore: 95,
      ageRating: 'U/A 16+',
      duration: '60m',
      rank: current.length + 1,
      isOriginal: false,
      isTop10: false,
      timing: '24 Oct 2026 • TBA',
      venue: 'Lab 201 (Innovation Wing)',
      teamSize: '1 to 3 Members',
      fee: 'Free Entry',
      prizePool: '₹5,000 Cash Prize',
      coordinators: [
        { name: 'Delegate Submission', role: 'Lead Host', phone: '+91 99999 88888' }
      ],
      rules: ['Standard hackathon guidelines apply.'],
      tags: ['Community Pitch', 'Innovation']
    };
    const updated = [newItem, ...current];
    localStorage.setItem('orkestrim_arenas_themed_v2', JSON.stringify(updated));
    return newItem;
  }
}

// 5. updateItem(id, updatedFields)
export async function updateItem(id, updatedFields) {
  try {
    const current = getLocalItems();
    const updated = current.map(item => {
      if (item._id === id) {
        return { ...item, ...updatedFields };
      }
      return item;
    });
    localStorage.setItem('orkestrim_arenas_themed_v2', JSON.stringify(updated));
    return updated.find(i => i._id === id);
  } catch (error) {
    console.error('Error updating arena:', error);
    throw error;
  }
}

// 6. deleteItem(id)
export async function deleteItem(id) {
  try {
    const current = getLocalItems();
    const updated = current.filter(item => item._id !== id);
    localStorage.setItem('orkestrim_arenas_themed_v2', JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting arena:', error);
    throw error;
  }
}

// 7. resetItemsToDefault()
export function resetItemsToDefault() {
  localStorage.removeItem('orkestrim_arenas_themed_v2');
  return DEFAULT_ARENAS;
}

// 8. exportItemsJSON()
export function exportItemsJSON() {
  const current = getLocalItems();
  return JSON.stringify(current, null, 2);
}

// 9. importItemsJSON(jsonString)
export function importItemsJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      localStorage.setItem('orkestrim_arenas_themed_v2', JSON.stringify(parsed));
      return parsed;
    }
    throw new Error('Invalid arenas array format');
  } catch (err) {
    throw new Error('JSON Import failed: ' + err.message);
  }
}

