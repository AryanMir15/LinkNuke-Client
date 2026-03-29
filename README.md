# LinkNuke Client

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Astro](https://img.shields.io/badge/Astro-5.18.0-FF5E5B?style=flat-square&logo=astro)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

Secure file sharing platform with self-destructing links. Built with React 19, Astro, and Tailwind CSS.

## 🔗 LIVE APP

https://linknuke.whynotship.me

## 🌟 Core Features

- **Self-Destructing Links** - Auto-delete after viewing
- **Secure File Sharing** - Images, videos, documents, audio
- **Privacy-First** - No persistent data storage
- **Subscription System** - Free/Pro/Lifetime tiers
- **Real-time Analytics** - Track link usage and limits

## 🛠️ Tech Stack

- **Frontend**: React 19, Astro 5.18.0, Tailwind CSS 3.4.1
- **Build Tools**: Vite 7.0.2, React Router 7.6.3
- **UI**: Lucide Icons, Framer Motion, Headless UI
- **Analytics**: PostHog, custom tracking
- **Payments**: Paddle integration

## 📁 Project Structure

```
Client/astro/
├── src/
│   ├── components/          # React components
│   │   ├── Auth/           # Login, register, OAuth
│   │   ├── Dashboard/      # Main app interface
│   │   └── Landing-page/   # Marketing pages
│   ├── pages/              # Astro pages
│   ├── layouts/            # Page layouts
│   └── lib/                # API & utilities
├── public/                 # Static assets
└── astro.config.mjs       # Astro config
```

## ⚡ Technical Highlights

- **JWT Authentication** with Google OAuth
- **Paddle Payment System** with subscription management
- **Cloudinary Integration** for file optimization
- **Progressive Web App** with offline support
- **Real-time Updates** via WebSocket connections

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📄 License

Proprietary software. All rights reserved.
