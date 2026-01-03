# DANAAM Web Application - AI Context Document

## Project Overview
DANAAM is a B2B platform connecting **Contractors** and **Suppliers** in the construction industry. The platform enables contractors to create material requests and suppliers to submit bids.

**Status:** 100% TypeScript Migration Complete ✅

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Chakra UI** - Component library
- **React Router v6** - Routing
- **Framer Motion** - Animations
- **React Select** - Advanced select components
- **React i18next** - Internationalization (Arabic/English)
- **Axios** - HTTP client

### Build Tools
- **Vite** - Build tool and dev server
- **TypeScript 5** - Type safety

---

## Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── client.ts          # Axios instance with interceptors
│   ├── auth.ts            # Authentication endpoints
│   ├── profile.ts         # Profile endpoints (GET/PATCH)
│   └── registration.ts    # Registration endpoint
├── components/            # Reusable components
│   ├── Navigation.tsx     # Top navigation bar
│   ├── Sidebar.tsx        # Dashboard sidebar
│   ├── OTPDialog.tsx      # OTP verification modal
│   ├── StepIndicator.tsx  # Multi-step form indicator
│   └── LanguageSwitcher.tsx
├── context/
│   └── AuthContext.tsx    # Authentication state management
├── layouts/
│   └── DashboardLayout.tsx # Dashboard wrapper with sidebar
├── pages/
│   ├── LoginPage.tsx      # Login with userClass routing
│   ├── RegisterPage.tsx   # 4-step registration form
│   ├── ResetPasswordPage.tsx
│   ├── Profile.tsx        # View/edit user profile
│   ├── contractor/
│   │   ├── Dashboard.tsx
│   │   └── CreateRequest.tsx
│   └── supplier/
│       ├── Dashboard.tsx
│       └── BrowseRequests.tsx
├── types/
│   └── index.ts           # All TypeScript type definitions
├── data/
│   └── mockData.ts        # Mock data for development
├── theme.ts               # Chakra UI theme configuration
├── i18n.ts               # i18next configuration
└── App.tsx               # Main app with routes
```

---

## Key Features

### Authentication & Authorization
- **Email/Password Login** with OTP verification
- **User Classes**: Contractors or Suppliers
- **Role-Based Routing**: Users routed to appropriate dashboard based on `userClass`
- **JWT Tokens**: Access token + refresh token with automatic refresh
- **Persistent Login**: "Keep me logged in" functionality

### User Profiles
- **GET /profile** - Fetch current user profile
- **PATCH /profile** - Update firstName, lastName, city
- Available to both Contractors and Suppliers

### Registration Flow
- **4-Step Multi-Step Form**:
  1. Company Details (name, city, license, documents)
  2. Contact Information (name, email, phone)
  3. Credentials (password)
  4. Review & Submit
- **OTP Verification** at step 2
- **File Uploads**: Commercial license, tax license
- **React Select** for searchable city dropdown

### Dashboards
- **Contractor Dashboard**: View requests, bids, create new requests
- **Supplier Dashboard**: Browse requests, submit bids, track win rate

---

## API Endpoints

### Base URL
```typescript
VITE_API_BASE_URL=http://localhost:5000  // From .env
```

### Authentication
```
POST /auth/login
POST /auth/refresh-token
POST /auth/send-otp
POST /auth/verify-otp
POST /auth/reset-password
```

### Registration
```
POST /registration-requests  // Multipart form data
```

### Profile
```
GET  /profile                // Get current user profile
PATCH /profile               // Update firstName, lastName, city
```

---

## Authentication Flow

### Login Response
```typescript
{
  accessToken: string;
  refreshToken: string;
  userId: string;
  userClass: "Contractors or Suppliers";  // Maps to role
  firstName: string;
  lastName: string;
  companyName: string;
}
```

### User Class → Role Mapping
- `userClass: "Contractors or Suppliers"` → `role: "Contractor" | "Supplier"`
- Used for routing users to appropriate dashboard

### Routes by Role
```typescript
Contractor → /contractor/dashboard
Supplier   → /supplier/dashboard
```

---

## Important Type Definitions

### User & Auth
```typescript
interface User {
  id: string;
  role: 'Contractor' | 'Supplier';
  userClass: string;
  firstName: string;
  lastName: string;
  companyName: string;
  accessToken: string;
  refreshToken: string;
}
```

### Profile
```typescript
interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Contractor' | 'Supplier';
  userClass: string;
  enabled: boolean;
  phoneNumber: string;
  companyName: string;
  country: string;
  city: string;
  commercialLicenseNumber: string;
  website: string;
  createdAt: string;
  updatedAt: string | null;
}
```

---

## Key Files to Understand

### 1. AuthContext.tsx
- Manages authentication state
- Stores user in localStorage (if "keep logged in")
- Handles login, logout, token refresh
- Maps `userClass` to `role`

### 2. App.tsx
- Main routing configuration
- Protected routes based on authentication
- Role-based route access

### 3. api/client.ts
- Axios instance with base URL
- Request interceptor: Adds Authorization header
- Response interceptor: Handles 401, refreshes tokens

### 4. RegisterPage.tsx
- Complete 4-step registration form
- All form steps included (Step 1-4)
- OTP verification integration
- File uploads with type safety

---

## Development Notes

### TypeScript Migration
- **Status**: 100% Complete ✅
- **All files converted**: 24 TypeScript files
- **0 TypeScript errors**
- **All .jsx/.js files deleted**

### Brand Colors (theme.ts)
```typescript
colors: {
  brand: {
    primary: '#1e3a8a',      // Blue for Contractors
    'primary-dark': '#1e40af',
    accent: '#f59e0b',       // Amber for Suppliers
    'accent-dark': '#d97706',
  }
}
```

### i18n
- Primary language: Arabic (RTL support)
- Secondary: English
- Translation keys in `public/locales/`

---

## Common Tasks

### Adding New API Endpoint
1. Add function to appropriate file in `src/api/`
2. Define TypeScript types in `src/types/index.ts`
3. Use `apiClient` from `src/api/client.ts`

### Adding New Page
1. Create page in `src/pages/` (use .tsx extension)
2. Add route in `App.tsx`
3. Add navigation link in `Navigation.tsx` or `Sidebar.tsx`
4. Define TypeScript interfaces for page state/props

### Working with Forms
- Use Chakra UI form components
- Add TypeScript interfaces for form data
- Use `FormErrors` type for validation errors
- See `RegisterPage.tsx` for comprehensive example

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check
```

---

## Environment Variables

See `.env.example` for required variables:
```
VITE_API_BASE_URL=http://localhost:5000
```

---

## Notes for AI Assistants

1. **All files are TypeScript** - Do not create .jsx or .js files
2. **Registration form is complete** - RegisterPage.tsx has all 4 steps implemented
3. **Login routing is based on userClass** - Map userClass to role, then route accordingly
4. **Profile endpoints exist** - GET and PATCH /profile for viewing/editing
5. **Use existing types** - Check `src/types/index.ts` before creating new types
6. **Follow existing patterns** - Check similar pages/components for consistency
7. **Chakra UI components** - Use Chakra UI, avoid introducing new UI libraries
8. **Arabic-first design** - Consider RTL layout and Arabic translations

---

## Recent Changes (Last Updated: 2026-01-03)

- ✅ Completed 100% TypeScript migration
- ✅ Fixed registration.ts endpoint to `/registration-requests`
- ✅ Added complete RegisterPage.tsx with all 4 form steps
- ✅ Added profile viewing/editing functionality
- ✅ Implemented userClass-based routing for login
- ✅ Deleted all 23 JavaScript/JSX files

---

## Contact & Support

For questions or issues, refer to the project README.md or consult the development team.
