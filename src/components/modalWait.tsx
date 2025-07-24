'use client';
import Image from "next/image";
import pepsi from '@/assets/Pepsi.svg'
export default function ModalWait() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="animate-fade-in-up bg-white p-8 rounded-2xl shadow-2xl border border-white/10 max-w-md w-full mx-4">
                <div className="flex flex-col items-center gap-4">
                    {/* Contenedor del logo con animación de giro 3D */}
                    <div className="animate-spin-slow h-24 w-24">
                        <Image 
                            src={pepsi} 
                            alt="Loading" 
                            width={200}
                            height={200}
                            className="w-full h-full object-contain "
                        />
                    </div>
                   
                    {/* Texto con animación de pulso */}
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                        Procesando...
                    </h2>
                    {/* Texto secundario con animación sutil */}
                    <p className="text-gray-600 text-center animate-pulse">
                        Por favor espera mientras procesamos tu solicitud
                    </p>
                </div>
            </div>
            
            <style jsx global>{`
                @keyframes spin-slow {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-spin-slow {
                    animation: spin-slow 2s linear infinite;
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}