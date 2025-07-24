/**
 * Datos de tarjeta del usuario
 */
export interface DataCardUser {
  mail: string;
  name: string;
  email: string;
  phone: string;
}

/**
 * Datos de tarjeta para procesamiento de pago
 */
export interface CardData {
  name: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentAmount: number;
  customerId: number;
  // Nuevos campos requeridos para NewPayment
  customerCode: string;
  email: string;
  distributionCenter: string;
}

/**
 * Errores de validación de datos de tarjeta
 */
export interface CardDataErrors {
  name: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentAmount: string;
  branch?: string;
}




/**
 * Props para el modal 3DS simplificado
 * @param isOpen - Estado de apertura del modal
 * @param onClose - Función para cerrar el modal
 * @param htmlContent - Contenido HTML para la autenticación 3DS
 * @param onSuccess - Callback que se ejecuta al completar exitosamente
 * @param onFailure - Callback que se ejecuta cuando falla la autenticación
 * @param requestId - ID opcional de la solicitud
 */
export interface SimpleThreeDSModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlContent: string;
  onSuccess: () => void;
  onFailure: () => void;
  requestId: string;
}

/**
 * Datos del formulario de pago enviados al backend
 */
export interface DataFormBack{
  clientName: string;
  merchantName: string;
  phoneNumber: string;
  availableCredit: number;
  previousBalance: number;
  amountToPay: number;
  remainingBalance: number;
  paymentId?: string;
}

/**
 * Centro de distribución
 */
export type CenterList = {
  id: number
  name: string;
}

/**
 * Datos del cliente
 * @param id - ID del cliente
 * @param name - Nombre del cliente
 * @param phoneNumber - Número de teléfono del cliente
 * @param businessName - Nombre del negocio del cliente
 * @param customerCode - Código del cliente
 * @param email - Correo electrónico del cliente
 * @param distributionCenter - Centro de distribución asignado al cliente
 */
export type DataCustomer = {
  id: number;
  name: string;
  phoneNumber: string;
  businessName: string;
  customerCode: string;
  email: string;
  distributionCenter: string;
}

/**
 * Mensaje de confirmación de transacción
 */
export interface ConfirmationMessage {
  status: string;
  confirmationNumber: string;
  date: string;
  time: string;
}

/**
 * Mensaje de respuesta de la autenticación 3DS
 */
export interface ResponseMessage {
  type: "RESPONSE";
  payload: {
    key: string;
  };
}

/**
 * Datos de la factura del cliente
 * @param name - Nombre del cliente
 * @param amountPaid - Monto pagado por el cliente
 * @param verification - Código de verificación de la transacción
 * @param lastFourDigits - Últimos cuatro dígitos de la tarjeta utilizada
 * @param reference - Referencia de la transacción
 * @param phoneNumber - Número de teléfono del cliente
 */
export interface BillData {
  name: string;
  amountPaid: number;
  verification: string;
  lastFourDigits: string;
  reference: string;
  cardBrand: string;
  phoneNumber: string;
}


/**
 * Datos de respuesta de la transacción
 * @param authorizationCode - Código de autorización de la transacción
 * @param transactionIdentifier - Identificador único de la transacción
 * @param totalAmount - Monto total de la transacción
 * @param cardBrand - Marca de la tarjeta utilizada
 * @param responseMessage - Mensaje de respuesta de la transacción
 * @param orderIdentifier - Identificador del pedido asociado a la transacción
 * */
export interface ResType {
    authorizationCode:     string;
    transactionIdentifier: string;
    totalAmount:           number;
    cardBrand:             string;
    responseMessage:       string;
    orderIdentifier:       string;
}
/**
 * Datos de respuesta de la autenticación 3DS
 * @param requestId - ID de la solicitud de autenticación
 * @param html - Contenido HTML para el iframe 3DS
 * @param paymentUrl - URL del pago para redirección
 * @param finalLinks - Enlaces finales para completar la transacción
 */

export interface ResType3DS{
  requestId: string;
  html: string;
  paymentUrl: string;
  finalLinks: string[]
}

/**
 * Estructura de error para respuestas del API
 * @param title - Título del error
 * @param message - Mensaje descriptivo del error
 * */
export interface ResTypeError {
  title: string;
  message: string;
}

/**
 * Resultado del hook usePaymentProcess
 */
export interface UsePaymentProcessResult {
  // Estados del proceso de pago
  isWaiting: boolean;
  showThreeDS: boolean;
  paying: boolean;
  htmlResponse: string;
  requestId: string | null;
  paySuccess: boolean;
  paymentError: string | null;
  
  // Funciones del proceso de pago
  startPayment: (formData: CardData) => Promise<false | undefined>;
  closeModal: () => void;
  handleComplete: (success: boolean) => void;
  
  // Sistema de alertas integrado
  alert: {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
  };
  closeAlert: () => void;
}