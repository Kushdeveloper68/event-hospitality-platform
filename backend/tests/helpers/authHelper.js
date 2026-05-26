const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../../models/userModel');

/**
 * Creates a verified user in the test DB and returns
 * { user, token } ready for authenticated requests.
 */
const createTestUser = async ({
  name = 'Test User',
  email = 'test@example.com',
  password = 'TestPassword123!',
  organizationName = 'Test Org',
} = {}) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    organizationName,
    termCondition: true,
    isEmailVerified: true,
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token, password };
};

module.exports = { createTestUser };