import { render, screen } from '@testing-library/react';
import { CardDetailsStep } from '@/components/payment-form/card-details-step';
import type { CardData, CardDataErrors } from '@/types/types';

describe('CardDetailsStep Component', () => {
  const mockFormData: CardData = {
    name: 'Test User',
    phone: '9999-9999',
    cardNumber: '4111 1111 1111 1111',
    expiryDate: '12/25',
    cvv: '123',
    paymentAmount: 100,
    customerId: 1,
  };

  const mockErrors: CardDataErrors = {
    name: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentAmount: '',
    branch: '',
  };

  const mockHandleChange = jest.fn();

  it('should render correctly with valid data', () => {
    render(
      <CardDetailsStep
        formData={mockFormData}
        errors={mockErrors}
        cardType="visa"
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar que los campos se muestran con los valores correctos
    expect(screen.getByDisplayValue('4111 1111 1111 1111')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12/25')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    
    // Verificar que se muestra el tipo de tarjeta
    expect(screen.getByText('VISA')).toBeInTheDocument();
  });

  it('should display error messages when there are validation errors', () => {
    const errorsWithValidation: CardDataErrors = {
      ...mockErrors,
      cardNumber: 'Número de tarjeta inválido',
      expiryDate: 'Tarjeta vencida',
      cvv: 'CVV debe tener 3 dígitos',
    };

    render(
      <CardDetailsStep
        formData={mockFormData}
        errors={errorsWithValidation}
        cardType="visa"
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar que se muestran los mensajes de error
    expect(screen.getByText('Número de tarjeta inválido')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta vencida')).toBeInTheDocument();
    expect(screen.getByText('CVV debe tener 3 dígitos')).toBeInTheDocument();
  });

  it('should adjust CVV placeholder based on card type', () => {
    // Renderizar con tipo AMEX
    render(
      <CardDetailsStep
        formData={mockFormData}
        errors={mockErrors}
        cardType="amex"
        handleChange={mockHandleChange}
      />
    );
    
    // Para AMEX, el placeholder de CVV debe ser "0000" (4 dígitos)
    const cvvInputAmex = screen.getByPlaceholderText('0000');
    expect(cvvInputAmex).toBeInTheDocument();
    
    // Renderizar con otro tipo de tarjeta
    render(
      <CardDetailsStep
        formData={mockFormData}
        errors={mockErrors}
        cardType="visa"
        handleChange={mockHandleChange}
      />
    );
    
    // Para otras tarjetas, el placeholder de CVV debe ser "000" (3 dígitos)
    const cvvInputVisa = screen.getByPlaceholderText('000');
    expect(cvvInputVisa).toBeInTheDocument();
  });

  it('should render card fields', () => {
    render(
      <CardDetailsStep
        formData={mockFormData}
        errors={mockErrors}
        cardType="visa"
        handleChange={mockHandleChange}
      />
    );
      // Verificar que se muestra el campo de número de tarjeta
    expect(screen.getByText(/Número de Tarjeta/)).toBeInTheDocument();
  });
});
