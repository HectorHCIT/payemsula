"use client";
import React, { useRef, useMemo, useState } from "react";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image";
import { MapPin } from "lucide-react";
import { BillData } from "@/types/types";

export function CustomerBill(data: BillData) {
  const billRef = useRef<HTMLDivElement>(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const currentDate = useMemo(() => {
    const now = new Date();
    const date = now.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${date} ${time}`;
  }, []);

  const formatPhoneNumber = (phone: string) => {
    // Formatear el número de teléfono al estilo de Honduras

    return phone.replace(/(\d{4})(\d{4})/, "$1-$2");
  };

  const companyInfo = {
    name: "Embotelladora De Sula S.A.",
    address: "Boulevard del Norte, San Pedro Sula",
  };

  const handleSavePDF = async () => {
    if (!billRef.current) {
      console.error("No se encontró la referencia del elemento");
      return;
    }

    try {
      const billElement = billRef.current;

      // Aplicar estilos directos para asegurar que sea capturable
      billElement.style.width = "390px";
      billElement.style.height = "850px";
      billElement.style.backgroundColor = "#FFFFFF";
      billElement.style.color = "#000000";

      // Usar dom-to-image con configuración simple
      const dataUrl = await domtoimage.toPng(billElement, {
        width: 390,
        height: 850,
        bgcolor: "#FFFFFF"
      });

      // Crear PDF
      const widthInMM = 103.19;
      const heightInMM = 239.45;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [widthInMM, heightInMM],
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, widthInMM, heightInMM);
      pdf.save(`recibo-${data.reference}.pdf`);
      
      sessionStorage.removeItem("formData");
      sessionStorage.removeItem("payOrder");
      setButtonVisible(false);
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el comprobante: " + error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      {/* El recibo presente en el DOM pero posicionado fuera de la vista para poder generar el PDF */}
      <div
        style={{ 
          position: "absolute",
          left: "-9999px", 
          top: "0px",
          width: "390px", 
          height: "850px", 
          overflow: "hidden" 
        }}
      >
        <div
          ref={billRef}
          className="flex flex-col w-[390px] shadow-2xl overflow-hidden bg-white"
          style={{ width: "390px", height: "850px" }}
        >
          {/* Encabezado */}
          <div className="bg-[#1761ac] py-6 px-6 text-white">
            <div className="flex justify-between items-center mb-4">
              {" "}
              <h1 className="text-2xl font-bold">
                {companyInfo.name}
              </h1>
              <div className="bg-white rounded-full p-1">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16 flex items-center justify-center">
                  <img
                    width={164}
                    height={164}
                    src="/Pepsi.svg"
                    alt="Company Logo"
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <p className="flex flex-row">
                <MapPin /> {companyInfo.address}
              </p>
            </div>
          </div>
          {/* Cuerpo del recibo */}
          <div className="bg-white py-2 px-6">
            <div className="text-center mb-8">
              <p className="text-xs font-medium mb-5">
                - - - - - - - - - - BAC CREDOMATIC - - - - - - - - - -
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                RECIBO DE PAGO
              </h2>
              <div className="h-1 w-32 bg-[#1761ac] mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm">Fecha</p>
                <p className="font-semibold text-center">{currentDate}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm">N° Referencia</p>
                <p className="font-semibold">{data.reference.slice(-11)}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm"> Verificacion</p>
                <p className="font-semibold">{data.verification}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm">Tarjeta</p>
                <p className="font-semibold">**** {data.lastFourDigits}</p>
              </div>
            </div>

            <div className="flex flex-row justify-between items-center px-4 border-y border-gray-200 py-4">
              <div>
                <p className="text-gray-500 mb-1">Recibido de</p>
                <p className="text-xl font-bold text-gray-800">{data.name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Teléfono</p>
                <p className="text-lg font-semibold">
                  {formatPhoneNumber(data.phoneNumber)}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
              <p className="text-gray-500 text-sm">CANTIDAD PAGADA</p>
              <p className="text-4xl font-bold text-[#1761ac] mt-2">
                L. {data.amountPaid.toLocaleString("es-HN")}
              </p>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-64 border-t border-gray-300 border-dashed"></div>
                </div>
              </div>
            </div>
            
            <div className="text-center text-gray-500 text-sm">
              <p>Gracias por su pago</p>
              <p className="text-xs pt-2">
                PAGARE INCONDICIONALMENTE A LA ORDEN DEL EMISOR. SEGUN CONTRATO
                SUSCRITO
              </p>
            </div>
          </div>{" "}
          {/* Pie de página */}
          <div className="bg-gray-800 text-gray-300 text-xs py-3 px-6 text-center">
            <p>Este documento es un comprobante de pago válido</p>
            <p>Impreso electrónicamente - {currentDate}</p>
          </div>
        </div>
      </div>

      {/* Solo el botón visible */}
      {buttonVisible && (
        <button
          className="mt-8 px-6 py-3 bg-[#00a63e] text-white rounded-full font-semibold shadow-lg flex items-center gap-2 hover:bg-[#009b3f] transition-colors hover:scale-105 active:scale-95"
          onClick={handleSavePDF}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Guardar Comprobante
        </button>
      )}
    </div>
  );
}
