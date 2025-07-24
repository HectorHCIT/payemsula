"use client"

import { CheckCircle } from "lucide-react"

interface FormProgressProps {
  currentStep: number
}

/**
 * Componente que muestra el progreso del formulario
 */
export function FormProgress({ currentStep }: FormProgressProps) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep >= 1 ? "bg-[#1761ac] text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
      </div>
      <div className={`w-8 h-1 ${currentStep >= 2 ? "bg-[#1761ac]" : "bg-gray-200"}`}></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep >= 2 ? "bg-[#1761ac] text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        {currentStep > 2 ? <CheckCircle className="w-4 h-4" /> : "2"}
      </div>
      <div className={`w-8 h-1 ${currentStep >= 3 ? "bg-[#1761ac]" : "bg-gray-200"}`}></div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
          currentStep >= 3 ? "bg-[#1761ac] text-white" : "bg-gray-200 text-gray-500"
        }`}
      >
        3
      </div>
    </div>
  )
}
