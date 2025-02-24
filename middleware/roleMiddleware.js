import jwt from 'jsonwebtoken';

const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.user.role !== requiredRole) {
                return res.status(403).json({ msg: 'Access denied' });
            }
            req.user = decoded.user;
            next();
        } catch (err) {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    };
};

export default roleMiddleware;
