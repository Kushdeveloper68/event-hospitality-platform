const UserService = require("../services/userServices")

async function CreateUser(req, res) {
    try {
        const { email, password, name, organizationName, termCondition } = req.body;

        // Validation
        if (!email || !password || !name || !organizationName) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        if (!termCondition) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please accept terms and conditions' 
            });
        }

        // Create user
        const user = await UserService.createUser({
            email,
            password,
            name,
            organizationName,
            termCondition
        });

        // Generate JWT token
        const token = UserService.generateToken(user._id);

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                organizationName: user.organizationName
            }
        });

    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message || 'Error creating user' 
        });
    }
}



async function LoginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Authenticate user
        const user = await UserService.loginUser(email, password);

        // Generate JWT token
        const token = UserService.generateToken(user._id);

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                organizationName: user.organizationName
            }
        });

    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: error.message || 'Login failed' 
        });
    }
}


module.exports = { CreateUser, LoginUser }