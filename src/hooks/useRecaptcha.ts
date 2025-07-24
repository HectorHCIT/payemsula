import { useGoogleReCaptcha } from '@/components/recaptcha-enterprise-wrapper';
import { useCallback, useState } from 'react';
import { logRecaptcha } from '@/lib/logger';

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  reason?: string;
  formData?: Record<string, unknown>;
}

interface VerificationEndpoint {
  url: string;
  name: string;
  isLocal: boolean;
}

export const useRecaptchaVerification = () => {
  const { executeRecaptcha, isLoaded } = useGoogleReCaptcha();
  const [isSimulating, setIsSimulating] = useState(false);

  const getVerificationEndpoint = (): VerificationEndpoint => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_RECAPTCHA_URL;
    const mode = process.env.NEXT_PUBLIC_RECAPTCHA_MODE || 'development';
    
    // En modo production, solo usar el backend .NET
    if (mode === 'production' && backendUrl && !backendUrl.includes('tu-backend.com')) {
      return {
        url: backendUrl,
        name: '.NET Backend',
        isLocal: false
      };
    }
    
    // En desarrollo, preferir backend .NET pero permitir fallback
    if (backendUrl && !backendUrl.includes('tu-backend.com')) {
      return {
        url: backendUrl,
        name: '.NET Backend',
        isLocal: false
      };
    }
    
    // Fallback a API local de Next.js
    return {
      url: '/api/verify-captcha',
      name: 'Local Next.js API',
      isLocal: true
    };
  };

  const verifyRecaptcha = useCallback(
    async (action: string, formData?: Record<string, unknown>): Promise<RecaptchaResponse> => {
      if (!executeRecaptcha) {
        console.warn('🔄 reCAPTCHA not loaded yet');
        return {
          success: false,
          reason: 'reCAPTCHA not available'
        };
      }

      try {
        logRecaptcha.start(action);
        
        // Generar token de reCAPTCHA
        const token = await generateRecaptchaToken(action);
        
        if (!token) {
          // En desarrollo, simular éxito si no hay token
          if (process.env.NODE_ENV === 'development') {
            return await simulateVerification();
          }
          
          return {
            success: false,
            reason: 'Failed to generate reCAPTCHA token'
          };
        }

        // Preparar datos para enviar
        const requestData = {
          recaptchaToken: token,
          action,
          userData: {
            ...formData,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
          }
        };

        // Obtener endpoint de verificación
        const endpoint = getVerificationEndpoint();
        logRecaptcha.verify(`${endpoint.name} (${endpoint.url})`);

        // Enviar verificación
        const result = await sendVerificationRequest(endpoint, requestData);
        
        // Si falla el backend y estamos en desarrollo, intentar fallback
        if (!result.success && !endpoint.isLocal && process.env.NODE_ENV === 'development') {
          console.log('� Backend failed, trying local API fallback...');
          const fallbackEndpoint = { url: '/api/verify-captcha', name: 'Local Fallback', isLocal: true };
          return await sendVerificationRequest(fallbackEndpoint, requestData);
        }

        return result;

      } catch (error) {
        logRecaptcha.error('reCAPTCHA verification error', error);
        
        // En desarrollo, intentar fallback en caso de error
        if (process.env.NODE_ENV === 'development') {
          logRecaptcha.fallback('Error occurred, trying simulation fallback');
          return await simulateVerification();
        }
        
        return {
          success: false,
          reason: 'Network error during verification'
        };
      }
    },
    [executeRecaptcha]
  );

  const generateRecaptchaToken = async (action: string): Promise<string | null> => {
    if (!executeRecaptcha || typeof executeRecaptcha !== 'function') {
      console.error('❌ executeRecaptcha is not available');
      return null;
    }

    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Attempt ${attempts}/${maxAttempts} to generate reCAPTCHA token for action: ${action}`);
      
      if (attempts > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      try {
        console.log(`🔑 Executing reCAPTCHA with action: ${action}`);
        
        // Intentar generar el token
        let token = null;
        try {
          token = await executeRecaptcha(action);
        } catch  {
          console.warn('⚠️ executeRecaptcha failed, trying direct grecaptcha call...');
          
          // Fallback: intentar usar grecaptcha directamente si está disponible
          const grecaptcha = (window as any).grecaptcha;
          if (grecaptcha && grecaptcha.execute) {
            try {
              token = await grecaptcha.execute(
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
                { action }
              );
            } catch (directError) {
              console.error('❌ Direct grecaptcha.execute also failed:', directError);
            }
          }
        }
        console.log(`🔍 Token received:`, {
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
        });
        
        if (token && token.trim() !== '' && token !== 'null') {
          logRecaptcha.token(attempts, true);
          return token;
        }
        
        console.warn(`⚠️ Attempt ${attempts} returned invalid token:`, token);
      } catch (error) {
        console.error(`❌ Attempt ${attempts} failed with error:`, error);
        if (error instanceof Error) {
          console.error('Error details:', {
            message: error.message,
            stack: error.stack
          });
        }
      }
    }
    
    console.error('❌ Failed to generate token after all attempts');
    return null;
  };

  const sendVerificationRequest = async (
    endpoint: VerificationEndpoint, 
    requestData: any
  ): Promise<RecaptchaResponse> => {
    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`❌ ${endpoint.name} verification failed:`, result);
        return {
          success: false,
          reason: result.reason || `${endpoint.name} verification failed`,
          score: result.score
        };
      }

      logRecaptcha.success(result.score || 0);
      return result;

    } catch (error) {
      console.error(`❌ Network error with ${endpoint.name}:`, error);
      return {
        success: false,
        reason: `Network error with ${endpoint.name}`
      };
    }
  };

  const simulateVerification = async (): Promise<RecaptchaResponse> => {
    setIsSimulating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    const score = Math.random() * 0.4 + 0.6; // Entre 0.6 y 1.0
    
    logRecaptcha.simulation(score);
    setIsSimulating(false);
    
    return {
      success: true,
      score,
      reason: 'Development mode - simulated verification'
    };
  };

  return {
    verifyRecaptcha,
    isRecaptchaLoaded: isLoaded,
    isSimulating,
    getVerificationEndpoint: getVerificationEndpoint().name
  };
};

// Constantes para las acciones
export const RECAPTCHA_ACTIONS = {
  SELECT_CD: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_SELECT_CD || 'select_cd_info',
  SUBMIT_CARD: process.env.NEXT_PUBLIC_RECAPTCHA_ACTION_SUBMIT_CARD || 'submit_card_payment'
} as const;