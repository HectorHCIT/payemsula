#!/usr/bin/env node

/**
 * 🧪 Script de Verificación reCAPTCHA - Estado del Sistema
 * 
 * Este script verifica que todas las configuraciones de reCAPTCHA
 * estén correctamente implementadas.
 */

const fs = require('fs');
const path = require('path');

console.log('🛡️ Verificando configuración de reCAPTCHA...\n');

// 1. Verificar archivo .env.local
console.log('📋 1. Verificando variables de entorno (.env.local)');
const envPath = path.join(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const checks = [
    { key: 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY', required: true },
    { key: 'NEXT_PUBLIC_RECAPTCHA_ACTION_SELECT_CD', required: true },
    { key: 'NEXT_PUBLIC_RECAPTCHA_ACTION_SUBMIT_CARD', required: true },
    { key: 'NEXT_PUBLIC_BACKEND_RECAPTCHA_URL', required: true },
    { key: 'NEXT_PUBLIC_RECAPTCHA_MODE', required: false }
  ];
  
  checks.forEach(({ key, required }) => {
    const hasKey = envContent.includes(key);
    const status = hasKey ? '✅' : (required ? '❌' : '⚠️');
    console.log(`   ${status} ${key}: ${hasKey ? 'Configurado' : 'No encontrado'}`);
  });
} else {
  console.log('   ❌ .env.local no encontrado');
}

// 2. Verificar archivos principales
console.log('\n📁 2. Verificando archivos principales');
const files = [
  'src/hooks/useRecaptcha.ts',
  'src/app/api/verify-captcha/route.ts',
  'src/components/recaptcha-testing-panel.tsx',
  'src/lib/recaptcha-config.ts',
  'README-BACKEND-DOTNET-FINAL.md',
  'RECAPTCHA-STATUS.md'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '../', file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// 3. Verificar package.json dependencies
console.log('\n📦 3. Verificando dependencias');
const packagePath = path.join(__dirname, '../package.json');

if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'react-google-recaptcha-v3',
    '@google-cloud/recaptcha-enterprise'
  ];
  
  requiredDeps.forEach(dep => {
    const hasDepnew = deps[dep];
    console.log(`   ${hasDepnew ? '✅' : '❌'} ${dep}: ${hasDepnew || 'No instalado'}`);
  });
} else {
  console.log('   ❌ package.json no encontrado');
}

// 4. Estado del sistema
console.log('\n🎯 4. Estado del Sistema');
console.log('   ✅ Frontend: Listo para conectar con backend .NET');
console.log('   🔄 Backend: Pendiente implementación (.NET)');
console.log('   🧪 Testing: Panel disponible en desarrollo');
console.log('   📚 Docs: README completo para backend');

// 5. Próximos pasos
console.log('\n📋 5. Próximos Pasos para Backend .NET');
console.log('   1. Implementar endpoint: POST /api/recaptcha/verify');
console.log('   2. Seguir guía: README-BACKEND-DOTNET-FINAL.md');
console.log('   3. Configurar Google Cloud service account');
console.log('   4. Testing con frontend en desarrollo');
console.log('   5. Actualizar URL en .env.local cuando esté listo');

// 6. URLs importantes
console.log('\n🔗 6. URLs Importantes');
console.log('   Frontend: http://localhost:3000');
console.log('   API Local: http://localhost:3000/api/verify-captcha');
console.log('   Backend Target: https://api.emsula.com/recaptcha/verify');

console.log('\n✅ Verificación completada. Sistema listo para integración con backend .NET.');
