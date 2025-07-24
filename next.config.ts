import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // Configuración para eliminar console.log en producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'] // Mantener console.error y console.warn
    } : false,
  },
  
  // Configuración adicional para logging
  experimental: {
    // Mantener logs de desarrollo en builds de desarrollo
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
