"use client"

import { useState } from "react"
import { postData } from "@/server/postData"
import { useAlert } from "@/hooks/useAlert"
import type { CardData, ResType3DS, ResTypeError, UsePaymentProcessResult } from "@/types/types"

/**
 * Hook personalizado para gestionar el proceso de pago 3DS
 */
export function usePaymentProcess(): UsePaymentProcessResult {
  const [isWaiting, setIsWaiting] = useState(false)
  const [showThreeDS, setShowThreeDS] = useState(false)
  const [paying, setPaying] = useState(false)
  const [htmlResponse, setHtmlResponse] = useState("")
  const [requestId, setRequestId] = useState<string | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paySuccess, setPaySuccess] = useState(false)
  
  // Hook de alertas integrado
  const { alert, showError, closeAlert } = useAlert()

  /**
   * Verifica si la respuesta es un error
   */
  const isErrorResponse = (response: ResType3DS | ResTypeError): response is ResTypeError => {
    return 'title' in response && 'message' in response
  }

  /**
   * Inicia el proceso de pago
   */
  const startPayment = async (formData: CardData) => {
    try {
      setIsWaiting(true)
      setPaymentError(null) // Limpiar errores previos
      
      const response = await postData(formData)
      
      // Verificar si la respuesta es un error
      if (isErrorResponse(response)) {
        setIsWaiting(false)
        showError(response.title, response.message)
        return false
      }

      // Es una respuesta exitosa (ResType3DS)
      if (response.requestId && response.html) {
        setRequestId(response.requestId)
        setHtmlResponse(response.html)
        setShowThreeDS(true)
      } else {
        showError("Error de respuesta", "No se recibió una respuesta válida del servidor")
      }
      setIsWaiting(false)    } catch (error) {
      console.error("Error al procesar pago:", error)
      setIsWaiting(false)
      showError("Error de conexión", "Ocurrió un error al procesar el pago. Por favor, intente de nuevo.")
      return false
    }
  }

  /**
   * Cierra el modal 3DS
   */
  const closeModal = () => {
    setShowThreeDS(false)
  }

  /**
   * Maneja la finalización del proceso 3DS
   */  const handleComplete = (success: boolean) => {
    if (success) {
      setPaying(true)
      setPaySuccess(true)
      setPaymentError(null)
    } else {
      setShowThreeDS(false)
      // Configurar mensaje de error para mostrar al usuario
            setPaying(false)
      setPaySuccess(false)
      setPaymentError("La autenticación 3DS ha fallado. Por favor, intente de nuevo o utilice otra tarjeta.")
      setPaying(true)
    }
  }

  return {
    isWaiting,
    showThreeDS,
    paying,
    htmlResponse,
    requestId,
    paySuccess,
    paymentError,
    startPayment,
    closeModal,
    handleComplete,
    // Sistema de alertas integrado
    alert,
    closeAlert
  }
}
