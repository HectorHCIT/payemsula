# 🔑 Requisitos de la Site Key de reCAPTCHA

## ❌ Problema Actual
El error "Invalid site key or not loaded in api.js" indica que la clave del sitio actual (`6LexOHQrAAAAACFatQdoK4mhPuX-Zuyby9TW0Sgb`) no es válida para el tipo de reCAPTCHA que estamos usando.

## 🎯 Solución Requerida

### Necesitas crear una nueva Site Key de reCAPTCHA v3:

1. **Ir a**: https://www.google.com/recaptcha/admin/create
2. **Seleccionar**: reCAPTCHA v3 (NO Enterprise)
3. **Configurar**:
   - Label: "Emsula Payment Link" (o similar)
   - Dominios: 
     - localhost (para desarrollo)
     - tu-dominio-produccion.com
4. **Obtener**: Site Key y Secret Key

### ⚠️ IMPORTANTE
- **NO uses** reCAPTCHA Enterprise
- **SÍ usa** reCAPTCHA v3 estándar
- La diferencia es crítica - son APIs diferentes

## 📝 Actualizar Configuración

### 1. En `.env.local`:
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=TU_NUEVA_SITE_KEY_V3
```

### 2. Para el backend (cuando lo implementes):
```env
RECAPTCHA_SECRET_KEY=TU_SECRET_KEY_V3
```

## 🔍 Cómo Identificar el Tipo de Clave

### reCAPTCHA v3 (Correcto ✅):
- Se crea en: https://www.google.com/recaptcha/admin
- Usa API: `https://www.google.com/recaptcha/api.js`
- Ejecuta: `grecaptcha.execute()`

### reCAPTCHA Enterprise (Incorrecto ❌):
- Se crea en: Google Cloud Console
- Usa API: `https://www.google.com/recaptcha/enterprise.js`
- Ejecuta: `grecaptcha.enterprise.execute()`

## 🚀 Próximos Pasos

1. **Crear nueva Site Key v3** en el panel de administración de Google
2. **Actualizar** `.env.local` con la nueva clave
3. **Reiniciar** el servidor de desarrollo
4. **Probar** en http://localhost:3000/pago

## 💡 Nota
La implementación actual está configurada para reCAPTCHA v3 estándar. Si en el futuro necesitas usar Enterprise, deberás:
1. Crear un proyecto en Google Cloud
2. Habilitar la API de reCAPTCHA Enterprise
3. Usar el wrapper `recaptcha-enterprise-wrapper.tsx` en lugar del v3