"use client";
import PaymentForm from "@/components/payment-form";
import Image from "next/image";
import { PhoneInput } from "@/components/phone-input";
import { DataCustomer } from "@/types/types";
import { useState } from "react";

export default function Home() {
  const [clientData, setClientData] = useState<DataCustomer | null>(null);
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("formData");
    sessionStorage.removeItem("payOrder");
  }

  const saveData = (data: DataCustomer) => {
    setClientData(data);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <div className="text-center mb-8">
          <Image
            src={"./logo.svg"}
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          {clientData && (
            <p className="mt-2 text-lg text-gray-600">
              Complete los datos para realizar su pago
            </p>
          )}
        </div>
        {!clientData && <PhoneInput updateData={saveData} />}

        {clientData && (
          <div className="flex w-full items-center justify-center gap-8">
            <PaymentForm clientData={clientData} />
          </div>
        )}
      </div>
    </main>
  );
}
