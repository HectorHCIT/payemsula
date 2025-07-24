import { render, screen } from '@testing-library/react';
import { PersonalInfoStep } from '@/components/payment-form/personal-info-step';
import type { CardData, CardDataErrors } from '@/types/types';

describe('PersonalInfoStep Component', () => {
  const mockFormData: CardData = {
    name: 'Test User',
    phone: '9999-9999',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
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
      <PersonalInfoStep
        formData={mockFormData}
        errors={mockErrors}
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar que los campos se muestran con los valores correctos
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('9999-9999')).toBeInTheDocument();
    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    
    // Verificar que las etiquetas están presentes
    expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByText('Número de Teléfono')).toBeInTheDocument();
    expect(screen.getByText('Monto a Pagar')).toBeInTheDocument();
  });

  it('should display error messages when there are validation errors', () => {
    const errorsWithValidation: CardDataErrors = {
      ...mockErrors,
      name: 'El nombre es requerido',
      phone: 'Teléfono debe tener 8 dígitos',
      paymentAmount: 'El monto debe ser mayor a 0',
    };

    render(
      <PersonalInfoStep
        formData={mockFormData}
        errors={errorsWithValidation}
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar que se muestran los mensajes de error
    expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    expect(screen.getByText('Teléfono debe tener 8 dígitos')).toBeInTheDocument();
    expect(screen.getByText('El monto debe ser mayor a 0')).toBeInTheDocument();
  });

  it('should render input fields with correct attributes', () => {
    render(
      <PersonalInfoStep
        formData={mockFormData}
        errors={mockErrors}
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar atributos de los campos
    const nameInput = screen.getByPlaceholderText('Ingrese su nombre completo');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeRequired();
    
    const phoneInput = screen.getByPlaceholderText('0000-0000');
    expect(phoneInput).toBeInTheDocument();
    expect(phoneInput).toBeRequired();
    expect(phoneInput).toHaveAttribute('maxLength', '9');
    
    const amountInput = screen.getByPlaceholderText('0.00');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toBeRequired();
    expect(amountInput).toHaveAttribute('type', 'number');
    expect(amountInput).toHaveAttribute('min', '1');
  });

  it('should render the currency symbol for payment amount', () => {
    render(
      <PersonalInfoStep
        formData={mockFormData}
        errors={mockErrors}
        handleChange={mockHandleChange}
      />
    );
    
    // Verificar que se muestra el símbolo de moneda
    expect(screen.getByText('L.')).toBeInTheDocument();
  });
});
