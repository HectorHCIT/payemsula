
/** 
 * @param cardNumber Número de tarjeta (puede incluir espacios)
 * @description Valida el número de tarjeta utilizando el algoritmo de Luhn
 * @description Elimina espacios y caracteres no numéricos antes de la validación
 * @description El número de tarjeta debe tener entre 13 y 19 dígitos
 * @description El algoritmo de Luhn es un método de validación de números de tarjeta de crédito
 * @description que ayuda a detectar errores de entrada comunes, como dígitos incorrectos o transposiciones.
 * @description Este algoritmo no garantiza que el número de tarjeta sea válido, pero ayuda a filtrar números incorrectos.
 * @description El número de tarjeta debe ser un número válido según el algoritmo de Luhn.
 * @returns 
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Eliminar espacios y caracteres no numéricos
  const cleaned = cardNumber.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }

  // Algoritmo de Luhn
  let sum = 0
  let shouldDouble = false

  // Recorrer de derecha a izquierda
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleaned.charAt(i), 10)

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

/**
 * Detecta el tipo de tarjeta basado en el número
 * @param cardNumber Número de tarjeta (puede incluir espacios)
 * @returns string con el tipo de tarjeta (visa, mastercard, amex, etc.)
 */
export function getCardType(cardNumber: string): string {
  // Eliminar espacios y caracteres no numéricos
  const cleaned = cardNumber.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

  // Patrones para identificar tipos de tarjetas
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^(6011|65|64[4-9]|622)/,
    diners: /^(36|38|30[0-5])/,
    jcb: /^35/,
  }

  // Verificar el patrón que coincide
  if (patterns.visa.test(cleaned)) {
    return "visa"
  } else if (patterns.mastercard.test(cleaned)) {
    return "mastercard"
  } else if (patterns.amex.test(cleaned)) {
    return "amex"
  } else if (patterns.discover.test(cleaned)) {
    return "discover"
  } else if (patterns.diners.test(cleaned)) {
    return "diners"
  } else if (patterns.jcb.test(cleaned)) {
    return "jcb"
  } else {
    return "desconocido"
  }
}

/**
 * Verifica si la longitud del número de tarjeta es correcta según el tipo
 * @param cardNumber Número de tarjeta
 * @param cardType Tipo de tarjeta
 * @returns boolean indicando si la longitud es correcta
 */
export function validateCardLength(cardNumber: string, cardType: string): boolean {
  const cleaned = cardNumber.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

  switch (cardType) {
    case "amex":
      return cleaned.length === 15
    case "diners":
      return cleaned.length === 14
    case "visa":
    case "mastercard":
    case "discover":
    case "jcb":
      return cleaned.length === 16
    default:
      return cleaned.length >= 13 && cleaned.length <= 19
  }
}

/**
 * Valida el CVV de una tarjeta según su tipo
 * @param cvv Código de verificación (CVV)
 * @param cardType Tipo de tarjeta (visa, mastercard, amex, etc.)
 * @returns boolean indicando si el CVV es válido
 */
export function validateCvv(cvv: string, cardType: string): boolean {
  const cleaned = cvv.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
  
  // Verificar longitud según tipo de tarjeta
  let validLength = false
  switch (cardType) {
    case "amex":
      validLength = cleaned.length === 4
      break
    case "diners":
      validLength = cleaned.length === 3
      break
    default:
      validLength = cleaned.length === 3
      break
  }
  
  if (!validLength) return false
  
  // Verificar que no sean todos dígitos iguales (e.g. 000, 111)
  if (new Set(cleaned).size === 1) return false
  
  // Verificar que no sean dígitos consecutivos ascendentes (e.g. 123, 1234)
  let isConsecutiveAsc = true
  for (let i = 0; i < cleaned.length - 1; i++) {
    if (parseInt(cleaned[i]) + 1 !== parseInt(cleaned[i+1])) {
      isConsecutiveAsc = false
      break
    }
  }
  if (isConsecutiveAsc) return false
  
  // Verificar que no sean dígitos consecutivos descendentes (e.g. 321, 4321)
  let isConsecutiveDesc = true
  for (let i = 0; i < cleaned.length - 1; i++) {
    if (parseInt(cleaned[i]) - 1 !== parseInt(cleaned[i+1])) {
      isConsecutiveDesc = false
      break
    }
  }
  if (isConsecutiveDesc) return false
  
  // Verificar que no sea un valor común y fácil de adivinar
  const commonCVVs = ["123", "321", "111", "222", "333", "444", "555", "666", "777", "888", "999", "000", "012", "987"]
  if (commonCVVs.includes(cleaned)) return false
  
  return true
}