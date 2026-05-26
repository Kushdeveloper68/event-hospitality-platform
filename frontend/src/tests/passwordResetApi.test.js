import { mockApi } from './mocks/apiMocks'
import {
  requestPasswordReset,
  verifyResetOTP,
  resetPassword,
} from '../api/passwordResetApi'

describe('passwordResetApi', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('requestPasswordReset', () => {
    it('returns success response on 200', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { success: true, message: 'OTP sent' },
      })
      const res = await requestPasswordReset('user@example.com')
      expect(res.success).toBe(true)
      expect(mockApi.post).toHaveBeenCalledWith(
        '/password-reset/request',
        { email: 'user@example.com' }
      )
    })

    it('returns error response when request fails', async () => {
      mockApi.post.mockRejectedValueOnce({
        response: { data: { success: false, message: 'Server error' } },
      })
      const res = await requestPasswordReset('bad@example.com')
      expect(res.success).toBe(false)
      expect(res.message).toBe('Server error')
    })

    it('returns fallback message when no response body', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Network error'))
      const res = await requestPasswordReset('bad@example.com')
      expect(res.success).toBe(false)
      expect(res.message).toBeDefined()
    })
  })

  describe('verifyResetOTP', () => {
    it('returns resetToken on success', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { success: true, resetToken: 'abc.def.ghi' },
      })
      const res = await verifyResetOTP('user@example.com', '123456')
      expect(res.success).toBe(true)
      expect(res.resetToken).toBe('abc.def.ghi')
    })

    it('returns error for wrong OTP', async () => {
      mockApi.post.mockRejectedValueOnce({
        response: { data: { success: false, message: 'Invalid OTP' } },
      })
      const res = await verifyResetOTP('user@example.com', '000000')
      expect(res.success).toBe(false)
      expect(res.message).toMatch(/invalid/i)
    })
  })

  describe('resetPassword', () => {
    it('returns success when passwords match and token is valid', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { success: true, message: 'Password reset successfully.' },
      })
      const res = await resetPassword('valid.token.here', 'NewPass123!', 'NewPass123!')
      expect(res.success).toBe(true)
    })

    it('returns error for mismatched passwords (caught server-side)', async () => {
      mockApi.post.mockRejectedValueOnce({
        response: { data: { success: false, message: 'Passwords do not match.' } },
      })
      const res = await resetPassword('valid.token', 'Pass1!', 'Pass2!')
      expect(res.success).toBe(false)
      expect(res.message).toMatch(/do not match/i)
    })
  })
})