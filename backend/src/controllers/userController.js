import db from '../models/db.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
    created_at: req.user.created_at
  };
  
  return successResponse(res, user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!username || !email) {
    return errorResponse(res, 'Username dan email wajib diisi', 400);
  }

  // Check if email is already taken by another user
  const [existingUser] = await db.promise().query(
    'SELECT id FROM users WHERE email = ? AND id != ?',
    [email, userId]
  );

  if (existingUser.length > 0) {
    return errorResponse(res, 'Email sudah digunakan oleh user lain', 409);
  }

  // Check if username is already taken by another user
  const [existingUsername] = await db.promise().query(
    'SELECT id FROM users WHERE username = ? AND id != ?',
    [username, userId]
  );

  if (existingUsername.length > 0) {
    return errorResponse(res, 'Username sudah digunakan oleh user lain', 409);
  }

  let updateFields = ['username = ?', 'email = ?', 'updated_at = NOW()'];
  let updateValues = [username, email];

  // If user wants to change password
  if (newPassword) {
    if (!currentPassword) {
      return errorResponse(res, 'Password saat ini wajib diisi untuk mengubah password', 400);
    }

    // Verify current password
    const [userRows] = await db.promise().query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return errorResponse(res, 'User tidak ditemukan', 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userRows[0].password);
    if (!isCurrentPasswordValid) {
      return errorResponse(res, 'Password saat ini salah', 400);
    }

    // Validate new password strength
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return errorResponse(res, 'Password baru harus mengandung huruf, angka, simbol & minimal 8 karakter', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    updateFields.push('password = ?');
    updateValues.push(hashedNewPassword);
  }

  // Add user ID for WHERE clause
  updateValues.push(userId);

  // Update user
  await db.promise().query(
    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated user data
  const [updatedUser] = await db.promise().query(
    'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
    [userId]
  );

  return successResponse(res, updatedUser[0], 'Profil berhasil diupdate');
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search;
  const role = req.query.role;

  let whereClause = '';
  let queryParams = [];

  // Build WHERE clause
  const conditions = [];
  
  if (search) {
    conditions.push('(username LIKE ? OR email LIKE ?)');
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  
  if (role) {
    conditions.push('role = ?');
    queryParams.push(role);
  }

  if (conditions.length > 0) {
    whereClause = 'WHERE ' + conditions.join(' AND ');
  }

  // Get total count
  const [countResult] = await db.promise().query(
    `SELECT COUNT(*) as total FROM users ${whereClause}`,
    queryParams
  );
  const total = countResult[0].total;

  // Get users
  const [users] = await db.promise().query(
    `SELECT id, username, email, role, is_verified, created_at, updated_at 
     FROM users ${whereClause} 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  return successResponse(res, users, 'Users retrieved successfully', 200, {
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  });
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  // Validate role
  const validRoles = ['user', 'admin', 'affiliate'];
  if (!validRoles.includes(role)) {
    return errorResponse(res, 'Role tidak valid', 400);
  }

  // Check if user exists
  const [userCheck] = await db.promise().query(
    'SELECT id FROM users WHERE id = ?',
    [userId]
  );

  if (userCheck.length === 0) {
    return errorResponse(res, 'User tidak ditemukan', 404);
  }

  // Update user role
  await db.promise().query(
    'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
    [role, userId]
  );

  return successResponse(res, null, 'Role user berhasil diupdate');
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (parseInt(userId) === req.user.id) {
    return errorResponse(res, 'Tidak dapat menghapus akun sendiri', 400);
  }

  // Check if user exists
  const [userCheck] = await db.promise().query(
    'SELECT id FROM users WHERE id = ?',
    [userId]
  );

  if (userCheck.length === 0) {
    return errorResponse(res, 'User tidak ditemukan', 404);
  }

  // Delete user (this will cascade delete related pages due to foreign key)
  await db.promise().query(
    'DELETE FROM users WHERE id = ?',
    [userId]
  );

  return successResponse(res, null, 'User berhasil dihapus');
});

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private (Admin)
export const getUserStats = asyncHandler(async (req, res) => {
  // Get user counts by role
  const [roleCounts] = await db.promise().query(`
    SELECT 
      role,
      COUNT(*) as count
    FROM users 
    GROUP BY role
  `);

  // Get recent registrations (last 30 days)
  const [recentRegistrations] = await db.promise().query(`
    SELECT 
      DATE(created_at) as date,
      COUNT(*) as registrations
    FROM users 
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `);

  // Get total users
  const [totalUsers] = await db.promise().query('SELECT COUNT(*) as total FROM users');

  // Get verified users
  const [verifiedUsers] = await db.promise().query('SELECT COUNT(*) as total FROM users WHERE is_verified = 1');

  const stats = {
    totalUsers: totalUsers[0].total,
    verifiedUsers: verifiedUsers[0].total,
    roleDistribution: roleCounts,
    recentRegistrations
  };

  return successResponse(res, stats);
});