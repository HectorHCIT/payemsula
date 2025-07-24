"use client"

import { useEffect } from "react"
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { useAlert } from "@/hooks/useAlert"

const alertStyles = {
  error: {
    container: "bg-red-50 border-red-200",
    icon: "text-red-400",
    title: "text-red-800",
    message: "text-red-700",
    button: "text-red-400 hover:text-red-600 focus:ring-red-500 focus:ring-offset-red-50"
  },
  success: {
    container: "bg-green-50 border-green-200",
    icon: "text-green-400",
    title: "text-green-800",
    message: "text-green-700",
    button: "text-green-400 hover:text-green-600 focus:ring-green-500 focus:ring-offset-green-50"
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200",
    icon: "text-yellow-400",
    title: "text-yellow-800",
    message: "text-yellow-700",
    button: "text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500 focus:ring-offset-yellow-50"
  },
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-400",
    title: "text-blue-800",
    message: "text-blue-700",
    button: "text-blue-400 hover:text-blue-600 focus:ring-blue-500 focus:ring-offset-blue-50"
  }
}

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info
}

interface GlobalAlertProps {
  duration?: number // Duración en ms, por defecto 5000 (5 segundos)
}

/**
 * Componente global de alertas que se conecta automáticamente con el hook useAlert
 * Este componente debe ser incluido una vez en la aplicación
 */
export function GlobalAlert({ duration = 5000 }: GlobalAlertProps) {
  const { alert, closeAlert } = useAlert()

  // Auto-cierre después de la duración especificada
  useEffect(() => {
    if (alert.isOpen) {
      const timer = setTimeout(() => {
        closeAlert()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [alert.isOpen, duration, closeAlert])

  // Cierre con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && alert.isOpen) {
        closeAlert()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [alert.isOpen, closeAlert])

  if (!alert.isOpen) {
    return null
  }

  const styles = alertStyles[alert.type]
  const IconComponent = iconMap[alert.type]

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className={`${styles.container} border rounded-lg p-4 shadow-lg max-w-md min-w-80`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${styles.icon}`} />
          </div>
          <div className="ml-3 flex-1">
            <h3 className={`text-sm font-medium ${styles.title}`}>
              {alert.title}
            </h3>
            <div className={`mt-2 text-sm ${styles.message}`}>
              <p>{alert.message}</p>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              className={`bg-transparent rounded-md inline-flex ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              onClick={closeAlert}
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
