# 🎬 ORKESTRIM 2K26 | The Netflix Original Symposium Experience

> **National Level Technical Symposium • SRM Valliammai Engineering College**  
> *Where Ideas Become The Main Event — 24 October 2026*

---

## 🌟 Overview

**ORKESTRIM 2K26** is a state-of-the-art web application engineered with an authentic **Netflix streaming service aesthetic**. It replaces conventional college symposium websites with high-octane cinematic storytelling, horizontal drag-to-scroll carousels, custom Web Audio synthesizers, interactive campus navigation, and a **Live In-App Editor (Live CMS)** for instant updates.

---

## 🎭 The 5 Flagship Netflix Event Franchises

Each technical challenge is styled as an iconic Netflix Original series:

| Franchise | Event Title | Category | Tagline / Lore |
| :--- | :--- | :--- | :--- |
| **Wednesday** | **Paper Spark** | Research & AI | *She writes their end. Gothic manuscript peer defense at Nevermore Academy.* |
| **Arcane** | **Brainiac's Battle** | Quiz & Logic | *Hextech intellect vs Zaun instinct. High-voltage electronic buzzer tournament.* |
| **Money Heist** | **Techno Connect** | Network & Cryptic | *El Profesor's master plan: Decrypt visual links and breach the Royal Mint.* |
| **Black Mirror** | **Techno Ads** | Dystopian Ad Zap | *Pitching 2049 speculative tech gadgets to a ruthless venture tribunal.* |
| **The Witcher** | **Techno Treasure** | Campus Quest | *Kaer Morhen relic hunt across SRM VEC campus quad with encrypted runes.* |

---

## 🚀 Key Features

- **🎬 Authentic Netflix Streaming UI**: Deep onyx (`#141414`), Netflix Red (`#E50914`), Bebas Neue cinematic typography, card hover zooms, top 5 outline rankings, and ambient glow vignettes.
- **✏️ Live In-App Editor (Live CMS)**: Direct on-screen editor allowing symposium organizers to update titles, rules, timings, venues, prize pools, and posters live in the browser without redeploying code. Includes JSON export and import for instant backups.
- **🔊 Web Audio API Synthesizer**: Generates the iconic Netflix *"Ta-dum"* power chord and subtle UI click sound effects directly in the browser with zero external audio assets.
- **🗺️ SRM VEC Campus Grid & GPS Navigation**: Interactive campus map highlighting Seminar Halls, Cyber Systems Lab 304, Central Lawns, and Main Auditorium with live walking estimates and Google Maps integration.
- **↔️ Horizontally Movable Carousels**: Drag-to-scroll, touch pan, and floating side paddle controls for smooth browsing.
- **⏱️ Live Synchronized Countdown**: Real-time ticker counting down to the grand symposium kickoff on October 24, 2026.
- **🔓 VIP All-Access Pass**: Zero registration friction; delegates enter directly with unrestricted VIP access unlocked.
- **🍽️ Craft Services & Amenities Guide**: Full schedule for morning continental buffet, executive binge lunch, transport shuttle routes, and high-speed Wi-Fi access.

---

## 📂 Project Architecture

```
├── frontend/
│   ├── public/
│   │   └── assets/              # Generated cinematic 4K posters & hero backdrop
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx         # Netflix zoom card with Top 5 badge & live edit overlay
│   │   │   ├── CarouselRow.jsx  # Drag-to-scroll container with floating paddle arrows
│   │   │   ├── LiveEditorModal.jsx # Direct on-page editor for live updates
│   │   │   └── Navbar.jsx       # Floating glassmorphic navigation with Live Edit toggle
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Hero billboard, carousels, map, amenities & modals
│   │   │   └── Login.jsx        # Netflix-style frosted glass portal with guest bypass
│   │   ├── services/
│   │   │   ├── api.js           # Data service with LocalStorage persistence & REST sync
│   │   │   └── sound.js         # Web Audio API synthesizer (Ta-Dum chord)
│   │   ├── App.jsx              # Main state coordinator & edit mode toggle
│   │   ├── main.jsx             # React 19 mount point
│   │   └── index.css            # Netflix theme tokens, animations & scrollbars
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/                     # Node.js Express MVC API boilerplate
│   └── package.json
├── firebase.json                # Firebase Hosting configuration
└── README.md
```

---

## 💻 Local Setup & Execution

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Production Build
```bash
npm run build
```
Generates production-optimized static assets inside `frontend/dist/`.

---

## 🌐 Live Deployment Guide

### Option 1: Firebase Hosting (Recommended)
This repository is pre-configured with `firebase.json` targeting `frontend/dist`:

```bash
# 1. Log in to Firebase CLI
npx firebase login

# 2. Deploy to hosting
npx firebase deploy --only hosting
```
Live URL: **`https://orkestrim-2k26.web.app`**

### Option 2: Vercel Instant Deploy
```bash
cd frontend
npx vercel --prod
```

### Option 3: GitHub Pages
Push `frontend/dist` to the `gh-pages` branch or configure GitHub Actions for static Vite deployment.

---

## ✏️ How to Use the Live In-App Editor

1. Open the live website in your browser.
2. Click the **"Live Edit"** button in the top navigation bar, or click the **"Edit"** badge on any arena card or modal.
3. Edit any details:
   - Event Title & Tagline
   - Netflix Theme & Quote
   - Event Timing & Campus Venue
   - Prize Pool & Rules list
   - Student Coordinators & Contact numbers
4. Click **"Save Changes"** — the website immediately updates without reloading!
5. Use **"Export JSON"** to download a backup file, or **"Import JSON"** to load pre-configured event rosters.

---

## 🏛️ Credits & Acknowledgments

- **Institution**: SRM Valliammai Engineering College (Autonomous), Kattankulathur, Tamil Nadu.
- **Event**: ORKESTRIM 2K26 National Level Technical Symposium.
- **Design Inspiration**: Netflix Streaming Platform UI/UX.

---

*© 2026 ORKESTRIM. All rights reserved.*
