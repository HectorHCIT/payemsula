"use server";

import { CenterList, DataCustomer, ResType, ResTypeError } from "@/types/types";
import { jwtDecode } from "jwt-decode";

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
 * Confirma un pago mediante el API y actualiza el estado de la transacción
 * @param requestId - Identificador único de la solicitud de pago
 * @returns Resultado de la confirmación del pago
 */
export async function getConfirmations(requestId: string): Promise<ResTypeError |ResType> {
  const data = await fetch(`${process.env.API_BASE_URL}/api/Payment/PayOrder`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Emsula-Pay-Api-Key": process.env.API_KEY || "", 
      "x-api-key": process.env.X_API_KEY || "", // Asegurarse de que la clave API esté configurada
    },
    body: JSON.stringify({ requestId }),
  });
  
  const response = await data.json();
    // Si la respuesta no es OK, verificar si es un error estructurado
  if (!data.ok) {
    // Verificar si tiene la estructura de ResTypeError
    if (isErrorResponse(response)) {
      return response;
    }
    // Si no tiene la estructura esperada, crear un error estructurado
    return {
      title: "Error de confirmación",
      message: `Error HTTP ${data.status}: ${data.statusText}`
    } as ResTypeError;
  }
  
  return response as ResType;
}

/**
 * Verifica si un token JWT es válido y no ha expirado
 * @param token - Token JWT a validar
 * @returns true si el token es válido y no ha expirado, false en caso contrario
 */
export async function validateToken(token: string): Promise<boolean> {
  const decoded = jwtDecode(token);
  const { exp } = decoded as { exp: number };
  const currentTime = Math.floor(Date.now() / 1000);
  const twoMinutes = 2 * 60;
  if (exp < currentTime || exp - currentTime <= twoMinutes) {
    return false;
  } else {
    return true;
  }
}

/**
 * Obtiene la lista de centros de distribución desde el API
 * @returns Lista de centros de distribución disponibles o error estructurado
 */
export async function getCenterList(): Promise<CenterList[] | ResTypeError> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/DistributionCenters/List`,{
        headers: {
          "X-Emsula-Pay-Api-Key": process.env.API_KEY || "",
          "x-api-key": process.env.X_API_KEY || "",
        }
      }
    );
    
    const data = await response.json();
      if (!response.ok) {
      // Verificar si tiene la estructura de ResTypeError
      if (isErrorResponse(data)) {
        return data;
      }
      // Si no tiene la estructura esperada, crear un error estructurado
      return {
        title: "Error al obtener centros",
        message: `Error HTTP ${response.status}: ${response.statusText}`
      } as ResTypeError;
    }
    
    return data as CenterList[];
  } catch (error) {
    console.error("Error al obtener la lista de centros:", error);
    return {
      title: "Error de conexión",
      message: "No se pudo conectar con el servidor para obtener la lista de centros"
    } as ResTypeError;
  }
}


/**
 * Obtiene la información de un cliente específico
 * @param telephone - Número de teléfono del cliente
 * @param centerId - ID del centro de distribución
 * @returns Información detallada del cliente o error estructurado
 */
export async function getCustomerInfo(telephone:number, centerId:number): Promise<DataCustomer | ResTypeError> {
  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/Customer/Details/${centerId}/${telephone}`,{
        headers: {
          "X-Emsula-Pay-Api-Key": process.env.API_KEY || "",
          "x-api-key": process.env.X_API_KEY || "",
        }
      }
    );
    
    const data = await response.json();
      if (!response.ok) {
      // Verificar si tiene la estructura de ResTypeError
      if (isErrorResponse(data)) {
        return data;
      }
      // Si no tiene la estructura esperada, crear un error estructurado
      return {
        title: "Error al obtener información del cliente",
        message: `Error HTTP ${response.status}: ${response.statusText}`
      } as ResTypeError;
    }
    
    return {...data, customerCode: data.id.toString()} as DataCustomer;
  } catch (error) {
    console.error("Error al obtener la información del cliente:", error);
    return {
      title: "Error de conexión",
      message: "No se pudo conectar con el servidor para obtener la información del cliente"
    } as ResTypeError;
  }
}
