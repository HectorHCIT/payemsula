import React from 'react';
import { useRecaptchaVerification, RECAPTCHA_ACTIONS } from '@/hooks/useRecaptcha';

// Ejemplo de uso en cualquier componente
export function ExampleRecaptchaUsage() {
  const { verifyRecaptcha, isRecaptchaLoaded } = useRecaptchaVerification();

  const handleProtectedAction = async () => {
    if (!isRecaptchaLoaded) {
      console.log('reCAPTCHA not loaded yet');
      return;
    }

    // Verificar reCAPTCHA antes de la acción
    const result = await verifyRecaptcha(RECAPTCHA_ACTIONS.SELECT_CD, {
      userId: 'user123',
      action: 'protected_action',
      timestamp: Date.now()
    });

    if (result.success) {
      console.log('✅ reCAPTCHA verified, score:', result.score);
      // Proceder con la acción protegida
      performProtectedAction();
    } else {
      console.error('❌ reCAPTCHA failed:', result.reason);
      // Mostrar error al usuario o bloquear acción
    }
  };

  const performProtectedAction = () => {
    // Tu lógica aquí
    console.log('Executing protected action...');
  };

  return (
    <button 
      onClick={handleProtectedAction}
      disabled={!isRecaptchaLoaded}
    >
      {isRecaptchaLoaded ? 'Protected Action' : 'Loading reCAPTCHA...'}
    </button>
  );
}

// Ejemplo de verificación con acción personalizada
export function useCustomRecaptchaVerification() {
  const { verifyRecaptcha } = useRecaptchaVerification();
  
  const verifyCustomAction = async () => {
    // Usar acciones personalizadas
    const result = await verifyRecaptcha('custom_form_submit', {
      formType: 'contact',
      userAgent: navigator.userAgent,
      referrer: document.referrer
    });

    return result;
  };

  return { verifyCustomAction };
}
