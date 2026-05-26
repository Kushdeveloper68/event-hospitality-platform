// Centralised mock factory so every test file imports from one place
export const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

vi.mock('../../api/axios', () => ({ default: mockApi }))