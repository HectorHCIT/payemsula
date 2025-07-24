// Ejemplo de cómo usar el hook usePaymentProcess con manejo de errores

import { usePaymentProcess } from "@/hooks/usePaymentProcess"
import { GlobalAlert } from "@/components/global-alert"
import { CardData } from "@/types/types"

export default function PaymentExample() {
  const {
    isWaiting,
    startPayment
  } = usePaymentProcess()

  const handlePayment = async () => {
    const formData: CardData = {
      name: "Juan Pérez",
      phone: "1234567890",
      cardNumber: "4111111111111111",
      expiryDate: "12/25",
      cvv: "123",
      customerCode: "CUST123",
      distributionCenter: "DC1",
      email: "lola@gmail.com",
      paymentAmount: 10000,
      customerId: 1
    }

    // El manejo de errores es automático ahora
    await startPayment(formData)
  }
  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={isWaiting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isWaiting ? "Procesando..." : "Pagar"}
      </button>

      {/* Sistema de alertas global integrado */}
      <GlobalAlert />
    </div>
  )
}
