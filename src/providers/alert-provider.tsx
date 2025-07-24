"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface AlertState {
  isOpen: boolean
  title: string
  message: string
  type: 'error' | 'success' | 'warning' | 'info'
}

interface AlertContextType {
  alert: AlertState
  showError: (title: string, message: string) => void
  showSuccess: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showInfo: (title: string, message: string) => void
  closeAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    title: "",
    message: "",
    type: 'info'
  })
  const showError = (title: string, message: string) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type: 'error'
    })
  }

  const showSuccess = (title: string, message: string) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type: 'success'
    })
  }

  const showWarning = (title: string, message: string) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type: 'warning'
    })
  }

  const showInfo = (title: string, message: string) => {
    setAlert({
      isOpen: true,
      title,
      message,
      type: 'info'
    })
  }

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <AlertContext.Provider value={{
      alert,
      showError,
      showSuccess,
      showWarning,
      showInfo,
      closeAlert
    }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}
