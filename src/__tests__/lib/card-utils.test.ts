import { 
  validateCardNumber, 
  getCardType, 
  validateCardLength, 
  validateCvv 
} from '@/lib/card-utils';

describe('validateCardNumber', () => {
  it('should return true for valid card numbers', () => {
    // VISA
    expect(validateCardNumber('4111111111111111')).toBe(true);
    // MasterCard
    expect(validateCardNumber('5555555555554444')).toBe(true);
    // American Express
    expect(validateCardNumber('371449635398431')).toBe(true);
    // With spaces and non-numeric characters
    expect(validateCardNumber('4111-1111-1111-1111')).toBe(true);
    expect(validateCardNumber('4111 1111 1111 1111')).toBe(true);
  });

  it('should return false for invalid card numbers', () => {
    // Invalid checksum (fails Luhn algorithm)
    expect(validateCardNumber('4111111111111112')).toBe(false);
    // Too short
    expect(validateCardNumber('411111')).toBe(false);
    // Too long
    expect(validateCardNumber('41111111111111111111')).toBe(false);
    // Non-numeric input after cleaning
    expect(validateCardNumber('ABCD-EFGH-IJKL-MNOP')).toBe(false);
  });
});

describe('getCardType', () => {
  it('should identify VISA cards correctly', () => {
    expect(getCardType('4111111111111111')).toBe('visa');
    expect(getCardType('4242424242424242')).toBe('visa');
    expect(getCardType('4000056655665556')).toBe('visa');
  });

  it('should identify MasterCard cards correctly', () => {
    expect(getCardType('5555555555554444')).toBe('mastercard');
    expect(getCardType('5105105105105100')).toBe('mastercard');
  });

  it('should identify American Express cards correctly', () => {
    expect(getCardType('371449635398431')).toBe('amex');
    expect(getCardType('378282246310005')).toBe('amex');
  });

  it('should identify Discover cards correctly', () => {
    expect(getCardType('6011111111111117')).toBe('discover');
    expect(getCardType('6011000990139424')).toBe('discover');
  });

  it('should identify Diners Club cards correctly', () => {
    expect(getCardType('30569309025904')).toBe('diners');
    expect(getCardType('38520000023237')).toBe('diners');
  });

  it('should identify JCB cards correctly', () => {
    expect(getCardType('3530111333300000')).toBe('jcb');
    expect(getCardType('3566002020360505')).toBe('jcb');
  });

  it('should return "desconocido" for unknown card types', () => {
    expect(getCardType('9999999999999999')).toBe('desconocido');
  });

  it('should handle cards with spaces and non-numeric characters', () => {
    expect(getCardType('4111 1111 1111 1111')).toBe('visa');
    expect(getCardType('4111-1111-1111-1111')).toBe('visa');
  });
});

describe('validateCardLength', () => {
  it('should validate VISA card length correctly', () => {
    expect(validateCardLength('4111111111111111', 'visa')).toBe(true);
    expect(validateCardLength('411111111111111', 'visa')).toBe(false);
    expect(validateCardLength('41111111111111111', 'visa')).toBe(false);
  });

  it('should validate MasterCard length correctly', () => {
    expect(validateCardLength('5555555555554444', 'mastercard')).toBe(true);
    expect(validateCardLength('555555555555444', 'mastercard')).toBe(false);
    expect(validateCardLength('55555555555544444', 'mastercard')).toBe(false);
  });

  it('should validate American Express length correctly', () => {
    expect(validateCardLength('371449635398431', 'amex')).toBe(true);
    expect(validateCardLength('37144963539843', 'amex')).toBe(false);
    expect(validateCardLength('3714496353984311', 'amex')).toBe(false);
  });

  it('should validate Diners Club length correctly', () => {
    expect(validateCardLength('30569309025904', 'diners')).toBe(true);
    expect(validateCardLength('3056930902590', 'diners')).toBe(false);
    expect(validateCardLength('305693090259044', 'diners')).toBe(false);
  });

  it('should validate Discover and JCB length correctly', () => {
    expect(validateCardLength('6011111111111117', 'discover')).toBe(true);
    expect(validateCardLength('3530111333300000', 'jcb')).toBe(true);
  });

  it('should accept generic cards within valid length range', () => {
    expect(validateCardLength('1234567890123', 'desconocido')).toBe(true); // 13 digits
    expect(validateCardLength('1234567890123456789', 'desconocido')).toBe(true); // 19 digits
    expect(validateCardLength('123456789012', 'desconocido')).toBe(false); // 12 digits
    expect(validateCardLength('12345678901234567890', 'desconocido')).toBe(false); // 20 digits
  });
});

describe('validateCvv', () => {
  it('should validate standard 3-digit CVV correctly', () => {
    expect(validateCvv('123', 'visa')).toBe(false); // Secuencia común
    expect(validateCvv('321', 'visa')).toBe(false); // Secuencia común
    expect(validateCvv('111', 'visa')).toBe(false); // Dígitos repetidos
    expect(validateCvv('000', 'visa')).toBe(false); // Común en la lista
    expect(validateCvv('987', 'mastercard')).toBe(false); // Común en la lista
    expect(validateCvv('234', 'visa')).toBe(false); // Secuencia ascendente
    expect(validateCvv('432', 'visa')).toBe(false); // Secuencia descendente
    expect(validateCvv('159', 'visa')).toBe(true); // CVV válido
    expect(validateCvv('294', 'mastercard')).toBe(true); // CVV válido
    expect(validateCvv('358', 'discover')).toBe(true); // CVV válido
  });

  it('should validate AMEX 4-digit CVV correctly', () => {
    expect(validateCvv('1234', 'amex')).toBe(false); // Secuencia ascendente
    expect(validateCvv('4321', 'amex')).toBe(false); // Secuencia descendente
    expect(validateCvv('1111', 'amex')).toBe(false); // Dígitos repetidos
    expect(validateCvv('2589', 'amex')).toBe(true); // CVV válido
    expect(validateCvv('7392', 'amex')).toBe(true); // CVV válido
  });

  it('should validate Diners Club 3-digit CVV correctly', () => {
    expect(validateCvv('123', 'diners')).toBe(false); // Secuencia común
    expect(validateCvv('111', 'diners')).toBe(false); // Dígitos repetidos
    expect(validateCvv('268', 'diners')).toBe(true); // CVV válido
  });

  it('should reject CVVs with incorrect length', () => {
    expect(validateCvv('12', 'visa')).toBe(false); // Muy corto
    expect(validateCvv('1234', 'visa')).toBe(false); // Muy largo
    expect(validateCvv('123', 'amex')).toBe(false); // Muy corto para AMEX
    expect(validateCvv('12345', 'amex')).toBe(false); // Muy largo para AMEX
  });

  it('should handle CVVs with spaces and non-numeric characters', () => {
    expect(validateCvv('1 5 9', 'visa')).toBe(true); // CVV válido con espacios
    expect(validateCvv('a2b8c6', 'visa')).toBe(true); // CVV válido con caracteres no numéricos
    expect(validateCvv('1-2-3', 'visa')).toBe(false); // Secuencia inválida
  });
});
