# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev             # Development server with hot-reload on port 3000
npm run build           # Production build
npm run build:dev       # Development build (keeps logs for debugging)
npm run start           # Start production server
npm run lint            # Check code with ESLint
npm test               # Run all tests
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Generate test coverage report
```

### reCAPTCHA Testing
```bash
npm run verify-recaptcha   # Verify reCAPTCHA configuration
npm run test-recaptcha     # Interactive reCAPTCHA testing (Windows PowerShell)
```

### Running a Single Test
```bash
npm test -- card-utils.test.ts           # Run specific test file
npm test -- --testNamePattern="Luhn"     # Run tests matching pattern
npm test -- src/components/customerBill  # Run tests in specific directory
```

### Docker
```bash
docker build -t pay-emsula .                    # Build Docker image
docker-compose up                               # Run with docker-compose
docker run -p 3001:3000 pay-emsula             # Run container
```

### Git and Pull Requests
```bash
# Creating PRs (uses gh CLI)
gh pr create --title "title" --body "description"

# Commit with conventional commits format
git commit -m "feat: add payment validation"
git commit -m "fix: correct date formatting" 
git commit -m "test: add card validation tests"
```

## High-Level Architecture

PayEmsula is a **Next.js 15** payment processing application for Emsula customers to manage credit line payments. The application implements advanced security features and follows modern React patterns.

### Core Architecture Patterns

1. **Server-Side Security**
   - All sensitive operations happen in server functions (`src/server/`)
   - RSA-OAEP encryption for card data before transmission
   - JWT validation with expiration checks
   - No sensitive data stored in client state

2. **Multi-Step Form Pattern**
   - Form state managed by `usePaymentForm` hook with sessionStorage persistence
   - Step-by-step validation prevents advancing with invalid data
   - Data flows: Personal Info → Card Details → 3DS Authentication → Confirmation

3. **Global State Management**
   - Alert system uses React Context (`AlertProvider`) for app-wide notifications
   - No prop drilling - components use hooks to access global state
   - Centralized error handling through `ResTypeError` pattern

4. **3D Secure Integration**
   - Modal-based iframe isolation for 3DS authentication
   - Event-based communication between iframe and parent window
   - Automatic fallback and timeout handling

### Critical Security Points

1. **reCAPTCHA Enterprise v3**
   - Integrated at two critical points: step transitions and payment submission
   - Server-side verification with Google Cloud SDK
   - Score threshold of 0.5 (configurable via env vars)

2. **Data Encryption Flow**
   ```
   Client → Collect Data → RSA Encrypt → Server → Decrypt → Payment Gateway
   ```

3. **Error Handling Pattern**
   - All server functions return `Promise<SuccessType | ResTypeError>`
   - Type guard `isErrorResponse()` for safe error detection
   - Errors automatically trigger global alerts

### Key Integration Points

1. **Payment Processing (`postData`)**
   - Entry point: `src/server/postData.ts`
   - Handles encryption, API calls, and 3DS responses
   - Returns either 3DS HTML or error

2. **PDF Receipt Generation**
   - Component: `src/components/customerBill.tsx`
   - Uses dom-to-image for HTML capture, jsPDF for document creation
   - Auto-downloads on successful payment

3. **Form Validation**
   - Luhn algorithm for card numbers
   - Card type detection (Visa, MC, Amex)
   - Real-time validation with visual feedback

### Environment Variables

Critical variables that must be set:
- `API_BASE_URL` - Backend API endpoint
- `API_KEY` - API authentication key
- `RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- `RECAPTCHA_PROJECT_ID` - Google Cloud project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Path to Google Cloud service account key

### Testing Strategy

- **Unit Tests**: Components, hooks, utilities (100% passing)
- **Integration Tests**: Server functions with mocked APIs
- **Key Test Files**:
  - `customerBill.test.tsx` - PDF generation (13 tests)
  - `usePaymentForm.test.tsx` - Form state management
  - `card-utils.test.ts` - Card validation logic

### Common Development Tasks

1. **Adding a new form field**:
   - Update types in `src/types/types.ts`
   - Add field to `usePaymentForm` hook
   - Update validation in respective step component
   - Add tests for new validation logic

2. **Modifying payment flow**:
   - Start with `usePaymentProcess` hook
   - Update `postData` for server-side changes
   - Test 3DS flow with modal behavior

3. **Debugging reCAPTCHA**:
   - Check browser console for emoji-prefixed logs
   - Use testing panel in development
   - Verify Google Cloud credentials are set

### Production Considerations

- Console.log statements are automatically removed in production builds
- The app uses standalone output for optimal Docker deployment
- Health check endpoint at `/api/health`
- All alerts use the global system - no native `alert()` calls