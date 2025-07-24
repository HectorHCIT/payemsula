"use client";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CustomerBill } from "./customerBill";
import { BillData } from "@/types/types";
import { useEffect, useState } from "react";

interface ConfirmationPageProps {
  isSuccess?: boolean;
}

export default function ConfirmationPage({ isSuccess }: ConfirmationPageProps) {
  const [formData, setFormData] = useState<BillData>({
    name: "John Doe",
    phoneNumber: "1234567890",
    amountPaid: 1000,
    cardBrand: "Visa",
    lastFourDigits: "1234",
    verification: "123456",
    reference: "f07504cd",
  })

  useEffect(() => {
    const storedData = sessionStorage.getItem("formData");
    const payOrder = sessionStorage.getItem("payOrder");
    if (storedData && payOrder) {
      setFormData({
        name: JSON.parse(storedData).name,
        phoneNumber: JSON.parse(storedData).phone,
        lastFourDigits: JSON.parse(storedData).lastFourDigits,
        cardBrand: JSON.parse(payOrder).cardBrand,
        amountPaid: JSON.parse(payOrder).totalAmount,
        verification: JSON.parse(payOrder).authorizationCode,
        reference: JSON.parse(payOrder).transactionIdentifier,
      })
        ;
    } else {
      // Si no hay datos en sessionStorage, puedes manejarlo como desees
      console.warn("No form data found in sessionStorage.");
    }
  },[])

  const handleRetry = () => {
    window.location.reload();
    sessionStorage.removeItem("formData");
      sessionStorage.removeItem("payOrder");
  };

  return (
    <>
      {isSuccess ? (
        <Card className="mb-12 border-green-200 bg-green-50 shadow-md max-w-2xl mx-auto h-max">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-green-800">
                  ¡Pago Exitoso!
                </h2>
                <p className="text-green-700">
                  Su transacción ha sido procesada correctamente.
                </p>
              </div>
            </div>

            <p className="text-center mt-4 text-sm text-gray-600">
              Se ha enviara un comprobante a su correo electrónico.
            </p>
            <div className="mt-4 text-center">
              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-green-600 hover:bg-green-700 rounded-3xl text-white"
              >
                Volver al Inicio
              </Button>
              <CustomerBill
                name={formData.name}
                phoneNumber={formData.phoneNumber}
                amountPaid={formData.amountPaid}
                cardBrand={formData.cardBrand}
                lastFourDigits={formData.lastFourDigits}
                verification={formData.verification}
                reference={formData.reference}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-12 border-red-200 bg-red-50 shadow-md max-w-2xl mx-auto h-max">
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-red-600 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-red-800">
                  ¡Pago Fallido!
                </h2>
                <p className="text-red-700">
                  Lo sentimos, su transacción no pudo ser procesada.
                </p>
              </div>
            </div>

            <div className="mt-4 text-center">
              <Button
                onClick={() => handleRetry()}
                className="bg-red-600 hover:bg-red-700 text-white mr-3"
              >
                Reintentar Pago
              </Button>
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Por favor, verifique sus datos o intente con otro método de pago.
            </p>
          </CardContent>
        </Card>
      )}
    </>
  );
}
