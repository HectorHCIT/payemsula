import { render, screen, fireEvent } from '@testing-library/react';
import { FormActions } from '@/components/payment-form/form-actions';

describe('FormActions Component', () => {
  const mockProps = {
    currentStep: 1,
    isFormValid: true,
    prevStep: jest.fn(),
    nextStep: jest.fn(),
    paymentAmount: 100
  };

  beforeEach(() => {
    // Limpiar mocks entre tests
    mockProps.prevStep.mockClear();
    mockProps.nextStep.mockClear();
  });

  it('should render correctly in step 1', () => {
    render(<FormActions {...mockProps} />);
    
    // Verificar que los botones correctos están presentes
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    
    // El botón "Anterior" debe estar deshabilitado en el paso 1
    expect(screen.getByText('Anterior').closest('button')).toBeDisabled();
    
    // El botón "Siguiente" debe estar habilitado cuando isFormValid es true
    expect(screen.getByText('Siguiente').closest('button')).not.toBeDisabled();
  });
  it('should render correctly in step 2', () => {
    render(<FormActions {...mockProps} currentStep={2} />);
    
    // Verificar que los botones correctos están presentes
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    
    // En el paso 2, ahora debería mostrar el botón de "Siguiente" porque tenemos 3 pasos
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    
    // El botón "Anterior" debe estar habilitado en el paso 2
    expect(screen.getByText('Anterior').closest('button')).not.toBeDisabled();
  });
  it('should render correctly in step 3', () => {
    render(<FormActions {...mockProps} currentStep={3} />);
    
    // Verificar que los botones correctos están presentes
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    
    // En el paso 3, debería mostrar el botón de "Pagar" en lugar de "Siguiente"
    expect(screen.queryByText('Siguiente')).not.toBeInTheDocument();
    expect(screen.getByText(/Pagar/)).toBeInTheDocument();
    
    // El botón "Anterior" debe estar habilitado en el paso 3
    expect(screen.getByText('Anterior').closest('button')).not.toBeDisabled();
  });

  it('should call nextStep when Siguiente button is clicked', () => {
    render(<FormActions {...mockProps} />);
    
    // Hacer clic en el botón "Siguiente"
    fireEvent.click(screen.getByText('Siguiente'));
    
    // Verificar que nextStep fue llamado
    expect(mockProps.nextStep).toHaveBeenCalledTimes(1);
  });

  it('should call prevStep when Anterior button is clicked in step 2', () => {
    render(<FormActions {...mockProps} currentStep={2} />);
    
    // Hacer clic en el botón "Anterior"
    fireEvent.click(screen.getByText('Anterior'));
    
    // Verificar que prevStep fue llamado
    expect(mockProps.prevStep).toHaveBeenCalledTimes(1);
  });  it('should disable buttons when form is invalid', () => {
    const { rerender } = render(<FormActions {...mockProps} isFormValid={false} />);
    
    // El botón "Siguiente" debe estar habilitado en el paso 1 aunque isFormValid sea false
    expect(screen.getByText('Siguiente').closest('button')).not.toBeDisabled();
    
    // Renderizar en paso 2
    rerender(<FormActions {...mockProps} currentStep={2} isFormValid={false} />);
    
    // El botón "Siguiente" debe estar deshabilitado cuando isFormValid es false en paso 2
    expect(screen.getByText('Siguiente').closest('button')).toBeDisabled();
    
    // Renderizar en paso 3
    rerender(<FormActions {...mockProps} currentStep={3} isFormValid={false} />);
    
    // El botón "Pagar" debe estar deshabilitado cuando isFormValid es false
    expect(screen.getByText(/Pagar/).closest('button')).toBeDisabled();
  });
  it('should display the correct payment amount', () => {
    render(<FormActions {...mockProps} currentStep={3} paymentAmount={250.75} />);
    
    // Verificar que el monto de pago se muestra correctamente
    expect(screen.getByText(/L 250.75/)).toBeInTheDocument();
  });
});
