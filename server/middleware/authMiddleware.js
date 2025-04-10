import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token using the same secret as in login
    console.log(payload);  // Debugging: Check the payload structure

    const user = await User.findById(payload.id).select('-password'); // Find user from DB

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;  // Attach user to the request object
    next();  // Proceed to the next middleware
  } catch (err) {
    console.error(err);  // Log error for debugging
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};