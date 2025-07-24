import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomerBill } from '@/components/customerBill';
import { BillData } from '@/types/types';

// Mock de las librerías externas
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    save: jest.fn(),
  }));
});

jest.mock('dom-to-image', () => ({
  toPng: jest.fn().mockResolvedValue('data:image/png;base64,mock-image-data'),
}));

// Mock de sessionStorage
const mockSessionStorage = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('CustomerBill Component', () => {
  const mockBillData: BillData = {
    name: 'Juan Pérez',
    phoneNumber: '98765432',
    amountPaid: 1500,
    cardBrand: 'Visa',
    lastFourDigits: '1234',
    verification: '123456',
    reference: 'f07504cd123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  test('renders CustomerBill component with correct data', () => {
    render(<CustomerBill {...mockBillData} />);

    // Verificar que el botón de guardar comprobante esté presente
    expect(screen.getByText('Guardar Comprobante')).toBeInTheDocument();
  });

  test('displays company information correctly', () => {
    render(<CustomerBill {...mockBillData} />);

    // Verificar información de la empresa
    expect(screen.getByText('Embotelladora De Sula S.A.')).toBeInTheDocument();
    expect(screen.getByText('Boulevard del Norte, San Pedro Sula')).toBeInTheDocument();
  });

  test('displays bill data correctly', () => {
    render(<CustomerBill {...mockBillData} />);

    // Verificar datos del recibo
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('9876-5432')).toBeInTheDocument(); // Formato de teléfono
    expect(screen.getByText('L. 1,500')).toBeInTheDocument(); // Formato de moneda
    expect(screen.getByText('**** 1234')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('f07504cd123')).toBeInTheDocument(); // Referencia completa
  });

  test('displays current date and time', () => {
    render(<CustomerBill {...mockBillData} />);

    // Verificar que se muestre alguna fecha (formato puede variar)
    const dateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test('displays receipt structure elements', () => {
    render(<CustomerBill {...mockBillData} />);

    // Verificar elementos estructurales del recibo
    expect(screen.getByText('RECIBO DE PAGO')).toBeInTheDocument();
    expect(screen.getByText((content, element) => {
      return content.includes('BAC CREDOMATIC');
    })).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('N° Referencia')).toBeInTheDocument();
    expect(screen.getByText('Verificacion')).toBeInTheDocument();
    expect(screen.getByText('Tarjeta')).toBeInTheDocument();
    expect(screen.getByText('Recibido de')).toBeInTheDocument();
    expect(screen.getByText('Teléfono')).toBeInTheDocument();
    expect(screen.getByText('CANTIDAD PAGADA')).toBeInTheDocument();
  });

  test('displays footer information', () => {
    render(<CustomerBill {...mockBillData} />);

    expect(screen.getByText('Este documento es un comprobante de pago válido')).toBeInTheDocument();
    expect(screen.getByText(/Impreso electrónicamente/)).toBeInTheDocument();
    expect(screen.getByText('Gracias por su pago')).toBeInTheDocument();
    expect(screen.getByText(/PAGARE INCONDICIONALMENTE/)).toBeInTheDocument();
  });

  test('button click triggers PDF generation', async () => {
    const mockJsPDF = require('jspdf');
    const mockDomToImage = require('dom-to-image');
    
    render(<CustomerBill {...mockBillData} />);

    const button = screen.getByText('Guardar Comprobante');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockDomToImage.toPng).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockJsPDF).toHaveBeenCalled();
    });
  });

  test('clears sessionStorage after PDF generation', async () => {
    // Establecer datos en sessionStorage
    mockSessionStorage.setItem('formData', JSON.stringify({ test: 'data' }));
    mockSessionStorage.setItem('payOrder', JSON.stringify({ test: 'order' }));

    render(<CustomerBill {...mockBillData} />);

    const button = screen.getByText('Guardar Comprobante');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('formData');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('payOrder');
    });
  });

  test('hides button after PDF generation', async () => {
    render(<CustomerBill {...mockBillData} />);

    const button = screen.getByText('Guardar Comprobante');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Guardar Comprobante')).not.toBeInTheDocument();
    });
  });

  test('formats phone number correctly', () => {
    const testData = { ...mockBillData, phoneNumber: '12345678' };
    render(<CustomerBill {...testData} />);

    expect(screen.getByText('1234-5678')).toBeInTheDocument();
  });

  test('formats amount with thousands separator', () => {
    const testData = { ...mockBillData, amountPaid: 25000 };
    render(<CustomerBill {...testData} />);

    expect(screen.getByText('L. 25,000')).toBeInTheDocument();
  });

  test('displays last 11 characters of reference', () => {
    const testData = { ...mockBillData, reference: 'very-long-reference-123456789' };
    render(<CustomerBill {...testData} />);

    expect(screen.getByText('e-123456789')).toBeInTheDocument();
  });

  test('handles different card brands', () => {
    const testData = { ...mockBillData, cardBrand: 'Mastercard' };
    render(<CustomerBill {...testData} />);

    // El componente debería renderizar sin errores independientemente de la marca
    expect(screen.getByText('Guardar Comprobante')).toBeInTheDocument();
  });
});
