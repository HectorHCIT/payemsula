import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface RecaptchaIndicatorProps {
  isVerifying: boolean;
  isVerified: boolean;
  hasFailed: boolean;
  score?: number;
}

export function RecaptchaIndicator({ 
  isVerifying, 
  isVerified, 
  hasFailed, 
  score 
}: RecaptchaIndicatorProps) {
  if (!isVerifying && !isVerified && !hasFailed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-center space-x-2 p-2 rounded-lg text-sm"
    >
      {isVerifying && (
        <>
          <Shield className="w-4 h-4 animate-spin text-blue-500" />
          <span className="text-blue-600">Verificando seguridad...</span>
        </>
      )}
      
      {isVerified && !isVerifying && (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-green-600">
            Verificación exitosa
            {score && ` (Puntuación: ${(score * 100).toFixed(0)}%)`}
          </span>
        </>
      )}
      
      {hasFailed && !isVerifying && (
        <>
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-600">Verificación de seguridad fallida</span>
        </>
      )}
    </motion.div>
  );
}
