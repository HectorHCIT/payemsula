import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

// Configuración temporal usando variables de entorno
// En producción, deberías usar un archivo de credenciales JSON
let client: RecaptchaEnterpriseServiceClient;

try {
  // Intentar crear cliente con credenciales por defecto
  client = new RecaptchaEnterpriseServiceClient({
    projectId: process.env.RECAPTCHA_PROJECT_ID,
  });
} catch (error) {
  console.warn('reCAPTCHA Enterprise client initialization failed:', error);
  console.warn('Falling back to basic validation');
  
  // Fallback: crear cliente sin credenciales específicas
  client = new RecaptchaEnterpriseServiceClient();
}

export { client };

export const recaptchaConfig = {
  projectId: process.env.RECAPTCHA_PROJECT_ID!,
  siteKey: process.env.RECAPTCHA_SITE_KEY!,
  scoreThreshold: parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5'),
};
