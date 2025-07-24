"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useEffect } from "react";

interface RecaptchaWrapperProps {
  children: React.ReactNode;
}

export function RecaptchaWrapper({ children }: RecaptchaWrapperProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  useEffect(() => {
    // Debug: Verificar qué clave se está usando
    console.log('🔑 reCAPTCHA Site Key:', siteKey);
    console.log('🌍 Current domain:', window.location.hostname);
    
    if (!siteKey) {
      console.error('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está definida');
      return;
    }

    // Verificar que el script de reCAPTCHA se cargue
    const checkRecaptcha = () => {
      const grecaptcha = (window as any).grecaptcha;
      if (grecaptcha) {
        console.log('✅ reCAPTCHA script loaded successfully');
        console.log('🔍 grecaptcha object:', grecaptcha);
        console.log('🔍 grecaptcha.enterprise:', grecaptcha.enterprise);
        console.log('🔍 Available methods:', Object.keys(grecaptcha));
      } else {
        console.log('🔄 Waiting for reCAPTCHA script to load...');
        setTimeout(checkRecaptcha, 1000);
      }
    };
    
    setTimeout(checkRecaptcha, 2000);
  }, [siteKey]);
  
  if (!siteKey) {
    console.error('❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY no está definida');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
        nonce: undefined
      }}
      useEnterprise={false} // Temporalmente usar v3 estándar hasta confirmar soporte Enterprise
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
