import { renderHook, act } from '@testing-library/react';
import { usePaymentForm } from '@/hooks/usePaymentForm';

// Mock para el evento
type MockMouseEvent = Omit<React.MouseEvent, 'preventDefault'> & {
  preventDefault: jest.Mock;
};

const mockEvent: MockMouseEvent = {
  preventDefault: jest.fn()
} as MockMouseEvent;

describe('usePaymentForm', () => {  const initialData = {
    name: "Test User",
    phone: "9999-9999",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentAmount: 0,
    customerId: 1,
    // Nuevos campos requeridos
    customerCode: "TEST123",
    email: "test@example.com",
    distributionCenter: "CD001",
  };
  it('should initialize with the provided data', () => {
    const { result } = renderHook(() => usePaymentForm(initialData));
    
    expect(result.current.formData).toEqual(initialData);
    expect(result.current.currentStep).toBe(1);
    // En paso 1, isFormValid siempre es true según la lógica del hook
    expect(result.current.isFormValid).toBe(true);
  });
  it('should validate personal info correctly', () => {
    const { result } = renderHook(() => usePaymentForm({
      ...initialData,
      name: "Test User",
      phone: "9999-9999",
      paymentAmount: 100,
    }));
    
    // En paso 1 (información del cliente), isFormValid debe ser true siempre
    expect(result.current.isFormValid).toBe(true);
    
    // Avanzar al paso 2
    act(() => {
      result.current.nextStep(mockEvent);
    });
    
    // Con valores válidos en paso 2 (información personal), isFormValid debe ser true
    expect(result.current.isFormValid).toBe(true);
  });
  it('should navigate between steps correctly', () => {
    const { result } = renderHook(() => usePaymentForm({
      ...initialData,
      name: "Test User",
      phone: "9999-9999",
      paymentAmount: 100,
    }));

    // Inicialmente en paso 1
    expect(result.current.currentStep).toBe(1);
    
    // Avanzar al paso 2
    act(() => {
      result.current.nextStep(mockEvent);
    });
    
    // Debería estar en paso 2
    expect(result.current.currentStep).toBe(2);
    
    // Avanzar al paso 3
    act(() => {
      result.current.nextStep(mockEvent);
    });
    
    // Debería estar en paso 3
    expect(result.current.currentStep).toBe(3);
    
    // Volver al paso 2
    act(() => {
      result.current.prevStep(mockEvent);
    });
    
    // Debería estar en paso 2
    expect(result.current.currentStep).toBe(2);
    
    // Volver al paso 1
    act(() => {
      result.current.prevStep(mockEvent);
    });
    
    // Debería estar en paso 1 de nuevo
    expect(result.current.currentStep).toBe(1);
  });

  it('should prevent event default when navigating', () => {
    const { result } = renderHook(() => usePaymentForm({
      ...initialData,
      name: "Test User",
      phone: "9999-9999",
      paymentAmount: 100,
    }));

    // Resetear el mock
    mockEvent.preventDefault.mockClear();
    
    // Llamar a nextStep con el evento
    act(() => {
      result.current.nextStep(mockEvent);
    });
    
    // Verificar que preventDefault fue llamado
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    
    // Resetear el mock
    mockEvent.preventDefault.mockClear();
    
    // Llamar a prevStep con el evento
    act(() => {
      result.current.prevStep(mockEvent);
    });
    
    // Verificar que preventDefault fue llamado
    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should update form data correctly', () => {
    const { result } = renderHook(() => usePaymentForm(initialData));
    
    // Simular cambio de nombre
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'New Name' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Verificar que el nombre se actualizó
    expect(result.current.formData.name).toBe('New Name');
  });
  it('should validate card details correctly', () => {
    const { result } = renderHook(() => usePaymentForm(initialData));
    
    // Avanzar al paso 2
    act(() => {
      result.current.nextStep();
    });
    
    // Primero poner datos válidos para el paso 2
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Test User' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      result.current.handleChange({
        target: { name: 'phone', value: '9999-9999' }
      } as React.ChangeEvent<HTMLInputElement>);
      
      result.current.handleChange({
        target: { name: 'paymentAmount', value: '100' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
      // Avanzar al paso 3
    act(() => {
      result.current.nextStep(mockEvent);
    });
    
    // En paso 3, isFormValid debe ser false inicialmente
    expect(result.current.isFormValid).toBe(false);    // Agregar datos de tarjeta válidos - actualizar número de tarjeta primero
    act(() => {
      result.current.handleChange({
        target: { name: 'cardNumber', value: '4111111111111111' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
      // Luego actualizar la fecha de expiración por separado
    act(() => {
      result.current.handleChange({
        target: { name: 'expiryDate', value: '1227' }
      } as React.ChangeEvent<HTMLInputElement>);
    });
    
    // Finalmente actualizar el CVV
    act(() => {
      result.current.handleChange({
        target: { name: 'cvv', value: '374' }
      } as React.ChangeEvent<HTMLInputElement>);
    });    // Ahora isFormValid debe ser true
    expect(result.current.isFormValid).toBe(true);
  });
});
