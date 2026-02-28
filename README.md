# LinkNuke Client

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A modern React application for secure file sharing and self-destructing links. Built with React 19, Vite, and Tailwind CSS.

## Features

- **Self-Destructing Links**: Create links that automatically delete after single use
- **Secure File Sharing**: Privacy-first file upload and sharing capabilities
- **JWT Authentication**: Token-based user authentication with Google OAuth
- **Responsive Design**: Mobile-optimized interface with dark mode support
- **Real-time Analytics**: Dashboard with usage tracking and subscription management

## Technology Stack

### Core Framework

- **React 19** - UI framework with concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Headless UI** - Unstyled UI components
- **Framer Motion** - Animation library

### State & Data

- **React Context** - State management
- **Axios** - HTTP client with retry logic
- **JWT Decode** - Token handling

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Type definitions (partial)

## Project Structure

```
src/
├── Auth/                 # Authentication components
├── Dashboard/           # Main application interface
├── Landing-page/        # Marketing pages
├── components/          # Reusable UI components
├── context/            # React context providers
├── lib/                # Utilities and API services
└── assets/             # Static resources
```

## Installation

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd linknuke/client
   npm install
   ```

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
