# LinkNuke Client

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Astro](https://img.shields.io/badge/Astro-5.18.0-FF5E5B?style=flat-square&logo=astro)](https://astro.build/)
[![Vite](https://img.shields.io/badge/Vite-7.0.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A modern, privacy-first secure file sharing platform built with React 19, Astro, and Tailwind CSS. LinkNuke enables users to create self-destructing links and share sensitive files that automatically delete after being viewed.

## 🌟 Features

### 🔐 Security & Privacy

- **Self-Destructing Links** - Auto-delete after single view or custom expiration
- **Privacy-First Design** - No persistent data storage for shared content
- **Secure Authentication** - JWT-based auth with Google OAuth integration
- **File Encryption** - Secure upload and transmission
- **View Limits** - Control how many times content can be accessed

### 📁 File Support

- **Text Messages** - Plain text with formatting
- **Images** - Multiple formats with Cloudinary optimization
- **Videos** - Up to 500MB video file support
- **Audio** - Audio file sharing and streaming
- **Documents** - PDF, Word, Excel, PowerPoint support

### 💰 Subscription System

- **Free Tier** - 5 links/month, basic features
- **Pro Plan** - 500 links/month, 3 custom domains
- **Lifetime Plan** - 9999 links, 10 custom domains
- **Real-time Usage Tracking** - Monitor limits and consumption

### 🎨 User Experience

- **Responsive Design** - Mobile-first approach with tablet optimization
- **Dark Mode** - System preference detection with manual toggle
- **Smooth Animations** - Framer Motion + GSAP animations
- **Real-time Updates** - Live link status and analytics
- **Drag & Drop** - Modern file upload interface
- **Progressive Web App** - PWA capabilities with offline support

## 🛠️ Technology Stack

### Core Framework

- **Astro 5.18.0** - Static site generator with island architecture
- **React 19.1.0** - Latest React with concurrent features
- **Vite 7.0.2** - Lightning-fast build tool and HMR
- **React Router 7.6.3** - Client-side routing with hash navigation

### UI & Styling

- **Tailwind CSS 3.4.1** - Utility-first CSS framework with custom animations
- **Radix UI** - Accessible component primitives
- **Headless UI 2.2.4** - Unstyled, fully accessible UI components
- **Framer Motion 12.23.0** - Production-ready motion library
- **Lucide React 0.525.0** - Beautiful icon library
- **@phosphor-icons/react 2.1.10** - Additional icon set

### State & Data Management

- **React Context API** - Global state management
- **Axios 1.11.0** - HTTP client with retry logic
- **JWT Decode 4.0.0** - Token parsing and validation
- **React Hot Toast 2.5.2** - Toast notifications

### Advanced Features

- **GSAP 3.13.0** - Professional animation library
- **Lenis 1.3.11** - Smooth scrolling experience
- **React Dropzone 14.3.8** - File upload with drag & drop
- **React Responsive 10.0.1** - Responsive design utilities
- **PostHog 1.258.5** - Product analytics and user tracking

## 📁 Project Structure

```
Client/astro/
├── src/
│   ├── components/
│   │   ├── Auth/                 # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── Dashboard/           # Main application interface
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Configurator.jsx
│   │   │   ├── SubscriptionManager.jsx
│   │   │   ├── GeneratedLinks.jsx
│   │   │   ├── NukedLinksTable.jsx
│   │   │   └── modals/           # File upload modals
│   │   │       ├── ImageModal.jsx
│   │   │       ├── VideoModal.jsx
│   │   │       ├── AudioModal.jsx
│   │   │       ├── TextModal.jsx
│   │   │       └── DocumentsModal.jsx
│   │   ├── Landing-page/        # Marketing pages
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Pricing.jsx
│   │   │   ├── FAQs.jsx
│   │   │   └── Footer.jsx
│   │   └── lib/                 # Utilities & API
│   │       ├── apiConfig.js
│   │       ├── analytics.js
│   │       ├── linkApi.js
│   │       └── cloudinary.js
│   ├── layouts/
│   │   └── MainLayout.astro     # Main page layout
│   ├── pages/
│   │   ├── index.astro          # Landing page
│   │   ├── pricing.astro        # Pricing page
│   │   ├── register.astro       # Registration
│   │   ├── login.astro          # Login
│   │   └── dashboard/
│   │       └── [...slug].astro  # Dashboard routes
│   └── styles/
│       └── index.css            # Global styles
├── public/                       # Static assets
├── astro.config.mjs             # Astro configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database (for backend)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd LinkNuke/Client/astro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create `.env` file in the root:

   ```env
   VITE_PUBLIC_API_URL=http://localhost:3001/api/v1
   VITE_PUBLIC_POSTHOG_KEY=your_posthog_key
   VITE_PUBLIC_PADDLE_TOKEN=your_paddle_token
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI

## 🔧 Configuration

### Astro Configuration (`astro.config.mjs`)

- Static site generation
- React integration
- Tailwind CSS integration
- Image optimization with Sharp
- Sitemap generation

### Tailwind Configuration (`tailwind.config.js`)

- Custom animations and keyframes
- Dark mode support
- Extended color palette
- Custom component styles

### Environment Variables

- `VITE_PUBLIC_API_URL` - Backend API URL
- `VITE_PUBLIC_POSTHOG_KEY` - Analytics key
- `VITE_PUBLIC_PADDLE_TOKEN` - Payment processor token

## 🎨 UI Components

### Authentication Flow

- **Login** - Email/password and Google OAuth
- **Register** - User registration with validation
- **Password Reset** - Secure password recovery
- **Email Verification** - Account verification system

### Dashboard Interface

- **Link Management** - Create, view, and manage links
- **File Upload** - Drag & drop file upload with progress
- **Usage Analytics** - Real-time usage statistics
- **Subscription Management** - Plan upgrades and billing

### File Upload Modals

- **Image Modal** - Image upload with preview
- **Video Modal** - Video upload with compression
- **Audio Modal** - Audio file upload
- **Document Modal** - PDF and document upload
- **Text Modal** - Text message creation

## 📊 Performance Features

### Optimization Techniques

- **Code Splitting** - Lazy loading components
- **Image Optimization** - Sharp image processing
- **Bundle Optimization** - Tree shaking and minification
- **Caching Strategies** - Browser and CDN caching
- **Prefetching** - Predictive resource loading

### Lighthouse Scores

- **Performance**: 98-100
- **Accessibility**: 96-98
- **Best Practices**: 85+
- **SEO**: 100

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens** - Secure stateless authentication
- **Google OAuth** - Social authentication
- **Session Management** - Secure cookie handling
- **Rate Limiting** - API abuse prevention

### Data Protection

- **Input Validation** - Client and server-side validation
- **XSS Protection** - Content Security Policy
- **HTTPS Enforcement** - Secure data transmission
- **Privacy by Design** - Minimal data collection

## 🌐 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup

- Configure environment variables in Vercel dashboard
- Set up custom domain
- Enable analytics and monitoring

### Build Configuration

- Static site generation
- Automatic optimization
- CDN distribution
- Edge caching

## 📱 Mobile Responsiveness

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- **Touch-friendly UI** - Optimized for touch interactions
- **Responsive Layouts** - Adaptive design patterns
- **Performance Optimization** - Mobile-first approach
- **PWA Support** - Installable web app

## 🎯 Key Features Deep Dive

### Self-Destructing Links

- Automatic deletion after viewing
- Custom expiration times (hours, days, weeks)
- View limits and access control
- Real-time status tracking

### File Upload System

- Drag & drop interface
- Multiple file format support
- Cloudinary integration for optimization
- Progress tracking and error handling

### Subscription Management

- Real-time subscription status
- Usage tracking and limits
- Paddle payment integration
- Plan comparison and upgrades

## 🔄 API Integration

### Backend Communication

- RESTful API integration
- Axios with retry logic
- Error handling and fallbacks
- Real-time data synchronization

### Third-party Services

- **Cloudinary** - File storage and optimization
- **Paddle** - Payment processing
- **PostHog** - Analytics and tracking
- **Google OAuth** - Authentication

## 🧪 Testing & Quality

### Code Quality

- **ESLint** - Code linting and formatting
- **TypeScript** - Type definitions
- **React Best Practices** - Hooks and patterns
- **Performance Monitoring** - Lighthouse audits

### Browser Compatibility

- **Chrome** - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Edge** - Full support

## 📈 Analytics & Monitoring

### User Analytics

- **PostHog Integration** - Event tracking
- **Page Views** - Navigation analytics
- **Feature Usage** - Product metrics
- **Conversion Tracking** - User journey analysis

### Performance Monitoring

- **Core Web Vitals** - Performance metrics
- **Error Tracking** - Application errors
- **Load Times** - Performance optimization
- **User Experience** - UX metrics

## 🤝 Contributing

### Development Guidelines

- Follow React and Astro best practices
- Use TypeScript for type safety
- Write meaningful commit messages
- Test across different browsers

### Code Style

- ESLint configuration for consistency
- Tailwind CSS for styling
- Component-based architecture
- Responsive design principles

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the FAQ section
- Contact the development team

---

**LinkNuke** - Secure file sharing, reimagined. 🚀
├── context/ # React context providers
├── lib/ # Utilities and API services
└── assets/ # Static resources

````

## Installation

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd linknuke/client
   npm install
````

3. **Environment Configuration**
   Create `.env` file:

   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/api/v1
   ```

4. **Development**
   ```bash
   npm run dev          # Start development server
   npm run build        # Production build
   npm run lint         # Code linting
   ```

## Configuration

### Build Optimization

- Code splitting with manual chunks for vendor libraries
- Terser minification with console/debugger removal
- Optimized asset handling

### Development Server

- Hot module replacement
- API proxy configuration for seamless backend integration

## Deployment

### Recommended Platforms

- **Vercel**: Automatic deployments with environment variable support
- **Netlify**: Static hosting with form handling
- **Railway**: Full-stack deployment

### Build Commands

```bash
npm run vercel-build    # Vercel-specific build
npm run build          # Standard production build
```

## Security

- Token-based authentication
- HTTPS enforcement
- Input validation
- CSRF protection
- Secure session management

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/name`)
5. Open pull request

## License

Proprietary software. All rights reserved.

## Support

For technical support or feature requests, please contact the development team.
