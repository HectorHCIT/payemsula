# Script de pruebas para reCAPTCHA Enterprise v3
# Este script ayuda a documentar y monitorear las pruebas de reCAPTCHA

Write-Host "🛡️ Sistema de Pruebas para reCAPTCHA Enterprise v3" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 ESCENARIOS DE PRUEBA DISPONIBLES:" -ForegroundColor Yellow
Write-Host "1. ✅ Búsqueda Normal - Simula una búsqueda de cuenta legítima"
Write-Host "2. ✅ Pago Normal - Simula un procesamiento de pago legítimo"
Write-Host "3. 🚨 Simular Bot - Envía patrones sospechosos para activar detección anti-bot"
Write-Host "4. 🤖 Bot Pago - Simula comportamiento automatizado en el pago"
Write-Host "5. ⚡ Prueba de Estrés - Ejecuta múltiples acciones rápidamente"
Write-Host ""

Write-Host "🔧 CONFIGURACIÓN ACTUAL:" -ForegroundColor Cyan
Write-Host "- Entorno: DESARROLLO (simulación habilitada)"
Write-Host "- Site Key: $env:NEXT_PUBLIC_RECAPTCHA_SITE_KEY"
Write-Host "- Project ID: $env:RECAPTCHA_PROJECT_ID"
Write-Host "- Umbral de Score: $env:RECAPTCHA_SCORE_THRESHOLD"
Write-Host ""

Write-Host "📱 CÓMO PROBAR:" -ForegroundColor Magenta
Write-Host "1. Abre http://localhost:3000/pago en tu navegador"
Write-Host "2. Busca el panel 'reCAPTCHA Testing Panel' en la esquina inferior izquierda"
Write-Host "3. Haz clic en los botones para probar diferentes escenarios"
Write-Host "4. Observa los resultados en el panel y en esta consola"
Write-Host ""

Write-Host "🔍 MONITOREAR LOGS:" -ForegroundColor Blue
Write-Host "- Los logs del cliente aparecen en la consola del navegador (F12)"
Write-Host "- Los logs del servidor aparecen en esta terminal"
Write-Host "- Busca los emojis para identificar fácilmente los eventos:"
Write-Host "  🛡️ = Ejecución de reCAPTCHA"
Write-Host "  🔍 = Verificación del servidor"
Write-Host "  ✅ = Éxito"
Write-Host "  ❌ = Error"
Write-Host "  🧪 = Simulación en desarrollo"
Write-Host ""

Write-Host "⚠️ CASOS DE ERROR ESPERADOS:" -ForegroundColor Red
Write-Host "- Si reCAPTCHA no está cargado: mensaje 'reCAPTCHA not available'"
Write-Host "- Si simulas comportamiento bot: score bajo y verification failed"
Write-Host "- En desarrollo: fallback a simulación automática si hay problemas"
Write-Host ""

Write-Host "✅ SISTEMA ACTUALIZADO - INTEGRACIÓN CON BACKEND .NET" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

Write-Host "🎯 CONFIGURACIÓN ACTUAL:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host "   API Local: http://localhost:3000/api/verify-captcha (fallback)" -ForegroundColor Gray
Write-Host "   Backend .NET: https://api.emsula.com/recaptcha/verify (principal)" -ForegroundColor Gray
Write-Host ""

Write-Host "📊 ESTADO DEL SISTEMA:" -ForegroundColor Cyan
Write-Host "   ✅ Hook simplificado para conectar al backend .NET" -ForegroundColor Green
Write-Host "   ✅ Fallback automático a API local en desarrollo" -ForegroundColor Green
Write-Host "   ✅ Documentación completa para equipo de backend" -ForegroundColor Green
Write-Host "   🔄 Esperando implementación del endpoint .NET" -ForegroundColor Yellow
Write-Host ""

Write-Host "📚 DOCUMENTACIÓN PARA BACKEND:" -ForegroundColor Cyan
Write-Host "   📁 README-BACKEND-DOTNET-FINAL.md - Guía completa" -ForegroundColor Gray
Write-Host "   📁 RECAPTCHA-STATUS.md - Estado actual del proyecto" -ForegroundColor Gray
Write-Host ""

Write-Host "🧪 TESTING:" -ForegroundColor Cyan
Write-Host "   Panel visible en: http://localhost:3000/pago (desarrollo)" -ForegroundColor Gray
Write-Host "   Logs en consola del navegador (F12)" -ForegroundColor Gray
Write-Host "   Simulación automática si backend no responde" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Presiona Ctrl+C para detener el monitoreo" -ForegroundColor Green
Write-Host "Iniciando monitoreo de logs..." -ForegroundColor Green

# Mantener el script ejecutándose para mostrar información
while ($true) {
    Start-Sleep -Seconds 30
    Write-Host "⏰ $(Get-Date -Format 'HH:mm:ss') - Sistema activo. Realiza pruebas en el navegador..." -ForegroundColor Gray
}
