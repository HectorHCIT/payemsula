import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}


const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "¿Estás seguro?",
  message = "Esta acción no se puede deshacer",
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}: ConfirmationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e: { key: string; }) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[1000]" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-lg w-[90%] max-w-[450px] overflow-hidden animate-[scaleIn_0.3s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 pb-2.5 border-b border-gray-100">
          <h3 className="m-0 text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <p className="m-0 text-base leading-relaxed text-gray-600">{message}</p>
        </div>
        
        {/* Footer - Acciones */}
        <div className="p-4 px-6 flex justify-end gap-3 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-md border border-gray-200 bg-white text-gray-600 cursor-pointer font-medium transition-all duration-200 text-sm"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-md border-none bg-[#0080c2] text-white cursor-pointer font-medium transition-all duration-200 text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>  );
};

export default ConfirmationModal;