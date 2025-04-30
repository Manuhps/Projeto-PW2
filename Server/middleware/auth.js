const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No access token provided.' });
        }

        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Your token has expired! Please login again.' });
        }
        return res.status(401).json({ message: 'Token Failed Verification.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ message: 'This action requires admin privileges.' });
    }
    next();
};

const isFacilitator = (req, res, next) => {
    if (req.user.tipo !== 'facilitador') {
        return res.status(403).json({ message: 'This action requires facilitator privileges.' });
    }
    next();
};

module.exports = {
    auth,
    isAdmin,
    isFacilitator
}; 