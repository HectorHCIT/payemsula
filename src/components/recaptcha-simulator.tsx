import { useState, useEffect } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RecaptchaSimulatorProps {
  isActive: boolean;
  action: string;
  onComplete: (success: boolean, score?: number) => void;
}

export function RecaptchaSimulator({ isActive, action, onComplete }: RecaptchaSimulatorProps) {
  const [stage, setStage] = useState<'idle' | 'loading' | 'analyzing' | 'complete'>('idle');
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!isActive) {
      setStage('idle');
      return;
    }

    const simulate = async () => {
      // Etapa 1: Cargando
      setStage('loading');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Etapa 2: Analizando
      setStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simular score aleatorio pero realista
      const simulatedScore = Math.random() * 0.4 + 0.6; // Entre 0.6 y 1.0
      setScore(simulatedScore);
      
      // Etapa 3: Completo
      setStage('complete');
      
      // Llamar callback después de mostrar resultado
      setTimeout(() => {
        onComplete(simulatedScore > 0.5, simulatedScore);
        setStage('idle');
      }, 1000);
    };

    simulate();
  }, [isActive, onComplete]);

  if (!isActive && stage === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 z-50 min-w-[300px]"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {stage === 'loading' && (
              <Shield className="w-6 h-6 text-blue-500 animate-spin" />
            )}
            {stage === 'analyzing' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Shield className="w-6 h-6 text-blue-500" />
              </motion.div>
            )}
            {stage === 'complete' && (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">
              reCAPTCHA Enterprise v3
            </h4>
            
            <p className="text-xs text-gray-600 mt-1">
              {stage === 'loading' && 'Cargando verificación...'}
              {stage === 'analyzing' && `Analizando comportamiento (${action})`}
              {stage === 'complete' && `Verificación completa`}
            </p>
            
            {stage === 'complete' && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Puntuación de confianza:</span>
                  <span className={`font-semibold ${score > 0.7 ? 'text-green-600' : score > 0.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {(score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`h-1.5 rounded-full ${
                      score > 0.7 ? 'bg-green-500' : score > 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
