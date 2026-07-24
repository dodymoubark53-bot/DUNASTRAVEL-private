# 🐪 Dunas Travel (dunas-travel2026.com)

[![React 19](https://img.shields.io/badge/React-19.2-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-9a3412?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS 3](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Express 5](https://img.shields.io/badge/Express-5.2-lightgrey?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb&logoColor=white)](https://mongoosejs.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-ff69b4?logo=framer&logoColor=white)](https://framer.com/motion)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-82c341?logo=greensock&logoColor=white)](https://gsap.com)
[![i18n Enabled](https://img.shields.io/badge/i18n-5_Languages-orange?logo=i18next&logoColor=white)](https://www.i18next.com)

---

## 📁 1. Project Overview

**Dunas Travel** is a premium, state-of-the-art travel agency website designed to deliver highly immersive and luxurious digital experiences for international travelers. Specializing in bespoke guided vacations, Nile Cruises, honeymoon escapes, and religious tours, the website targets travelers seeking to discover the wonders of:
*   **Egypt** 🇪🇬
*   **Turkey** 🇹🇷
*   **Jordan** 🇯🇴
*   **Dubai (UAE)** 🇦🇪
*   **Tunisia** 🇹🇳
*   **Morocco** 🇲🇦
*   **Greece** 🇬🇷
*   **The Holy Land** 🇵🇸/🇮🇱

The system is designed with a premium pharaonic aesthetic, utilizing deep navy and warm gold palettes, rich background gradients, and smooth scroll animations. It features full multi-language localization across 5 major languages and embeds unique interactive features such as an offline-resilient flight simulator itinerary map and an AI-driven hieroglyphic name translator.

---

## 🛠️ 2. Tech Stack & Programming Languages

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Languages** | JavaScript (ESM & CJS), HTML5, Vanilla CSS, PowerShell, Python | Frontend development, backend APIs, data compilation, and asset optimization |
| **Frontend Framework** | **React 19** | Dynamic single-page application structure with lazy-loaded code splitting |
| **Backend Framework** | **Node.js + Express 5** | RESTful routing, authentication pipelines, and conversational AI chatbots |
| **Database ODM** | **MongoDB + Mongoose 8** | Persistent schemas for bookings, user sessions, FAQs, and tours |
| **Styling** | **Tailwind CSS v3 + PostCSS** | Utility classes and custom responsive layout grids |
| **Animations** | **Framer Motion + GSAP** | Cinematic loaders, staggered lists, sliding indicators, and floating elements |
| **State Management** | **React Context API** | Global state for Authentication, Theme (Dark/Light), Currencies, and Chat sessions |
| **Routing** | **React Router DOM v7** | Nested page navigation, route guards, and dynamic parameter parsing |
| **Localization** | **i18next + react-i18next** | Multi-lingual translation dictionaries and language detection |
| **Map Rendering** | **Leaflet + React-Leaflet** | Interactive route mapping and geographic markers |
| **Build Tools** | **Vite 8** | High-performance bundling and Hot Module Replacement (HMR) |
| **Deployment / Hosting** | **Vercel** | Serverless function overrides and unified static + API deployments |

---

## 🗂️ 3. Project Structure

Below is the directory tree of the Dunas Travel project, outlining key files and components:

```bash
DUNAS TRAVEL/
├── api/
│   └── index.js                   # Vercel serverless function entry point
├── backend/
│   ├── .env                       # Backend local configuration
│   └── server.cjs                 # Legacy / alternative server wrapper
├── server/
│   ├── middleware/
│   │   └── auth.js                # JWT protection middleware
│   ├── models/
│   │   ├── Booking.js             # Mongoose booking & inquiry schemas
│   │   ├── ChatSession.js         # Mongoose chat history schema
│   │   ├── CompanyInfo.js         # Mongoose policy details (Cancellation, Visa)
│   │   ├── Faq.js                 # Mongoose FAQ schema
│   │   ├── Tour.js                # Mongoose tour/program package schema
│   │   └── User.js                # Mongoose admin authentication schema
│   ├── routes/
│   │   ├── auth.js                # User signup, login, and authorization routes
│   │   ├── booking.js             # Booking, inquiry, and invoice retrieve routes
│   │   ├── chat.js                # Conversational chatbot handler route
│   │   └── search.js              # Fuzzy search, filter, and recommendation routes
│   ├── services/
│   │   ├── chatbotService.js      # Jaider Conversational AI logic & NLP mapping
│   │   └── searchService.js       # MongoDB text indexes and search services
│   ├── utils/
│   │   ├── memoryDb.js            # Memory cache & JSON fallback if MongoDB is offline
│   │   ├── nlpHelper.js           # Egyptian colloquial Arabic NLP mapper
│   │   └── seeder.js              # Auto-seeder database script (FAQs, tours, policies)
│   ├── .env                       # Server-specific environment configuration
│   └── server.js                  # Main Express dev server entry point
├── src/
│   ├── animations/
│   │   └── variants.js            # Framer Motion transitions (stagger, fade, lifts)
│   ├── assets/                    # Static image/icon assets
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginModal.jsx     # Admin control authentication modal
│   │   ├── booking/
│   │   │   ├── AdvancedBooking.jsx# Comprehensive booking config & pricing calculator
│   │   │   ├── BookingForm.jsx    # Standard customer reservation form
│   │   │   ├── InquiryForm.jsx    # Simple quick contact inquiry
│   │   │   ├── InvoiceModal.jsx   # Printable Invoice UI generator
│   │   │   └── TransportationForm.jsx # Private chauffeur & vehicle booking form
│   │   ├── contact/
│   │   │   └── ContactForms.jsx   # Multilingual multi-purpose contact interfaces
│   │   ├── home/
│   │   │   ├── HieroglyphicName.jsx # Pharaonic Name Hieroglyphic Translator Component
│   │   │   └── InteractiveJourneyMap.jsx # Leaflet + Bezier Curve flight map simulator
│   │   ├── layout/
│   │   │   ├── FloatingContact.jsx# Sticky quick contact bubble
│   │   │   ├── Footer.jsx         # Custom brand footer with social hooks
│   │   │   ├── Layout.jsx         # Global routing layout wrapper
│   │   │   └── Navbar.jsx         # Multi-lingual responsive header menu
│   │   ├── tour/
│   │   │   ├── IncludedNotIncluded.jsx # Visual grid showing package inclusions
│   │   │   ├── ReviewsMap.jsx     # Interactive customer reviews locator
│   │   │   ├── RouteMap.jsx       # Specific itinerary path visualizer
│   │   │   └── TourCard.jsx       # Custom card component showing tour stats
│   │   ├── ui/
│   │   │   ├── BackgroundMusic.jsx# Immersive ambient sound controller toggle
│   │   │   ├── Button.jsx         # Shared styled button
│   │   │   ├── CurrencySelector.jsx # Global tour currency converter
│   │   │   ├── JaiderChatWindow.jsx # AI assistant sticky modal
│   │   │   ├── Logo.jsx           # SVG vector logo component
│   │   │   └── TiT0Chat.jsx       # Fast chat support widget
│   │   ├── TripsList.jsx          # Trips query displayer
│   │   └── TripsManager.jsx       # Admin dashboard for updating trips
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT admin session validation
│   │   ├── CurrencyContext.jsx    # Exchange rates (USD, EUR, BRL, GBP, EGP)
│   │   ├── JaiderChatContext.jsx  # Bot state, chat history, and suggestions
│   │   └── ThemeContext.jsx       # Light / Dark mode toggles
│   ├── data/
│   │   ├── blogs.js               # Static blogs data database (~285KB)
│   │   ├── journeys_routes_data.js # GPS coordinate logs for flight simulator paths
│   │   ├── multiCountryTours.js   # Multi-country tours database
│   │   ├── programs.json          # Main nested programs database (~1MB)
│   │   ├── tours.js               # Classic tours database (~48KB)
│   │   └── services.js            # Extra services (Nile Cruises, Day trips)
│   ├── hooks/
│   │   ├── useDubaiPrograms.js    # Data filters for UAE programs
│   │   ├── useJordanPrograms.js   # Data filters for Jordan programs
│   │   ├── useMoroccoPrograms.js  # Data filters for Morocco programs
│   │   ├── useScrollAnimations.js # Scroll-triggered transition hooks
│   │   └── useTurkeyPrograms.js   # Data filters for Turkey programs
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── ar.json            # Arabic localizations (~1.4MB)
│   │   │   ├── en.json            # English localizations (~1.1MB)
│   │   │   ├── es.json            # Spanish localizations (~1.1MB)
│   │   │   ├── it.json            # Italian localizations (~1.1MB)
│   │   │   └── pt.json            # Portuguese localizations (~1.1MB)
│   │   └── index.js               # i18next configuration entry point
│   ├── App.css                    # Component specific styles
│   ├── App.jsx                    # App routing definitions and cinematic loader
│   ├── index.css                  # Core CSS styling, gradients, and custom classes
│   └── main.jsx                   # React bootloader and context bindings
├── translations/                  # Extra honeymoon/blog raw translations
├── vercel.json                    # Routing and rewrites for Vercel deployment
├── tailwind.config.js             # Tailwind customization grid
└── vite.config.js                 # Vite compiler settings
```

---

## ✨ 4. Key Features & Capabilities

### 🌍 1. Immersive Multi-Language Engine
*   **Fully Translated UI & Database**: Houses massive (~1.2MB each) translation dictionaries translating all elements, static cards, titles, headers, footers, itineraries, inclusions, and blog items across **Arabic, English, Spanish, Italian, and Portuguese**.
*   **Automatic Direction Toggle**: Dynamically switches the document layout direction (`dir="rtl"` vs `dir="ltr"`) and flips icons, paddings, borders, flex alignments, and navigation layouts when Arabic is selected.

### ✈️ 2. Interactive Flight Simulator Route Map
*   Uses **Leaflet Map Tiles** customized to a clean English layout.
*   Plots tour itineraries on the map using geographic GPS coordinate points.
*   **Bezier Flight Paths**: Calculates curvature between stops and runs a smooth CSS/requestAnimationFrame micro-animation simulating a plane flying from one day’s destination to another.
*   Includes a sidebar timeline allowing users to select days and automatically pan the map to the respective cities with animated popups.

### 𓁹 3. Ancient Egyptian Hieroglyphic Translator
*   An interactive papyrus-themed component where visitors enter their names in English, Spanish, Italian, or Portuguese.
*   Invokes an Anthropic Claude API message pipeline to phonetically translate names and wrap them in a royal cartouche (`𓍹` name `𓍺`) using Unicode Egyptian Hieroglyphic block values `U+13000–U+1342F`.
*   Includes an **offline local phonetic mapper** fallback if the external API key is missing or encounters CORS blockages.

### 💬 4. "Jaider" Conversational AI Chatbot
*   **Egyptian Colloquial Support**: Detects and translates Egyptian Arabic colloquial statements (e.g. *"بكام"* or *"عايز أسافر مصر"*) into Modern Standard Arabic for query processing.
*   **Stateful Context Awareness**: Tracks user preferences (destination, budget, duration, and last viewed tour slug) to answer context-aware follow-up questions (e.g. *"How much is it?"* or *"What is included in the hotels?"*).
*   **MongoDB + Memory Resilience**: Auto-switches to memory caches and JSON mock databases if MongoDB experiences connectivity faults.

### 💵 5. Global Currency Exchange
*   Supports converting prices in real-time between **USD, EUR, GBP, BRL (Brazilian Real), and EGP (Egyptian Pound)** across all tours and booking pages using custom global contexts.

### 🧾 6. Automated Invoice Generation
*   Creates customized printable invoice modals from confirmed bookings containing unique serial numbers (`INV-YYYYMM-RANDOM`), date logs, pax parameters, tax rates, and base price formulas.

### 🎵 7. Background Ambient Music
*   Embeds a premium custom music audio component to play atmospheric traveling tunes to enhance user immersion, with a persistent audio-level slider and mute toggle.

---

## ⚙️ 5. How to Run the Project

### 📋 Prerequisites
*   **Node.js**: v18.0.0 or higher is required.
*   **MongoDB**: A running instance (local or Cloud Atlas cluster URI).
*   **API Credentials**: (Optional) Anthropic API key or OpenAI key for translations/chatbot services.

### 🚀 Step-by-Step Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/dodymoubark53-bot/dunas-travel2026.com.git
    cd dunas-travel2026.com
    ```

2.  **Install Frontend & Backend Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**:
    Create a `.env` file in the root directory (and a matching `.env` inside the `server/` directory if needed):
    ```env
    MONGO_URI=mongodb+srv://yourUsername:yourPassword@yourCluster.mongodb.net/dunas_travel
    PORT=5000
    JWT_SECRET=your_super_secret_jwt_hash_key
    ANTHROPIC_API_KEY=your_anthropic_secret_key # For Hieroglyphic translator API
    OPENAI_API_KEY=your_openai_secret_key # Optional: For chat completion
    ```

4.  **Start Development Environment**:
    Run the dev command, which executes the Express backend server and the Vite dev server concurrently:
    ```bash
    npm run dev
    ```

5.  **Build and Preview Production Bundle**:
    Validate build scripts and run preview hosts locally:
    ```bash
    npm run build
    npm run preview
    ```

---

## 📦 6. Dependencies

The main project dependencies parsed from `package.json` include:

### Core & Frontend UI
*   `react` & `react-dom` (^19.2.6): The latest React core rendering libraries.
*   `react-router-dom` (^7.15.1): Declares standard nested and layout routes.
*   `framer-motion` (^12.38.0) & `gsap` (^3.15.0): High-fidelity interactive UI transitions and loading animations.
*   `react-icons` (^5.6.0): Comprehensive icon suites (FontAwesome, Material Icons).
*   `react-helmet-async` (^3.0.0): Handles metadata, dynamic titles, and page description SEO injections.

### Localization & Maps
*   `i18next` (^26.2.0) & `react-i18next` (^17.0.8): Localization triggers.
*   `i18next-browser-languagedetector` (^8.2.1): Detects visitor browser locale preferences.
*   `leaflet` (^1.9.4) & `react-leaflet` (^5.0.0): Visualizes map tiles, polylines, and popups.

### Backend & Databases
*   `express` (^5.2.1): Backend API framework.
*   `mongoose` (^8.3.3): MongoDB ODM client.
*   `bcryptjs` (^2.4.3) & `jsonwebtoken` (^9.0.2): Hashes admin passwords and signs auth tokens.
*   `cors` (^2.8.6): Controls Cross-Origin Resource sharing between dev servers.
*   `dotenv` (^16.6.1): Inject configuration values.

### Utility & DevDependencies
*   `tailwindcss` (^3.4.19), `autoprefixer` (^10.5.0), & `postcss` (^8.5.14): Cascading style compilations.
*   `sharp` (^0.35.3) & `ffmpeg-static` (^5.3.0): Compresses media assets, images, and maps.
*   `vite` (^8.0.12): Modern frontend builder.
*   `eslint` (^10.3.0): Lints script files.

---

## 🌐 7. Pages & Routes

| Path | Component | Description |
| :--- | :--- | :--- |
| `/` | `Home.jsx` | Main landing page featuring featured packages, client reviews, interactive map, music player, and the Hieroglyphic name translator |
| `/media-gallery` | `MediaGallery.jsx` | High-fidelity horizontal-scrolling image and video gallery |
| `/about` | `About.jsx` | Brand story, company history, and key milestones since 2010 |
| `/blogs` | `Blogs.jsx` | Overview list of travel tips, destination guides, and articles |
| `/blogs/:slug` | `BlogDetails.jsx` | Individual article readers with auto-translation fallbacks |
| `/services` | `Services.jsx` | General services catalog (cruises, guides, packages) |
| `/services/hotels/:slug` | `HotelDetails.jsx` | Lists hotel details, amenities, ratings, and room options |
| `/services/hotels/:hSlug/:rSlug` | `RoomDetails.jsx` | Explores specific suite properties and pricing |
| `/destinations` | `Destinations.jsx` | Complete view of covered geographical locations |
| `/destinations/:region` | `Egipto.jsx`, `Turquia.jsx`, etc. | Regional landing pages detailing destination history and dedicated tours |
| `/tours/:slug` | `TourDetails.jsx` | Comprehensive itineraries, day-by-day outlines, maps, inclusions, and booking triggers |
| `/programs/religious` | `ReligiousTours.jsx` | Special spiritual tour itineraries |
| `/programs/multi-country` | `MultiCountryTours.jsx` | Comprehensive multi-nation tour bundles |
| `/programs/honeymooners` | `Honeymooners.jsx` | Romantic honeymoon package options |
| `/transportation` | `Transportation.jsx` | Private transit options and chauffeur scheduling forms |
| `/tailor-a-tour` | `TailorTour.jsx` | Personalized booking calculator allowing customized traveler itineraries |
| `/contact` | `Contact.jsx` | Support ticket form and agency location pins |
| `/faq` | `FAQ.jsx` | Accordion list of frequently asked queries |
| `/invoice` | `Invoice.jsx` | Generates printable booking invoices |

---

## 📝 8. Notes & Important Information

### 🔄 Self-Healing DB Seeder
*   The backend Express server has an **auto-seeding script** (`seeder.js`) that runs whenever the database connection is initialized.
*   It automatically parses `locales` directories, extracts FAQ keys, formats company policies in 5 languages, compiles JS databases, and seeds them into MongoDB collections.
*   If it detects obsolete mock values (e.g. old company founding dates), it wipes old tables and performs a clean self-healing database upgrade.

### ⚡ Build Optimization
*   Heavy media elements and raw JS tour files are compressed and formatted.
*   Root optimization scripts (`optimize-assets.js`, `optimize_images.py`) utilize packages like `sharp` and `ffmpeg` to reduce picture and video footprints for fast global delivery.

### 🤖 Localization Scripts
*   The translation pipelines in the root directory (`run_translation_pipeline.js`, `_add_proper_translations.mjs`) use Google Translate endpoints to parse untranslated key-value logs in `locales` JSON documents and batch-insert localized translations. This reduces manual mapping overhead for developer additions.
