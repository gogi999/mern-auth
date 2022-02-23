import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async(req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                error: 'User already exists!'
            });
        }

        const hashed_password = await bcrypt.hash(password, 10);
        user = new User({
            name,
            email,
            password: hashed_password
        });
        await user.save();

        return res.status(201).json({
            message: 'User created successfully!'
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: 'Invalid Credentials!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                error: 'Invalid Credentials!'
            });
        }

        const token = jwt.sign(
            { _id: user._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ token });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

export const getUserById = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
