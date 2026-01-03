# Danaam Web Application

A modern web application for Danaam with user registration and authentication features. Built with React, Vite, Chakra UI, and i18next for internationalization.

## Features

- 🔐 **User Authentication**: Secure login with JWT tokens
- 📝 **Registration System**: Multi-step registration form for contractors and suppliers
- ✉️ **Email Verification**: OTP-based email verification
- 🌐 **Internationalization**: Full support for Arabic and English
- 🎨 **Modern UI**: Beautiful, responsive design with Chakra UI
- 📱 **Mobile Responsive**: Optimized for all screen sizes
- 🔄 **Auto Token Refresh**: Automatic token refresh on expiration

## Project Structure

```
danaam-webapp/
├── src/
│   ├── api/              # API client and service functions
│   │   ├── client.js     # Axios instance with interceptors
│   │   ├── auth.js       # Authentication API calls
│   │   └── registration.js # Registration API calls
│   ├── components/       # Reusable components
│   │   └── OTPDialog.jsx # OTP verification dialog
│   ├── pages/            # Application pages
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # Application entry point
│   ├── theme.js          # Chakra UI theme configuration
│   ├── i18n.js           # i18next configuration
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables example
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Access to the Danaam API

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd danaam-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your API base URL:
```env
VITE_API_BASE_URL=https://your-api-url.com
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Pages

### Login Page (`/login`)
- User authentication with email and password
- "Keep me logged in" option
- Password visibility toggle
- Link to registration page
- Link to forgot password page

### Registration Page (`/register`)
- Registration type selection (Contractor/Supplier)
- Multi-step form with progress tracking:
  1. **Company Details**: Company name, location, commercial license
  2. **Contact Information**: Personal details and contact info
  3. **Account Credentials**: Password setup
- Email verification via OTP
- File upload support for licenses
- Form validation and error handling

## API Integration

The application integrates with the following API endpoints:

### Authentication
- `POST /auth/user/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/otp` - Send OTP
- `POST /auth/otp/verify` - Verify OTP
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/password-reset` - Reset password

### Registration
- `POST /registration-requests` - Submit registration request

See `API_DOCUMENTATION.md` in the parent directory for detailed API documentation.

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **i18next** - Internationalization
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Theme & Design

The application uses a custom Chakra UI theme with:
- Primary color: `#1e3a8a` (Dark Blue)
- Accent color: `#f59e0b` (Amber)
- Cairo font family for Arabic support
- RTL (Right-to-Left) support
- Responsive breakpoints
- Custom gradients and blur effects

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `http://localhost:5000` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Copyright © 2025 Danaam. All rights reserved.
