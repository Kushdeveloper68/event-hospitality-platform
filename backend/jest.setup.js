// Load test environment variables before anything else
process.env.JWT_SECRET = 'test-jwt-secret-key-for-jest';
process.env.NODE_ENV = 'test';
process.env.EMAIL_USER = 'test@test.com';
process.env.EMAIL_PASSWORD = 'test-password';
process.env.CLIENT_URL = 'http://localhost:5173';