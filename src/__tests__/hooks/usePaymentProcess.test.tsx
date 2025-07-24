import { renderHook, act, waitFor } from '@testing-library/react'
import { usePaymentProcess } from '@/hooks/usePaymentProcess'
import { AlertProvider } from '@/providers/alert-provider'
import { CardData, ResType3DS, ResTypeError } from '@/types/types'

// Mock del postData
jest.mock('../../server/postData', () => ({
  postData: jest.fn()
}))

// Import the mocked function
import { postData } from '../../server/postData'
const mockPostData = postData as jest.MockedFunction<typeof postData>

// Wrapper con AlertProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlertProvider>{children}</AlertProvider>
)

const mockCardData: CardData = {
  name: 'John Doe',
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/25',
  cvv: '123',
  customerId: 12345,
  paymentAmount: 100.00,
  phone: '1234567890',
  // Nuevos campos requeridos
  customerCode: "TEST123",
  email: "john.doe@example.com",
  distributionCenter: "CD001",
}

describe('usePaymentProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    expect(result.current.isWaiting).toBe(false)
    expect(result.current.showThreeDS).toBe(false)
    expect(result.current.paying).toBe(false)
    expect(result.current.htmlResponse).toBe('')
    expect(result.current.requestId).toBe(null)
    expect(result.current.paymentError).toBe(null)
    expect(result.current.paySuccess).toBe(false)  });

  test('should handle successful payment initiation', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      paymentUrl: 'https://example.com/3ds',
      finalLinks: ['https://example.com/success', 'https://example.com/error']
    }

    mockPostData.mockResolvedValueOnce(mockSuccessResponse)

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    await act(async () => {
      await result.current.startPayment(mockCardData)
    })

    expect(result.current.requestId).toBe('req123')
    expect(result.current.htmlResponse).toBe('<html>3DS form</html>')
    expect(result.current.showThreeDS).toBe(true)
    expect(result.current.isWaiting).toBe(false)
  })

  test('should handle error response from server', async () => {
    const mockErrorResponse: ResTypeError = {
      title: 'Payment Failed',
      message: 'Insufficient funds'
    }

    mockPostData.mockResolvedValueOnce(mockErrorResponse)

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    const paymentResult = await act(async () => {
      return await result.current.startPayment(mockCardData)
    })

    expect(paymentResult).toBe(false)
    expect(result.current.isWaiting).toBe(false)
    expect(result.current.showThreeDS).toBe(false)
  })

  test('should handle network/connection errors', async () => {
    mockPostData.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    const paymentResult = await act(async () => {
      return await result.current.startPayment(mockCardData)
    })

    expect(paymentResult).toBe(false)
    expect(result.current.isWaiting).toBe(false)
  })

  test('should handle invalid server response (missing requestId or html)', async () => {    const mockInvalidResponse = {
      requestId: 'req123',
      // html faltante
    } as ResType3DS

    mockPostData.mockResolvedValueOnce(mockInvalidResponse)

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    await act(async () => {
      await result.current.startPayment(mockCardData)
    })

    expect(result.current.showThreeDS).toBe(false)  });

  test('should set waiting state during payment processing', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      paymentUrl: 'https://example.com/3ds',
      finalLinks: ['https://example.com/success', 'https://example.com/error']
    }

    // Simular delay en la respuesta
    mockPostData.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve(mockSuccessResponse), 100)
      )
    )

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    act(() => {
      result.current.startPayment(mockCardData)
    })

    // Verificar que isWaiting se establece en true durante el procesamiento
    expect(result.current.isWaiting).toBe(true)

    await waitFor(() => {
      expect(result.current.isWaiting).toBe(false)
    })
  })

  test('should clear previous payment errors when starting new payment', async () => {    const mockErrorResponse: ResTypeError = {
      title: 'First Error',
      message: 'First error message'
    };
    
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      paymentUrl: 'https://example.com/3ds',
      finalLinks: ['https://example.com/success', 'https://example.com/error']
    }

    mockPostData
      .mockResolvedValueOnce(mockErrorResponse)
      .mockResolvedValueOnce(mockSuccessResponse)

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    // Primer intento con error
    await act(async () => {
      await result.current.startPayment(mockCardData)
    })

    // Segundo intento exitoso
    await act(async () => {
      await result.current.startPayment(mockCardData)
    })

    expect(result.current.paymentError).toBe(null)
    expect(result.current.showThreeDS).toBe(true)
  })

  test('should correctly identify error responses', async () => {
    const mockErrorResponse: ResTypeError = {
      title: 'Payment Error',
      message: 'Card declined'
    }

    mockPostData.mockResolvedValueOnce(mockErrorResponse)

    const { result } = renderHook(() => usePaymentProcess(), { wrapper })

    const paymentResult = await act(async () => {
      return await result.current.startPayment(mockCardData)
    })

    expect(paymentResult).toBe(false)
  })
})
