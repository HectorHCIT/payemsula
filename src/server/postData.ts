"use server";
import { CardData, ResType3DS, ResTypeError } from "@/types/types";
import forge from "node-forge";

/**
 * Verifica si una respuesta es un error estructurado
 * @param response - Respuesta del servidor
 * @returns true si es un ResTypeError, false si no
 */
function isErrorResponse(response: unknown): response is ResTypeError {
  return response !== null && 
         typeof response === 'object' && 
         'title' in response && 
         'message' in response &&
         typeof (response as ResTypeError).title === 'string' &&
         typeof (response as ResTypeError).message === 'string';
}

/**
 * Procesa los datos de pago con tarjeta y obtiene el HTML para la autenticación 3DS
 * @param data - Datos de la tarjeta a procesar
 * @returns Objeto con el ID de la solicitud y el HTML para el iframe 3DS
 */
export async function postData(data: CardData): Promise<ResType3DS |ResTypeError> {
  try {
    const publicKeyData = await getPublicKey();    const encryptedData = encryptWithPublicKey(publicKeyData, {
      cardNumber: data.cardNumber.split(" ").join(""),
      expirationDate: data.expiryDate.split("/").reverse().join(""),
      cvv: data.cvv,
      ownerName: data.name,
    });    const response = await fetch(
      `${process.env.API_BASE_URL}/api/Payment/NewPayment`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Emsula-Pay-Api-Key": process.env.API_KEY || "",
          "x-api-key": process.env.X_API_KEY || "",
        },
        body: JSON.stringify({
          hash: encryptedData,
          customerName: data.name,
          customerCode: data.customerCode,
          distributionCenter: data.distributionCenter,
          amountPay: data.paymentAmount,
          phoneNumber: data.phone,
          email: data.email,
          // Habilita doble validación de Luhn en el backend
          useLuhnValidation: process.env.USE_LUHN_VALIDATION === 'true'
        }),
      }
    );
    const res = await response.json();
    // Si la respuesta no es OK, verificar si es un error estructurado
    if (!response.ok) {
      // Verificar si tiene la estructura de ResTypeError
      if (isErrorResponse(res)) {
        return res as ResTypeError;
      }
      // Si no tiene la estructura esperada, crear un error estructurado
      return {
        title: "Error del servidor",
        message: `Error HTTP ${response.status}: ${response.statusText}`
      } as ResTypeError;
    }

    return res;  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return {
      title: "Error de conexión",
      message: "No se pudo conectar con el servidor. Por favor, intente de nuevo."
    } as ResTypeError;
  }
}

/**
 * Converts a base64 encoded key to PEM format.
 * @param base64Key The base64 encoded key.
 * @returns The PEM formatted key.
 */
function base64ToPem(base64Key: string): string {
  const lines = base64Key.match(/.{1,64}/g);
  if (!lines) {
    throw new Error("Invalid base64 key");
  }
  return `-----BEGIN PUBLIC KEY-----\n${lines.join(
    "\n"
  )}\n-----END PUBLIC KEY-----`;
}

/**
 * Encrypts a given text using a public key.
 * @param publicKeyBase64 The public key in base64 format.
 * @param textToEncrypt The text to encrypt.
 * @returns The encrypted text in base64 format.
 */
function encryptWithPublicKey(
  publicKeyBase64: string,
  textToEncrypt: unknown
): string {
  const publicKeyPem = base64ToPem(publicKeyBase64);
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const textToEncryptString = JSON.stringify(textToEncrypt).toString();
  const encryptedBytes = publicKey.encrypt(textToEncryptString, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });

  return forge.util.encode64(encryptedBytes);
}

/**
 * Obtiene la clave pública del servidor para encriptar datos sensibles
 * @returns Clave pública en formato base64
 */
async function getPublicKey() {
  const res = await fetch(`${process.env.API_BASE_URL}/api/Payment/security/public-key`,{
    headers: {
      "X-Emsula-Pay-Api-Key": process.env.API_KEY || "",
      "x-api-key": process.env.X_API_KEY || "",
    }
  });
  
  if (!res.ok) {
    throw new Error(`Error al obtener la clave pública: ${res.status} ${res.statusText}`);
  }
  
  return await res.text();
}
