<div align="center">

<img src="https://img.shields.io/badge/RoadSoS-Emergency%20Response-E03131?style=for-the-badge&logoColor=white" alt="RoadSoS"/>

# 🚨 RoadSoS
### *Help is One Tap Away*

**AI-Powered Emergency Response for Road Accidents**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL+PostGIS-15+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br/>

> Submitted to the **National Road Safety Hackathon 2026**
> Organised by CoERS · RBG Labs · IIT Madras
> Theme: **AI in Road Safety**

<br/>

[Features](#-features) · [Demo](#-demo) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Docs](#-api-reference) · [Team](#-team)

</div>

---

## 🩺 The Problem

India records **4,61,312 road accidents and 1,68,491 deaths every year** (MoRTH, 2022). That's one death every 3 minutes. The **Golden Hour** — the 60-minute window when emergency treatment is most effective — is routinely lost because victims and bystanders don't know:

- Where the nearest trauma centre is
- Which hospital has relevant specialties (burn, ortho, neuro)
- Which ambulance to call, and how to share their exact location
- What first aid to give while waiting

**RoadSoS** eliminates that delay. One tap. Under 10 seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📍 **GPS-Powered Finder** | Auto-detects location and fetches ranked nearby hospitals, ambulances, and police stations within 10km using Google Maps Places API |
| ⏱ **Live ETA Ranking** | Ranks facilities by real traffic ETA — not crow-flies distance — via Google Maps Distance Matrix API |
| 🆘 **One-Tap SOS** | Single tap simultaneously sends an SMS with live GPS link to all saved contacts and calls the nearest ambulance via Twilio |
| 🤖 **AI Triage Engine** | Describe the accident in text — LLM classifies severity (Critical / Serious / Minor), recommends call priority, and gives step-by-step first aid instructions |
| 🗺 **Turn-by-Turn Directions** | Directions to any selected facility using Google Maps Directions API |
| 📶 **Offline Mode** | Top 10 nearest hospitals cached via service worker on first load — works without internet |
| 🌐 **Hindi + English** | Triage engine responds in the same language the user writes in |
| 📱 **PWA — No Install** | Runs directly in the mobile browser; no app store required |

---

## 🎥 Demo

> **Hackathon demo city:** Bhopal, Madhya Pradesh (NH-12 highway corridor)

### Triage Engine in Action

**Input:**
```
"Truck overturned on highway. Driver is unconscious. Smoke visible."
```

**RoadSoS AI Output:**
```json
{
  "severity": "CRITICAL",
  "confidence": 0.97,
  "priority_order": ["ambulance", "police", "hospital"],
  "first_aid_steps": [
    "Keep clear — fire/explosion risk if smoke intensifies",
    "Call 108 immediately — report unconscious driver",
    "Do NOT move the driver — spinal injury possible",
    "Switch off engine if reachable without entering cab",
    "Note exact landmark for emergency services"
  ],
  "do_not_do": ["Do not move the driver if spinal injury suspected"],
  "call_now": "108",
  "reassurance_message": "Help is on the way. You are doing the right thing."
}
```

### Smart Ranking Output (Bhopal, CRITICAL severity)

| Rank | Facility | Type | ETA | Distance |
|---|---|---|---|---|
| 🥇 1 | AIIMS Bhopal | Trauma Centre | 6 min | 2.3 km |
| 🥈 2 | Hamidia Hospital | Govt. Hospital | 11 min | 4.1 km |
| 🥉 3 | Bansal Hospital | Private Hospital | 14 min | 5.8 km |

*Score = 55% ETA + 35% Distance + 10% Specialty bonus*

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│              React PWA (Vite + Tailwind)                         │
│   Geolocation API · Google Maps JS SDK · Service Worker          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS / REST
┌───────────────────────────▼─────────────────────────────────────┐
│                       API GATEWAY                                │
│              FastAPI · JWT Auth · Rate Limiting                  │
└──────┬──────────────────┬──────────────────┬────────────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼───────┐  ┌──────▼──────────┐
│  Location   │  │   SOS Engine   │  │  Offline Manager │
│  & Finder   │  │ Twilio SMS/Call│  │ Local-first cache│
│  GPS+Rank   │  │ asyncio gather │  │  Service Worker  │
└──────┬──────┘  └────────┬───────┘  └─────────────────┘
       │                  │
┌──────▼──────────────────▼──────────────────────────────────────┐
│                       AI SERVICES                               │
│    Triage Engine (LLM)  · Smart Ranking · First Aid Guidance    │
└──────┬──────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│   PostgreSQL + PostGIS    ·    Redis    ·    Firebase RT         │
│   (Hospitals & services)    (Cache)     (Live SOS events)       │
└──────┬──────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                     EXTERNAL APIs                                │
│  Google Maps API · Twilio · Claude / Gemini · NHA Registry      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂 Project Structure

```
roadsos/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app, CORS, router registration
│   │   ├── config.py                # Pydantic BaseSettings, env vars
│   │   ├── routers/
│   │   │   ├── nearby.py            # GET /api/nearby
│   │   │   ├── facility.py          # GET /api/facility/{place_id}
│   │   │   ├── sos.py               # POST /api/sos
│   │   │   └── triage.py            # POST /api/triage
│   │   ├── services/
│   │   │   ├── maps_service.py      # Places API + Distance Matrix + Directions
│   │   │   ├── ranking.py           # Weighted scoring formula
│   │   │   ├── sos_service.py       # Twilio SMS + call dispatch
│   │   │   ├── triage_service.py    # LLM triage + first aid
│   │   │   └── cache.py             # Redis wrapper (aioredis)
│   │   ├── models/
│   │   │   ├── facility.py          # Pydantic schemas
│   │   │   ├── sos.py
│   │   │   └── triage.py
│   │   └── db/
│   │       ├── database.py          # SQLAlchemy + PostGIS
│   │       ├── models.py            # ORM models (facilities, sos_events, contacts)
│   │       └── seed.py              # Hospital data seeder (Bhopal)
│   ├── alembic/                     # DB migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── Procfile
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── nearbyApi.js          # fetchNearby() with AbortController
    │   │   ├── sosApi.js             # triggerSOS() with retry
    │   │   └── triageApi.js          # sendTriageMessage() with streaming
    │   ├── hooks/
    │   │   ├── useGeolocation.js     # watchPosition + IP fallback
    │   │   └── useNearby.js          # fetches + caches nearby results
    │   ├── pages/
    │   │   ├── MapScreen.jsx         # Main map view + bottom sheet
    │   │   ├── FacilityList.jsx      # Filtered list with tabs
    │   │   ├── SOSScreen.jsx         # SOS status + actions
    │   │   └── TriageChat.jsx        # AI chat interface
    │   ├── components/
    │   │   ├── FacilityCard.jsx
    │   │   ├── SOSButton.jsx
    │   │   ├── TriageBubble.jsx
    │   │   └── OfflineBanner.jsx
    │   └── styles/
    │       └── tokens.css            # Color + spacing design tokens
    ├── public/
    │   └── sw.js                     # Service worker (offline cache)
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ with PostGIS extension
- Redis 7+
- Google Maps API key (Places, Distance Matrix, Directions APIs enabled)
- Twilio account (Account SID + Auth Token)
- Anthropic or Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/your-team/roadsos.git
cd roadsos
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/roadsos

# Redis
REDIS_URL=redis://localhost:6379

# Google Maps
GOOGLE_MAPS_API_KEY=your_key_here

# Twilio
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_FROM_NUMBER=+1XXXXXXXXXX

# LLM (choose one)
ANTHROPIC_API_KEY=your_key_here
# GOOGLE_GEMINI_API_KEY=your_key_here

# App
CORS_ORIGINS=http://localhost:5173
SECRET_KEY=your_secret_key_here
```

```bash
# Set up the database
psql -U postgres -c "CREATE DATABASE roadsos;"
psql -U postgres -d roadsos -c "CREATE EXTENSION postgis;"

# Run migrations
alembic upgrade head

# Seed hospital data (Bhopal demo data)
python -m app.db.seed

# Start the server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend

npm install

# Configure environment
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_MAPS_KEY=your_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 4. Verify everything works

```bash
# Health check
curl http://localhost:8000/health

# Test nearby endpoint
curl "http://localhost:8000/api/nearby?lat=23.2599&lng=77.4126"

# Test triage endpoint
curl -X POST http://localhost:8000/api/triage \
  -H "Content-Type: application/json" \
  -d '{"description": "Car accident, person unconscious", "lat": 23.2599, "lng": 77.4126}'
```

---

## 🐳 Docker (Recommended for Demo)

```bash
# Start all services (backend + postgres + redis)
docker-compose up --build

# Seed data
docker-compose exec backend python -m app.db.seed
```

`docker-compose.yml` is included in the repository root.

---

## 📡 API Reference

Base URL: `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs` (Swagger UI)

### `GET /api/nearby`

Fetch ranked nearby emergency services.

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `lat` | float | required | Latitude (-90 to 90) |
| `lng` | float | required | Longitude (-180 to 180) |
| `radius` | int | 10000 | Search radius in metres |

**Response:**
```json
{
  "facilities": [
    {
      "place_id": "ChIJ...",
      "name": "AIIMS Bhopal",
      "facility_type": "hospital",
      "address": "Saket Nagar, Bhopal",
      "phone": "+917552672727",
      "specialties": ["trauma", "ortho", "neuro"],
      "is_247": true,
      "distance_km": 2.3,
      "eta_minutes": 6,
      "score": 4.21,
      "directions_url": "https://maps.google.com/?daddr=..."
    }
  ],
  "cached": false,
  "timestamp": "2026-05-29T10:30:00Z"
}
```

---

### `POST /api/triage`

AI-powered accident severity assessment.

**Request body:**
```json
{
  "description": "Truck overturned on highway. Driver unconscious. Smoke visible.",
  "lat": 23.2599,
  "lng": 77.4126
}
```

**Response:**
```json
{
  "severity": "CRITICAL",
  "confidence": 0.97,
  "priority_order": ["ambulance", "police", "hospital"],
  "first_aid_steps": ["..."],
  "do_not_do": ["Do not move the driver"],
  "call_now": "108",
  "reassurance_message": "Help is on the way.",
  "nearest_facility": {
    "name": "AIIMS Bhopal",
    "phone": "+917552672727",
    "eta_minutes": 6
  }
}
```

---

### `POST /api/sos`

Trigger SOS broadcast to emergency contacts.

**Request body:**
```json
{
  "lat": 23.2599,
  "lng": 77.4126,
  "user_id": "device-fingerprint-abc123",
  "severity": "CRITICAL"
}
```

**Response:**
```json
{
  "sos_id": "uuid-here",
  "status": "sent",
  "contacts_alerted": 2,
  "nearest_facility": {
    "name": "AIIMS Bhopal",
    "phone": "+917552672727",
    "eta_minutes": 6
  },
  "message": "SOS sent to 2 contacts. Help is on the way."
}
```

---

### `POST /api/sos/{sos_id}/cancel`

Cancel an active SOS and notify contacts.

**Response:**
```json
{
  "sos_id": "uuid-here",
  "status": "cancelled",
  "message": "Cancellation SMS sent to 2 contacts."
}
```

---

### `GET /api/facility/{place_id}`

Get full details for a specific facility.

---

### `POST /api/contacts` · `GET /api/contacts` · `DELETE /api/contacts/{id}`

Manage emergency contacts for a user.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `GOOGLE_MAPS_API_KEY` | ✅ | Must have Places, Distance Matrix, Directions APIs enabled |
| `TWILIO_ACCOUNT_SID` | ✅ | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | ✅ | Twilio auth token |
| `TWILIO_FROM_NUMBER` | ✅ | Verified Twilio phone number (E.164 format) |
| `ANTHROPIC_API_KEY` | ✅* | Claude API key (*or use Gemini) |
| `GOOGLE_GEMINI_API_KEY` | ✅* | Gemini API key (*or use Anthropic) |
| `CORS_ORIGINS` | ✅ | Comma-separated list of allowed frontend origins |
| `SECRET_KEY` | ✅ | Random secret for JWT signing |

---

## 🧠 AI Triage Engine

The triage engine uses **Claude claude-sonnet-4-20250514** (or Gemini 1.5 Flash) with a carefully engineered system prompt that:

- Classifies severity into `CRITICAL`, `SERIOUS`, or `MINOR`
- Always defaults to `CRITICAL` if the description is ambiguous
- Responds in the user's language (Hindi or English)
- Returns structured JSON — no natural language prose
- Has a hard 8-second timeout (road emergencies can't wait)
- Supports streaming for sub-200ms first-byte response

### Smart Ranking Formula

```python
score = (0.55 × eta_minutes) + (0.35 × distance_km) + (0.10 × specialty_bonus)

# Specialty bonuses (lower = better rank)
trauma centre   → -3
government      → -1
open 24×7       → -1
closed facility → +8  (heavy penalty)
```

---

## 🌐 Deployment

### Railway (recommended for hackathon)

```bash
# Install Railway CLI
npm install -g @railway/cli

railway login
railway init
railway add postgresql redis
railway up
```

Set all environment variables in the Railway dashboard, then:

```bash
railway run python -m app.db.seed
```

### Render

1. Connect your GitHub repository
2. Set `Build Command`: `pip install -r requirements.txt && alembic upgrade head`
3. Set `Start Command`: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add a Postgres and Redis instance from the Render dashboard

---

## 📊 Performance Targets

| Metric | Target |
|---|---|
| GPS fix to results shown | < 3 seconds |
| AI triage first response | < 3 seconds (streaming) |
| SOS SMS delivery | < 5 seconds |
| Offline fallback load | < 200ms |
| Distance Matrix API cost | ~$0.005 per origin-destination pair |
| Typical SOS event cost | ~$0.13 (Places + Distance Matrix) |

---

## 🗺 Roadmap

- [x] Core GPS + Places + Distance Matrix integration
- [x] One-tap SOS with Twilio SMS broadcast
- [x] AI triage engine (CRITICAL / SERIOUS / MINOR)
- [x] Smart ranking with weighted scoring
- [x] Offline cache via service worker
- [x] Hindi + English language support
- [ ] Voice interface (STT → triage, hands-free SOS)
- [ ] Ambulance dispatcher companion app
- [ ] Firebase RT live SOS tracking (ambulance → en route → arrived)
- [ ] Blood bank integration
- [ ] Trained ML ranking model (distance + hospital load + historical data)
- [ ] Native Android / iOS app

---

## 👥 Team

| Member | Role |
|---|---|
| Nikhil Khushwaha | UX / Design Lead |
| Om Aide | Frontend Developer |
| Pranshu Namdeo | Backend Lead |
| Prasenjit Shinde | Backend Developer |
| Priyam Singh | AI / ML Engineer |

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- **CoERS, RBG Labs, IIT Madras** for organising the National Road Safety Hackathon 2026
- **Ministry of Road Transport & Highways (MoRTH)** for the accident statistics data
- **National Health Authority (NHA)** for the hospital registry dataset
- **Google Maps Platform** — Places, Distance Matrix, Directions APIs
- **Twilio** — SMS and voice call infrastructure


---

<div align="center">

**Built with ❤️ **

*Every second saved is a life closer to being saved.*

</div>