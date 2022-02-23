import jwt from 'jsonwebtoken';

export const requireLogin = async(req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // Atach token to request
            req.user = decode;
            next();
        } else {
            return res.status(400).json({
                message: 'Unauthorized!!!'
            });
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
}
