"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface RecaptchaContextType {
  executeRecaptcha: ((action: string) => Promise<string | null>) | null;
  isLoaded: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: null,
  isLoaded: false
});

export const useGoogleReCaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useGoogleReCaptcha must be used within a RecaptchaEnterpriseProvider');
  }
  return context;
};

interface RecaptchaEnterpriseProviderProps {
  children: ReactNode;
}

export function RecaptchaEnterpriseProvider({ children }: RecaptchaEnterpriseProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined');
      return;
    }

    // Load reCAPTCHA Enterprise script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('✅ reCAPTCHA Enterprise script loaded');
      
      // Wait for grecaptcha to be ready
      const checkReady = () => {
        const grecaptcha = (window as any).grecaptcha;
        if (grecaptcha && grecaptcha.enterprise) {
          console.log('✅ reCAPTCHA Enterprise ready');
          setIsLoaded(true);
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };

    script.onerror = (error) => {
      console.error('❌ Failed to load reCAPTCHA Enterprise script:', error);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll(`script[src*="recaptcha/enterprise.js"]`);
      scripts.forEach(s => s.remove());
    };
  }, [siteKey]);

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded) {
      console.warn('⏳ reCAPTCHA Enterprise not loaded yet');
      return null;
    }

    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha || !grecaptcha.enterprise) {
      console.error('❌ grecaptcha.enterprise not available');
      return null;
    }

    try {
      console.log(`🔑 Executing reCAPTCHA Enterprise with action: ${action}`);
      
      // For Enterprise, we need to use ready() and execute()
      const token = await new Promise<string>((resolve, reject) => {
        grecaptcha.enterprise.ready(async () => {
          try {
            const token = await grecaptcha.enterprise.execute(siteKey, { action });
            resolve(token);
          } catch (error) {
            reject(error);
          }
        });
      });

      console.log('✅ Token generated successfully');
      return token;
    } catch (error) {
      console.error('❌ Failed to execute reCAPTCHA Enterprise:', error);
      return null;
    }
  };

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha: isLoaded ? executeRecaptcha : null, isLoaded }}>
      {children}
    </RecaptchaContext.Provider>
  );
}