"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Script from "next/script";

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
    throw new Error('useGoogleReCaptcha must be used within a RecaptchaV3Provider');
  }
  return context;
};

interface RecaptchaV3ProviderProps {
  children: ReactNode;
}

export function RecaptchaV3Provider({ children }: RecaptchaV3ProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey) {
      console.error('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined');
      return;
    }

    console.log('🔑 Initializing reCAPTCHA v3 with site key:', siteKey.substring(0, 10) + '...');
  }, [siteKey]);

  const handleScriptLoad = () => {
    console.log('✅ reCAPTCHA v3 script loaded');
    
    const checkReady = () => {
      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha && grecaptcha.ready) {
        grecaptcha.ready(() => {
          console.log('✅ reCAPTCHA v3 is ready');
          setIsLoaded(true);
        });
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  };

  const executeRecaptcha = async (action: string): Promise<string | null> => {
    if (!isLoaded) {
      console.warn('⏳ reCAPTCHA v3 not loaded yet');
      return null;
    }

    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha) {
      console.error('❌ grecaptcha not available');
      return null;
    }

    try {
      console.log(`🔑 Executing reCAPTCHA v3 with action: ${action}`);
      
      const token = await grecaptcha.execute(siteKey, { action });
      
      if (token) {
        console.log('✅ Token generated successfully');
        return token;
      } else {
        console.error('❌ No token returned');
        return null;
      }
    } catch (error) {
      console.error('❌ Failed to execute reCAPTCHA v3:', error);
      return null;
    }
  };

  if (!siteKey) {
    console.error('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined');
    return <>{children}</>;
  }

  return (
    <>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <RecaptchaContext.Provider value={{ executeRecaptcha: isLoaded ? executeRecaptcha : null, isLoaded }}>
        {children}
      </RecaptchaContext.Provider>
    </>
  );
}