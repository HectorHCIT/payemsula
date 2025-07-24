import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { GlobalAlert } from '@/components/global-alert'
import { AlertProvider, useAlert } from '@/providers/alert-provider'

// Componente helper para activar alertas en los tests
function AlertTrigger() {
  const { showError, showSuccess } = useAlert()
  
  return (
    <div>
      <button onClick={() => showError('Test Error', 'This is a test error')} data-testid="trigger-error">
        Trigger Error
      </button>
      <button onClick={() => showSuccess('Test Success', 'This is a test success')} data-testid="trigger-success">
        Trigger Success
      </button>
    </div>
  )
}

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AlertProvider>
      {ui}
      <GlobalAlert duration={1000} />
    </AlertProvider>
  )
}

describe('GlobalAlert', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  test('should not render when no alert is active', () => {
    renderWithProvider(<div>Test content</div>)
    
    expect(screen.queryByRole('button', { name: /cerrar/i })).not.toBeInTheDocument()
  })

  test('should render error alert with correct styling and content', () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-error'))
    
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    expect(screen.getByText('This is a test error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  test('should render success alert with correct styling and content', () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-success'))
    
    expect(screen.getByText('Test Success')).toBeInTheDocument()
    expect(screen.getByText('This is a test success')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cerrar/i })).toBeInTheDocument()
  })

  test('should close alert when close button is clicked', () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-error'))
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    
    fireEvent.click(screen.getByRole('button', { name: /cerrar/i }))
    expect(screen.queryByText('Test Error')).not.toBeInTheDocument()
  })

  test('should auto-close alert after specified duration', async () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-error'))
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    
    // Avanzar el tiempo hasta que la alerta se cierre automáticamente
    jest.advanceTimersByTime(1000)
    
    await waitFor(() => {
      expect(screen.queryByText('Test Error')).not.toBeInTheDocument()
    })
  })

  test('should close alert when Escape key is pressed', () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-error'))
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Test Error')).not.toBeInTheDocument()
  })

  test('should not close alert when other keys are pressed', () => {
    renderWithProvider(<AlertTrigger />)
    
    fireEvent.click(screen.getByTestId('trigger-error'))
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(screen.getByText('Test Error')).toBeInTheDocument()
    
    fireEvent.keyDown(document, { key: 'Space' })
    expect(screen.getByText('Test Error')).toBeInTheDocument()
  })
})
