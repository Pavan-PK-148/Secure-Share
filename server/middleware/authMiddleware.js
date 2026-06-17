import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Isolate token from 'Bearer <token>' string
      token = req.headers.authorization.split(' ')[1];

      // Decode token payload using standard environment secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user context from database and attach it to the request object (exclude password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'User record linked to token no longer exists' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Cryptographic token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied, zero token access context present' });
  }
};

export default protect;