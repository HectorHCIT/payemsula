"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, ShieldCheck } from "lucide-react";
import {
  ConfirmationMessage,
  ResponseMessage,
  SimpleThreeDSModalProps,
} from "@/types/types";
import { getConfirmations } from "@/server/getData";
import { loadHtmlIntoIframe } from "@/lib/iframe-utils";

/**
 * Componente alternativo para mostrar el iframe 3DS
 * Versión simplificada y optimizada para la autenticación 3D Secure
 * @param isOpen - Estado de apertura del modal
 * @param onClose - Función para cerrar el modal
 * @param htmlContent - Contenido HTML para la autenticación 3DS
 * @param onSuccess - Callback que se ejecuta al completar exitosamente
 * @param onFailure - Callback que se ejecuta cuando falla la autenticación
 * @param requestId - ID opcional de la solicitud
 */
const SimpleThreeDSModal: React.FC<SimpleThreeDSModalProps> = ({
  isOpen,
  onClose,
  htmlContent,
  onSuccess,
  onFailure,
  requestId,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmationDetails, setConfirmationDetails] =
    useState<ConfirmationMessage | null>(null);
  /**
   * Configura el listener para mensajes recibidos desde el iframe
   * Procesa tanto mensajes en formato de confirmación como en formato original
   */
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      try {
        const data = event.data;

        // Manejar formato de mensaje de confirmación
        if (data && typeof data === "object" && "status" in data) {
          const confirmationData = data as ConfirmationMessage;
          setConfirmationDetails(confirmationData);

          if (confirmationData.status === "success") {
            onSuccess();
          } else {
            onFailure();
          }
          return;
        }

        // Manejar formato de mensaje original
        if (
          data &&
          typeof data === "object" &&
          "type" in data &&
          data.type === "RESPONSE"
        ) {
          const message = data as ResponseMessage;          if (message.payload && message.payload.key === "Success") {
            const confirmation = await getConfirmations(requestId);
            
            // Check if confirmation is an error response
            if (confirmation && 'title' in confirmation && 'message' in confirmation) {
              // Es un error
              console.error("Error al obtener confirmaciones:", confirmation);
              setConfirmationDetails({
                status: "failure",
                confirmationNumber: "",
                date: "",
                time: "",
              });
              onFailure();
            } else if (
              confirmation &&
              typeof confirmation === "object" &&
              "authorizationCode" in confirmation
            ) {
              // Es una respuesta exitosa
              setConfirmationDetails({
                status: "success",
                confirmationNumber: confirmation.authorizationCode,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
              });

              sessionStorage.setItem(
                "payOrder",
                JSON.stringify({
                  authorizationCode: confirmation.authorizationCode,
                  transactionIdentifier: confirmation.transactionIdentifier,
                  totalAmount: confirmation.totalAmount,
                  cardBrand: confirmation.cardBrand,
                  responseMessage: confirmation.responseMessage,
                  orderIdentifier: confirmation.orderIdentifier,
                })
              );
              onSuccess();
            } else {
              onFailure();
            }
          } else {
            onFailure();
          }
        }
      } catch (error) {
        console.error("Error al procesar mensaje:", error);
        onFailure();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onSuccess, onFailure, requestId]);
  /**
   * Carga el contenido HTML en el iframe cuando está disponible
   */
  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      setIsLoading(true);

      loadHtmlIntoIframe(iframeRef.current, htmlContent)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar HTML:", error);
          setIsLoading(false);
          onFailure();
        });
    }
  }, [htmlContent, onFailure]);
  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#242426e6] bg-opacity-20 z-50 w-full h-screen">
      <div className="rounded-lg shadow-2xl relative h-[90vh] w-11/12 max-w-3xl flex flex-col bg-white overflow-hidden">
        {/* Encabezado */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#1761ac] to-blue-600">
          <div className="flex items-center">
            <ShieldCheck className="h-5 w-5 text-white mr-2" />
            <h2 className="text-xl font-semibold text-white">
              Autenticación 3D Secure
            </h2>
          </div>
          <p className="text-sm text-blue-100 mt-1">
            Por su seguridad, su banco requiere una verificación adicional para
            completar esta transacción.
          </p>
          {requestId && (
            <p className="text-sm text-blue-100 mt-1">
              Transaccion: {requestId}
            </p>
          )}
        </div>

        {/* Botón de cierre */}
        <button
          className="absolute top-3 right-3 text-2xl font-bold text-white hover:text-blue-100"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Contenido principal */}
        <div className="flex-grow p-4 flex flex-col">
          {/* Mostrar detalles de confirmación si están disponibles */}
          {confirmationDetails && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center mb-2">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="font-medium text-green-800">
                  Transacción Exitosa
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-600">Número de confirmación:</p>
                  <p className="font-medium">
                    {confirmationDetails.confirmationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Fecha:</p>
                  <p className="font-medium">
                    {confirmationDetails.date} - {confirmationDetails.time}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de carga */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1761ac] mb-4"></div>
              <p className="text-sm text-gray-600">
                Cargando autenticación 3DS...
              </p>
            </div>
          )}

          {/* Contenedor del iframe */}
          {!confirmationDetails && (
            <div className="w-full flex-grow overflow-hidden rounded-lg border border-gray-200 bg-white">
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                style={{ display: isLoading ? "none" : "block" }}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                allow="payment"
              />
            </div>
          )}
        </div>

        {/* Pie de página */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-[#1761ac]" />
            {!confirmationDetails ? (
              <p>
                No cierre esta ventana hasta que se complete el proceso de
                verificación.
              </p>
            ) : (
              <p>
                Puede cerrar esta ventana de forma segura. Su transacción ha
                sido procesada.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleThreeDSModal;
