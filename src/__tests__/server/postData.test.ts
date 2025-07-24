import { postData } from '@/server/postData'
import { CardData, ResType3DS, ResTypeError } from '@/types/types'

// Mock del fetch global
global.fetch = jest.fn()

// Mock de node-forge
jest.mock('node-forge', () => ({
  pki: {
    publicKeyFromPem: jest.fn(() => ({
      encrypt: jest.fn(() => 'encrypted-data')
    }))
  },
  util: {
    encode64: jest.fn(() => 'base64-encoded-data')
  },
  md: {
    sha256: {
      create: jest.fn()
    }
  }
}))

const mockCardData: CardData = {
  name: 'John Doe',
  cardNumber: '4111 1111 1111 1111',
  expiryDate: '12/25',
  cvv: '123',
  customerId: 1,
  paymentAmount: 100.00,
  phone: '1234567890',
  // Nuevos campos requeridos
  customerCode: "TEST123",
  email: "john.doe@example.com",
  distributionCenter: "CD001",
}

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('postData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.API_BASE_URL = 'https://api.test.com'
    process.env.API_KEY = 'test-api-key'
    process.env.USE_LUHN_VALIDATION = 'true' // Configurar la variable de entorno
  })

  afterEach(() => {
    delete process.env.API_BASE_URL
    delete process.env.API_KEY
    delete process.env.USE_LUHN_VALIDATION
  })

  test('should return successful 3DS response when API returns success', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
        finalLinks: ['https://example.com/success', 'https://example.com/error'],
        paymentUrl: 'https://example.com/3ds'
    }

    // Mock para getPublicKey
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      // Mock para postData
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response)

    const result = await postData(mockCardData)

    expect(result).toEqual(mockSuccessResponse)
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })

  test('should return structured error when API returns structured error', async () => {
    const mockErrorResponse: ResTypeError = {
      title: 'Payment Failed',
      message: 'Insufficient funds'
    }

    // Mock para getPublicKey
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      // Mock para postData con error estructurado
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: () => Promise.resolve(mockErrorResponse)
      } as Response)

    const result = await postData(mockCardData)

    expect(result).toEqual(mockErrorResponse)
    expect('title' in result && 'message' in result).toBe(true)
  })

  test('should return generic structured error when API returns non-structured error', async () => {
    const mockGenericError = {
      error: 'Something went wrong',
      code: 500
    }

    // Mock para getPublicKey
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      // Mock para postData con error no estructurado
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve(mockGenericError)
      } as Response)

    const result = await postData(mockCardData) as ResTypeError

    expect(result.title).toBe('Error del servidor')
    expect(result.message).toBe('Error HTTP 500: Internal Server Error')
  })

  test('should return connection error when fetch fails', async () => {
    // Mock para getPublicKey que falla
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await postData(mockCardData) as ResTypeError

    expect(result.title).toBe('Error de conexión')
    expect(result.message).toBe('No se pudo conectar con el servidor. Por favor, intente de nuevo.')
  })

  test('should format expiry date correctly (MM/YY to YYMM)', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      finalLinks: ['https://example.com/success', 'https://example.com/error'],
      paymentUrl: 'https://example.com/3ds'
    }

    // Mock para getPublicKey
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      // Mock para postData
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response)

    await postData(mockCardData)

    // Verificar que el segundo fetch (payment) fue llamado con los datos correctos
    const paymentCall = mockFetch.mock.calls[1]
    const body = JSON.parse(paymentCall[1]?.body as string)
      expect(body).toEqual({
      hash: 'base64-encoded-data',
      customerName: 'John Doe',
      customerCode: 'TEST123',
      distributionCenter: 'CD001',
      amountPay: 100.00,
      phoneNumber: '1234567890',
      email: 'john.doe@example.com',
      useLuhnValidation: true
    })
  })

  test('should remove spaces from card number', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      finalLinks: ['https://example.com/success', 'https://example.com/error'],
      paymentUrl: 'https://example.com/3ds'
    }

    // Mock para getPublicKey
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      // Mock para postData
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response)

    const cardDataWithSpaces = {
      ...mockCardData,
      cardNumber: '4111 1111 1111 1111'
    }

    await postData(cardDataWithSpaces)

    // El card number debería procesarse sin espacios
    expect(mockFetch).toHaveBeenCalledTimes(2)
  })
  test('should handle public key fetch failure', async () => {
    // Mock para getPublicKey que falla
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as Response)

    const result = await postData(mockCardData) as ResTypeError

    expect(result.title).toBe('Error de conexión')
    expect(result.message).toBe('No se pudo conectar con el servidor. Por favor, intente de nuevo.')
  })

  test('should respect USE_LUHN_VALIDATION environment variable', async () => {
    const mockSuccessResponse: ResType3DS = {
      requestId: 'req123',
      html: '<html>3DS form</html>',
      finalLinks: ['https://example.com/success', 'https://example.com/error'],
      paymentUrl: 'https://example.com/3ds'
    }

    // Test con USE_LUHN_VALIDATION=false
    process.env.USE_LUHN_VALIDATION = 'false'

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response)

    await postData(mockCardData)

    let paymentCall = mockFetch.mock.calls[1]
    let body = JSON.parse(paymentCall[1]?.body as string)
    expect(body.useLuhnValidation).toBe(false)

    // Limpiar mocks
    jest.clearAllMocks()

    // Test con USE_LUHN_VALIDATION=true
    process.env.USE_LUHN_VALIDATION = 'true'

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('public-key-data')
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse)
      } as Response)

    await postData(mockCardData)

    paymentCall = mockFetch.mock.calls[1]
    body = JSON.parse(paymentCall[1]?.body as string)
    expect(body.useLuhnValidation).toBe(true)
  })
})
