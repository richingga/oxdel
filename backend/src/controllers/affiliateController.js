import db from '../models/db.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import { asyncHandler } from '../utils/responseHandler.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Apply to become affiliate
// @route   POST /api/affiliates/apply
// @access  Private
export const applyAffiliate = asyncHandler(async (req, res) => {
  const { reason, experience, social_media } = req.body;
  const userId = req.user.id;

  // Check if user already applied or is affiliate
  const [existing] = await db.promise().query(
    'SELECT id, status FROM affiliates WHERE user_id = ?',
    [userId]
  );

  if (existing.length > 0) {
    return errorResponse(res, 'Anda sudah mengajukan atau sudah menjadi affiliate', 400);
  }

  // Generate unique referral code
  const referralCode = `OX${userId}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  await db.promise().query(
    `INSERT INTO affiliates (user_id, referral_code, reason, experience, social_media, status, applied_at) 
     VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
    [userId, referralCode, reason, experience, social_media]
  );

  return successResponse(res, { referral_code: referralCode }, 'Aplikasi affiliate berhasil dikirim', 201);
});

// @desc    Get affiliate dashboard data
// @route   GET /api/affiliates/dashboard
// @access  Private (Affiliate)
export const getAffiliateDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get affiliate data
  const [affiliate] = await db.promise().query(
    'SELECT * FROM affiliates WHERE user_id = ? AND status = "approved"',
    [userId]
  );

  if (affiliate.length === 0) {
    return errorResponse(res, 'Anda bukan affiliate yang disetujui', 403);
  }

  const affiliateData = affiliate[0];

  // Get referral statistics
  const [referralStats] = await db.promise().query(
    `SELECT 
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as monthly_referrals,
      SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) as verified_referrals
     FROM users WHERE referred_by = ?`,
    [affiliateData.referral_code]
  );

  // Get commission data
  const [commissionStats] = await db.promise().query(
    `SELECT 
      COALESCE(SUM(amount), 0) as total_earnings,
      COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) as paid_earnings,
      COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as pending_earnings
     FROM affiliate_commissions WHERE affiliate_id = ?`,
    [affiliateData.id]
  );

  // Get recent referrals
  const [recentReferrals] = await db.promise().query(
    `SELECT username, email, created_at, is_verified 
     FROM users 
     WHERE referred_by = ? 
     ORDER BY created_at DESC 
     LIMIT 10`,
    [affiliateData.referral_code]
  );

  // Get monthly referral chart data
  const [monthlyData] = await db.promise().query(
    `SELECT 
      DATE_FORMAT(created_at, '%Y-%m') as month,
      COUNT(*) as referrals
     FROM users 
     WHERE referred_by = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
     GROUP BY DATE_FORMAT(created_at, '%Y-%m')
     ORDER BY month DESC`,
    [affiliateData.referral_code]
  );

  const dashboardData = {
    affiliate: affiliateData,
    stats: {
      ...referralStats[0],
      ...commissionStats[0]
    },
    recent_referrals: recentReferrals,
    monthly_chart: monthlyData
  };

  return successResponse(res, dashboardData);
});

// @desc    Get all affiliates (Admin only)
// @route   GET /api/affiliates
// @access  Private (Admin)
export const getAllAffiliates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let whereClause = '';
  let queryParams = [];

  if (status) {
    whereClause = 'WHERE a.status = ?';
    queryParams.push(status);
  }

  // Get total count
  const [countResult] = await db.promise().query(
    `SELECT COUNT(*) as total FROM affiliates a ${whereClause}`,
    queryParams
  );
  const total = countResult[0].total;

  // Get affiliates with user data
  const [affiliates] = await db.promise().query(
    `SELECT 
      a.*,
      u.username,
      u.email,
      (SELECT COUNT(*) FROM users WHERE referred_by = a.referral_code) as total_referrals,
      (SELECT COALESCE(SUM(amount), 0) FROM affiliate_commissions WHERE affiliate_id = a.id) as total_earnings
     FROM affiliates a
     JOIN users u ON a.user_id = u.id
     ${whereClause}
     ORDER BY a.applied_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  return paginatedResponse(res, affiliates, { page, limit, total });
});

// @desc    Approve/Reject affiliate application
// @route   PUT /api/affiliates/:id/status
// @access  Private (Admin)
export const updateAffiliateStatus = asyncHandler(async (req, res) => {
  const { status, rejection_reason } = req.body;
  const affiliateId = req.params.id;

  if (!['approved', 'rejected'].includes(status)) {
    return errorResponse(res, 'Status harus approved atau rejected', 400);
  }

  const updateData = {
    status,
    reviewed_at: new Date(),
    reviewed_by: req.user.id
  };

  if (status === 'rejected' && rejection_reason) {
    updateData.rejection_reason = rejection_reason;
  }

  if (status === 'approved') {
    updateData.approved_at = new Date();
    
    // Update user role to affiliate
    const [affiliate] = await db.promise().query(
      'SELECT user_id FROM affiliates WHERE id = ?',
      [affiliateId]
    );
    
    if (affiliate.length > 0) {
      await db.promise().query(
        'UPDATE users SET role = "affiliate" WHERE id = ?',
        [affiliate[0].user_id]
      );
    }
  }

  const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updateData);

  await db.promise().query(
    `UPDATE affiliates SET ${setClause} WHERE id = ?`,
    [...values, affiliateId]
  );

  return successResponse(res, null, `Affiliate ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
});

// @desc    Generate affiliate link
// @route   GET /api/affiliates/link
// @access  Private (Affiliate)
export const generateAffiliateLink = asyncHandler(async (req, res) => {
  const { url = '/' } = req.query;
  const userId = req.user.id;

  const [affiliate] = await db.promise().query(
    'SELECT referral_code FROM affiliates WHERE user_id = ? AND status = "approved"',
    [userId]
  );

  if (affiliate.length === 0) {
    return errorResponse(res, 'Anda bukan affiliate yang disetujui', 403);
  }

  const baseUrl = process.env.FRONTEND_URL || 'https://oxdel.id';
  const affiliateLink = `${baseUrl}${url}?ref=${affiliate[0].referral_code}`;

  return successResponse(res, { 
    affiliate_link: affiliateLink,
    referral_code: affiliate[0].referral_code
  });
});

// @desc    Track referral (called when user registers with ref code)
// @route   POST /api/affiliates/track
// @access  Internal
export const trackReferral = async (referralCode, newUserId) => {
  try {
    // Get affiliate
    const [affiliate] = await db.promise().query(
      'SELECT id FROM affiliates WHERE referral_code = ? AND status = "approved"',
      [referralCode]
    );

    if (affiliate.length === 0) return;

    // Update user with referral info
    await db.promise().query(
      'UPDATE users SET referred_by = ? WHERE id = ?',
      [referralCode, newUserId]
    );

    // Create commission record (if applicable)
    const commissionAmount = 10000; // 10k IDR per referral
    await db.promise().query(
      `INSERT INTO affiliate_commissions (affiliate_id, user_id, amount, type, status, created_at)
       VALUES (?, ?, ?, 'referral', 'pending', NOW())`,
      [affiliate[0].id, newUserId, commissionAmount]
    );

  } catch (error) {
    console.error('Error tracking referral:', error);
  }
};