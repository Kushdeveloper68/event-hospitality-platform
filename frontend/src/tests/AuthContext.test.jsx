import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../context/AuthContext'

// Simple component to expose context values in tests
function TestConsumer() {
  const { user, login, logout, isAuthenticated } = useAuth()
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user-name">{user?.name ?? 'none'}</span>
      <button onClick={() => login({ name: 'Alice', email: 'a@b.com' })}>
        Login
      </button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

// Mock the API so logout doesn't make a real HTTP call
vi.mock('../../api/userApi', () => ({
  logout: vi.fn().mockResolvedValue({}),
}))

beforeEach(() => {
  localStorage.clear()
})

describe('AuthContext', () => {
  it('starts unauthenticated when localStorage is empty', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no')
    expect(screen.getByTestId('user-name')).toHaveTextContent('none')
  })

  it('restores user from localStorage on mount', () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Bob', email: 'b@c.com' }))
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    expect(screen.getByTestId('auth-status')).toHaveTextContent('yes')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Bob')
  })

  it('login sets user and persists to localStorage', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login'))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('yes')
    expect(screen.getByTestId('user-name')).toHaveTextContent('Alice')
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Alice')
  })

  it('logout clears user and localStorage', async () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }))
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no')
    expect(localStorage.getItem('user')).toBeNull()
  })
})