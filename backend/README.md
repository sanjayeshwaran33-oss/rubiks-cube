# Orkestrim 2K26 - Netflix Edition (Full Stack)

This repository contains the upgraded **Netflix-Themed Web Application** for **Orkestrim 2K26** (National Level Technical Symposium, SRM Valliammai Engineering College).

---

## 🚀 Quick Start Instructions

### 1. Frontend (Vite + React + Tailwind/CSS System)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

#### Features:
- **Cinematic Billboard**: High-budget movie trailer atmosphere, live 24 OCT 2026 countdown ticker, sound SFX toggle.
- **Top 5 Outline Numbers**: Iconic Netflix-style giant metallic numbered cards.
- **Netflix Movie Posters**: AI-generated high-res cinematic original posters for *Paper Spark*, *Brainiac's Battle*, *Techno Connect*, *Techno Ads*, and *Techno Treasure*.
- **Episode Guide (Schedule)**: Binge the symposium schedule episode-by-episode with thumbnails, timestamps, and venues.
- **Craft Services & Transit**: Food menu, SRM VEC bus fleets, and 1 Gbps campus Wi-Fi details.
- **Interactive Modals**: Full Netflix details view with rules, cash prize specs, student coordinators, and registration desk.
- **Web Audio "Ta-Dum" Synthesizer**: Zero-dependency authentic Netflix intro chime & micro-interactions.

---

### 2. Backend (Node.js + Express + Mongoose)
```bash
cd backend
npm install
npm run dev
```
Runs at **`http://localhost:5000/api`**.

#### Endpoints:
- `POST /api/users/register` - Create delegate account
- `POST /api/users/login` - Authenticate delegate
- `GET /api/posts` - Fetch all symposium arenas
- `POST /api/posts` - Submit/pitch custom arena
