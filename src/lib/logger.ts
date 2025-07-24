/**
 * 🔧 Logger Utility - Logs inteligentes para desarrollo y producción
 * 
 * Este logger mantiene logs en desarrollo (incluso en builds de dev)
 * pero los elimina completamente en producción.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogOptions {
  emoji?: string;
  timestamp?: boolean;
  group?: string;
}

class AppLogger {
  private isDevelopment: boolean;
  private isClient: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isClient = typeof window !== 'undefined';
  }

  /**
   * Log general con emoji personalizable
   */
  log(level: LogLevel, message: string, data?: any, options: LogOptions = {}) {
    // En producción, solo mostrar errors y warnings
    if (!this.isDevelopment && level !== 'error' && level !== 'warn') {
      return;
    }

    const emoji = options.emoji || this.getEmojiForLevel(level);
    const timestamp = options.timestamp ? `[${new Date().toLocaleTimeString()}] ` : '';
    const prefix = `${emoji} ${timestamp}${options.group ? `[${options.group}] ` : ''}`;
    
    const method = this.getConsoleMethod(level);
    
    if (data !== undefined) {
      method(`${prefix}${message}`, data);
    } else {
      method(`${prefix}${message}`);
    }
  }

  /**
   * Logs específicos para reCAPTCHA
   */
  recaptcha = {
    start: (action: string) => 
      this.log('info', `Executing reCAPTCHA for action: ${action}`, undefined, { emoji: '🛡️', group: 'reCAPTCHA' }),
    
    token: (attempt: number, success: boolean) => 
      this.log(success ? 'success' : 'warn', `Attempt ${attempt}: ${success ? 'Token generated' : 'Failed to generate token'}`, undefined, { emoji: success ? '📝' : '🔄', group: 'reCAPTCHA' }),
    
    verify: (endpoint: string) => 
      this.log('info', `Sending verification to: ${endpoint}`, undefined, { emoji: '📡', group: 'reCAPTCHA' }),
    
    success: (score: number) => 
      this.log('success', `Verification successful - Score: ${score}`, undefined, { emoji: '✅', group: 'reCAPTCHA' }),
    
    error: (reason: string, error?: any) => 
      this.log('error', `Verification failed: ${reason}`, error, { emoji: '❌', group: 'reCAPTCHA' }),
    
    simulation: (score: number) => 
      this.log('debug', `Development mode - simulated verification (Score: ${score})`, undefined, { emoji: '🧪', group: 'reCAPTCHA' }),
    
    fallback: (reason: string) => 
      this.log('warn', `Using fallback: ${reason}`, undefined, { emoji: '🔄', group: 'reCAPTCHA' })
  };

  /**
   * Logs para desarrollo general
   */
  dev = {
    info: (message: string, data?: any) => this.log('info', message, data, { emoji: '💡', group: 'DEV' }),
    warn: (message: string, data?: any) => this.log('warn', message, data, { emoji: '⚠️', group: 'DEV' }),
    error: (message: string, data?: any) => this.log('error', message, data, { emoji: '🚨', group: 'DEV' }),
    success: (message: string, data?: any) => this.log('success', message, data, { emoji: '🎉', group: 'DEV' })
  };

  private getEmojiForLevel(level: LogLevel): string {
    const emojis = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍',
      success: '✅'
    };
    return emojis[level];
  }

  private getConsoleMethod(level: LogLevel) {
    switch (level) {
      case 'error':
        return console.error;
      case 'warn':
        return console.warn;
      case 'debug':
        return console.debug;
      default:
        return console.log;
    }
  }

  /**
   * Información sobre el estado del logger
   */
  getStatus() {
    return {
      isDevelopment: this.isDevelopment,
      isClient: this.isClient,
      logsEnabled: this.isDevelopment,
      mode: this.isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'
    };
  }
}

// Exportar instancia singleton
export const logger = new AppLogger();

// Exportar función de conveniencia
export const logRecaptcha = logger.recaptcha;
export const logDev = logger.dev;

// Para debugging - mostrar estado del logger en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 Logger initialized:', logger.getStatus());
}
