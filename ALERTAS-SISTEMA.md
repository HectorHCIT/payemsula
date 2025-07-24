# Sistema de Manejo de Errores y Alertas

Este documento explica cómo usar el nuevo sistema integrado de manejo de errores y alertas en la aplicación de pagos.

## Componentes Principales

### 1. Hook `usePaymentProcess`

El hook `usePaymentProcess` ahora maneja automáticamente los errores de la API y los muestra usando un sistema de alertas integrado.

#### Tipos de Respuesta Manejados

```typescript
// Respuesta exitosa
export interface ResType3DS {
  requestId: string;
  html: string;
  paymentUrl: string;
  finalLinks: string[]
}

// Respuesta de error
export interface ResTypeError {
  title: string;
  message: string;
}
```

#### Uso del Hook

```typescript
import { usePaymentProcess } from "@/hooks/usePaymentProcess"
import Alert from "@/components/alert"

export default function PaymentForm() {
  const {
    isWaiting,
    startPayment,
    alert,        // Estado de la alerta
    closeAlert    // Función para cerrar la alerta
  } = usePaymentProcess()

  const handlePayment = async () => {
    const formData = {
      name: "Juan Pérez",
      phone: "1234567890",
      cardNumber: "4111111111111111",
      expiryDate: "12/25",
      cvv: "123",
      paymentAmount: 10000,
      customerId: 1
    }

    await startPayment(formData)
  }

  return (
    <div>
      <button onClick={handlePayment} disabled={isWaiting}>
        {isWaiting ? "Procesando..." : "Pagar"}
      </button>

      {/* Alerta integrada */}
      <Alert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  )
}
```

### 2. Hook `useAlert` (Genérico)

Para casos donde necesites mostrar alertas fuera del contexto de pagos:

```typescript
import { useAlert } from "@/hooks/useAlert"
import Alert from "@/components/alert"

export default function MyComponent() {
  const { alert, showError, showSuccess, showWarning, showInfo, closeAlert } = useAlert()

  const handleError = () => {
    showError("Error", "Algo salió mal")
  }

  const handleSuccess = () => {
    showSuccess("Éxito", "Operación completada")
  }

  return (
    <div>
      <button onClick={handleError}>Mostrar Error</button>
      <button onClick={handleSuccess}>Mostrar Éxito</button>

      <Alert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </div>
  )
}
```

### 3. Componente `Alert`

Componente versátil que soporta diferentes tipos de alertas:

- **error**: Alertas de error (rojo)
- **success**: Alertas de éxito (verde)
- **warning**: Alertas de advertencia (amarillo)
- **info**: Alertas informativas (azul)

#### Props

```typescript
interface AlertProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
  duration?: number; // Duración en ms, por defecto 5000 (5 segundos)
}
```

## Manejo Automático de Errores en `usePaymentProcess`

El hook automáticamente:

1. **Detecta el tipo de respuesta**: Diferencia entre `ResType3DS` (éxito) y `ResTypeError` (error)
2. **Muestra alertas apropiadas**: Si la respuesta es un error, automáticamente muestra una alerta
3. **Maneja errores de red**: Si hay problemas de conexión, muestra una alerta genérica

### Ejemplo de Flujo

```typescript
const response = await postData(formData)

// Si la respuesta tiene 'title' y 'message', es un error
if (isErrorResponse(response)) {
  // Automáticamente muestra una alerta de error
  showError(response.title, response.message)
  return false
}

// Si llegamos aquí, es una respuesta exitosa
setRequestId(response.requestId)
setHtmlResponse(response.html)
setShowThreeDS(true)
```

## Ventajas del Nuevo Sistema

1. **Consistencia**: Todas las alertas tienen el mismo diseño y comportamiento
2. **Reutilización**: Los componentes pueden ser usados en cualquier parte de la app
3. **Tipos seguros**: TypeScript garantiza que usemos las interfaces correctas
4. **Manejo automático**: No necesitas manejar manualmente cada tipo de error
5. **Flexibilidad**: Soporta diferentes tipos de alertas para diferentes contextos

## Migración desde `alert()`

Antes:
```typescript
alert("Ocurrió un error al procesar el pago")
```

Ahora:
```typescript
showError("Error de procesamiento", "Ocurrió un error al procesar el pago")
```

El nuevo sistema es mucho más flexible y proporciona una mejor experiencia de usuario.
