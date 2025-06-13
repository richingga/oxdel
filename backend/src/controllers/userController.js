import db from '../models/db.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  // Karena rute ini diproteksi, kita bisa mengakses req.user yang sudah dipasang oleh middleware
  const user = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    joined: req.user.created_at
  };
  res.status(200).json(user);
};
