"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { MouseEvent } from "react"

interface FormActionsProps {
  currentStep: number
  isFormValid: boolean
  prevStep: (e?: MouseEvent) => void
  nextStep: (e?: MouseEvent) => void
  paymentAmount: number
}

/**
 * Componente para las acciones del formulario (botones de anterior/siguiente/pagar)
 */
export function FormActions({ 
  currentStep, 
  isFormValid, 
  prevStep, 
  nextStep, 
  paymentAmount
}: FormActionsProps) {
  return (
    <div className="flex justify-between py-6 w-full">
      <Button
        type="button"
        variant="outline"
        onClick={(e) => prevStep(e)}
        disabled={currentStep === 1}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Anterior</span>
      </Button>

      {currentStep < 3 ? (
        <Button
          type="button"
          onClick={(e) => nextStep(e)}
          disabled={currentStep === 2 && !isFormValid}
          className="flex items-center space-x-2 bg-[#1761ac] hover:bg-blue-700"
        >
          <span>Siguiente</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!isFormValid}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <span>
            Pagar{" "}
            {new Intl.NumberFormat("es-HN", {
              style: "currency",
              currency: "HNL",
              currencyDisplay: "symbol",
            }).format(paymentAmount || 0)}
          </span>
        </Button>
      )}
    </div>
  )
}
