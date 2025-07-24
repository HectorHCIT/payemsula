"use client";

import { useState } from 'react';
import { useRecaptchaVerification, RECAPTCHA_ACTIONS } from '@/hooks/useRecaptcha';
import { useGoogleReCaptcha } from '@/components/recaptcha-enterprise-wrapper';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, XCircle, Copy, Key } from 'lucide-react';

export function RecaptchaTestingPanel() {
  const { verifyRecaptcha, isRecaptchaLoaded, isSimulating } = useRecaptchaVerification();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestingInProgress, setIsTestingInProgress] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);

  const addTestResult = (test: string, result: any) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { test, result, timestamp }]);
  };

  const runTest = async (testName: string, action: string, simulateError = false) => {
    setIsTestingInProgress(true);
    console.log(`🧪 Running test: ${testName}`);
    
    try {
      let testData = {
        testName,
        simulateError,
        timestamp: Date.now()
      };

      // Si queremos simular error, enviar datos que pueden activar sistemas anti-bot
      if (simulateError) {
        testData = {
          ...testData,
          suspiciousPattern: 'rapid_clicks',
          userAgent: 'bot-like-agent',
          clickPattern: 'automated'
        } as any;
      }

      const result = await verifyRecaptcha(action, testData);
      addTestResult(testName, result);
      
      console.log(`✅ Test "${testName}" completed:`, result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Test "${testName}" failed:`, error);
      addTestResult(testName, { success: false, error: errorMessage });
    } finally {
      setIsTestingInProgress(false);
    }
  };

  const runStressTest = async () => {
    setIsTestingInProgress(true);
    console.log('🔥 Running stress test...');
    
    const actions = [
      { name: 'Búsqueda Rápida 1', action: RECAPTCHA_ACTIONS.SELECT_CD },
      { name: 'Búsqueda Rápida 2', action: RECAPTCHA_ACTIONS.SELECT_CD },
      { name: 'Pago Rápido 1', action: RECAPTCHA_ACTIONS.SUBMIT_CARD },
      { name: 'Búsqueda Rápida 3', action: RECAPTCHA_ACTIONS.SELECT_CD }
    ];
    
    for (const test of actions) {
      try {
        const result = await verifyRecaptcha(test.action, { 
          rapidFire: true, 
          timestamp: Date.now(),
          stressTest: true 
        });
        addTestResult(test.name, result);
        // Esperar solo 500ms entre pruebas para simular uso rápido
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        addTestResult(test.name, { success: false, error: 'Stress test error' });
      }
    }
    
    setIsTestingInProgress(false);
  };

  const generateToken = async () => {
    if (!executeRecaptcha) {
      console.error('❌ executeRecaptcha not available');
      return;
    }

    setIsTestingInProgress(true);
    try {
      console.log('🔑 Generating token for testing...');
      const token = await executeRecaptcha('test_token_generation');
      
      if (token) {
        setGeneratedToken(token);
        setShowToken(true);
        console.log('✅ Token generated successfully');
      } else {
        console.error('❌ Failed to generate token');
      }
    } catch (error) {
      console.error('❌ Error generating token:', error);
    } finally {
      setIsTestingInProgress(false);
    }
  };

  const copyToken = async () => {
    if (!generatedToken) return;
    
    try {
      await navigator.clipboard.writeText(generatedToken);
      console.log('📋 Token copied to clipboard');
      
      // Visual feedback
      const originalText = showToken;
      setShowToken(false);
      setTimeout(() => setShowToken(originalText), 200);
    } catch (error) {
      console.error('❌ Failed to copy token:', error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border-2 border-gray-200 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center space-x-2 mb-3">
        <Shield className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-800">reCAPTCHA Testing Panel</h3>
      </div>

      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-600">
          Estado: {isRecaptchaLoaded ? '✅ Cargado' : '⏳ Cargando'}
          {isSimulating && ' | 🔄 Simulando'}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button 
            size="sm" 
            onClick={() => runTest('Búsqueda Normal', RECAPTCHA_ACTIONS.SELECT_CD, false)}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            🔍 Buscar Cuenta
          </Button>
          
          <Button 
            size="sm" 
            onClick={() => runTest('Pago Normal', RECAPTCHA_ACTIONS.SUBMIT_CARD, false)}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            💳 Procesar Pago
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => runTest('Búsqueda Sospechosa', RECAPTCHA_ACTIONS.SELECT_CD, true)}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            🚨 Simular Bot
          </Button>
          
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => runTest('Pago Sospechoso', RECAPTCHA_ACTIONS.SUBMIT_CARD, true)}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            🤖 Bot Pago
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runStressTest()}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            ⚡ Estrés
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setTestResults([])}
            disabled={isTestingInProgress}
            className="text-xs"
          >
            🗑️ Limpiar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={generateToken}
            disabled={isTestingInProgress || !isRecaptchaLoaded}
            className="text-xs"
          >
            <Key className="w-3 h-3 mr-1" />
            Generar Token
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={copyToken}
            disabled={!generatedToken}
            className="text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copiar Token
          </Button>
        </div>

        {generatedToken && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700">Token Generado:</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowToken(!showToken)}
                className="h-5 px-2 text-xs"
              >
                {showToken ? 'Ocultar' : 'Mostrar'}
              </Button>
            </div>
            {showToken && (
              <div className="break-all font-mono text-gray-600">
                {generatedToken.substring(0, 50)}...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-h-32 overflow-y-auto">
        <h4 className="text-xs font-medium text-gray-700 mb-2">Resultados de Pruebas:</h4>
        {testResults.length === 0 ? (
          <p className="text-xs text-gray-500">No hay pruebas ejecutadas</p>
        ) : (
          <div className="space-y-1">
            {testResults.slice(-3).map((test, index) => (
              <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{test.test}</span>
                  {test.result.success ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-500" />
                  )}
                </div>
                <div className="text-gray-600 mt-1">
                  {test.result.success ? (
                    <>
                      ✅ Score: {((test.result.score || 0) * 100).toFixed(0)}%
                      <br />
                      {test.result.reason}
                    </>
                  ) : (
                    <>
                      ❌ {test.result.reason || test.result.error}
                    </>
                  )}
                </div>
                <div className="text-gray-400 text-xs mt-1">{test.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
