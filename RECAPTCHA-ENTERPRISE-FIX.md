# 🔧 reCAPTCHA Enterprise Token Generation Fix

## Problem
The error "Failed to generate token after all attempts" occurred because the `react-google-recaptcha-v3` library was trying to use standard reCAPTCHA v3 API with an Enterprise site key.

## Root Cause
- **Site Key Type**: `6LexOHQrAAAAACFatQdoK4mhPuX-Zuyby9TW0Sgb` is a reCAPTCHA Enterprise key
- **Library Used**: `react-google-recaptcha-v3` only supports standard v3, not Enterprise
- **API Mismatch**: Enterprise uses `grecaptcha.enterprise.execute()` instead of `grecaptcha.execute()`

## Solution Implemented

### 1. Created Custom Enterprise Wrapper
**File**: `src/components/recaptcha-enterprise-wrapper.tsx`

This custom implementation:
- Loads the Enterprise script directly from Google
- Provides a React Context for the reCAPTCHA functionality
- Implements the Enterprise-specific API calls
- Handles proper initialization and ready states

### 2. Updated Application Layout
**File**: `src/app/layout.tsx`
- Replaced `RecaptchaWrapper` with `RecaptchaEnterpriseProvider`
- Maintains the same provider structure for the rest of the app

### 3. Modified Hook Import
**File**: `src/hooks/useRecaptcha.ts`
- Updated to import from the custom Enterprise wrapper
- No other changes needed - the API remains the same

## Key Differences: Standard v3 vs Enterprise

| Feature | Standard v3 | Enterprise |
|---------|------------|------------|
| Script URL | `/recaptcha/api.js` | `/recaptcha/enterprise.js` |
| Execute Method | `grecaptcha.execute()` | `grecaptcha.enterprise.execute()` |
| Site Key Format | Standard key | Enterprise key |
| Verification | Basic bot detection | Advanced risk analysis |

## Testing
After implementing these changes:
1. Navigate to http://localhost:3000/pago
2. Open browser console (F12)
3. Look for "✅ reCAPTCHA Enterprise ready" message
4. Click test buttons in the floating panel
5. Tokens should now generate successfully

## Benefits
- ✅ Proper Enterprise API usage
- ✅ No dependency on incompatible libraries
- ✅ Full control over the implementation
- ✅ Better error handling and debugging
- ✅ Ready for production use

## Note
The `react-google-recaptcha-v3` package is still installed but no longer used. It can be removed if desired:
```bash
npm uninstall react-google-recaptcha-v3
```
However, keeping it won't cause any issues since we're not importing it anymore.