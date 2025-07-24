import { render, screen, fireEvent, } from '@testing-library/react'
import { AlertProvider, useAlert } from '@/providers/alert-provider'

// Componente de prueba para testear el hook
function TestComponent() {
  const { alert, showError, showSuccess, showWarning, showInfo, closeAlert } = useAlert()

  return (
    <div>
      <div data-testid="alert-state">
        {alert.isOpen && (
          <div>
            <span data-testid="alert-title">{alert.title}</span>
            <span data-testid="alert-message">{alert.message}</span>
            <span data-testid="alert-type">{alert.type}</span>
          </div>
        )}
      </div>
      
      <button onClick={() => showError('Error Title', 'Error Message')} data-testid="show-error">
        Show Error
      </button>
      <button onClick={() => showSuccess('Success Title', 'Success Message')} data-testid="show-success">
        Show Success
      </button>
      <button onClick={() => showWarning('Warning Title', 'Warning Message')} data-testid="show-warning">
        Show Warning
      </button>
      <button onClick={() => showInfo('Info Title', 'Info Message')} data-testid="show-info">
        Show Info
      </button>
      <button onClick={closeAlert} data-testid="close-alert">
        Close Alert
      </button>
    </div>
  )
}

function renderWithProvider(ui: React.ReactElement) {
  return render(
    <AlertProvider>
      {ui}
    </AlertProvider>
  )
}

describe('AlertProvider', () => {
  test('should provide alert context to children', () => {
    renderWithProvider(<TestComponent />)
    
    expect(screen.getByTestId('show-error')).toBeInTheDocument()
    expect(screen.getByTestId('show-success')).toBeInTheDocument()
    expect(screen.getByTestId('show-warning')).toBeInTheDocument()
    expect(screen.getByTestId('show-info')).toBeInTheDocument()
  })

  test('should show error alert when showError is called', () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('show-error'))
    
    expect(screen.getByTestId('alert-title')).toHaveTextContent('Error Title')
    expect(screen.getByTestId('alert-message')).toHaveTextContent('Error Message')
    expect(screen.getByTestId('alert-type')).toHaveTextContent('error')
  })

  test('should show success alert when showSuccess is called', () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('show-success'))
    
    expect(screen.getByTestId('alert-title')).toHaveTextContent('Success Title')
    expect(screen.getByTestId('alert-message')).toHaveTextContent('Success Message')
    expect(screen.getByTestId('alert-type')).toHaveTextContent('success')
  })

  test('should show warning alert when showWarning is called', () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('show-warning'))
    
    expect(screen.getByTestId('alert-title')).toHaveTextContent('Warning Title')
    expect(screen.getByTestId('alert-message')).toHaveTextContent('Warning Message')
    expect(screen.getByTestId('alert-type')).toHaveTextContent('warning')
  })

  test('should show info alert when showInfo is called', () => {
    renderWithProvider(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('show-info'))
    
    expect(screen.getByTestId('alert-title')).toHaveTextContent('Info Title')
    expect(screen.getByTestId('alert-message')).toHaveTextContent('Info Message')
    expect(screen.getByTestId('alert-type')).toHaveTextContent('info')
  })

  test('should close alert when closeAlert is called', () => {
    renderWithProvider(<TestComponent />)
    
    // Mostrar una alerta primero
    fireEvent.click(screen.getByTestId('show-error'))
    expect(screen.getByTestId('alert-title')).toBeInTheDocument()
    
    // Cerrar la alerta
    fireEvent.click(screen.getByTestId('close-alert'))
    expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument()
  })

  test('should throw error when useAlert is used outside AlertProvider', () => {
    // Suprimir console.error para esta prueba
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAlert must be used within an AlertProvider')
    
    consoleSpy.mockRestore()
  })
})
