// ----------------------------------------------------
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../models/db.js';
import generateToken from '../utils/generateToken.js';
import { sendOtpEmail, sendEmail } from '../services/emailService.js'; // Email service lengkap

// ✅ REGISTER
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Harap isi semua kolom.' });
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password minimal 8 karakter dan harus mengandung huruf, angka & simbol.'
    });
  }

  try {
    const [existingUser] = await db.promise().query(
      'SELECT email FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email atau username sudah digunakan.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await sendOtpEmail(email, otp);

    await db.promise().query(
      'INSERT INTO users (username, email, password, otp, otp_expires_at) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, otp, otpExpires]
    );

    res.status(201).json({ message: 'Registrasi berhasil! Cek email Anda untuk OTP.' });
  } catch (error) {
    console.error("Error register:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// ✅ VERIFIKASI OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email dan OTP wajib diisi." });
  }

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: "Email tidak terdaftar." });

    if (user.otp !== otp || user.otp_expires_at < new Date()) {
      return res.status(400).json({ message: "OTP salah atau sudah kedaluwarsa." });
    }

    await db.promise().query(
      "UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE id = ?",
      [user.id]
    );

    res.status(200).json({ message: "Akun berhasil diverifikasi! Silakan login." });

  } catch (error) {
    console.error("Error verify OTP:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(401).json({ message: 'Email tidak ditemukan.' });

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Akun belum diverifikasi. Cek email untuk OTP.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Password salah.' });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error("Error login:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// ✅ LUPA PASSWORD (link email)
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email wajib diisi." });

  try {
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) return res.status(404).json({ message: "Email tidak ditemukan." });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

    await db.promise().query(
      'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
      [token, expires, user.id]
    );

    const resetLink = `https://in.oxdel.id/reset-password/${token}`;
    await sendEmail({
      to: email,
      subject: 'Reset Password Oxdel',
      html: `
        <p>Halo,</p>
        <p>Kami menerima permintaan reset password untuk akun Anda.</p>
        <p><a href="${resetLink}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a></p>
        <p>Link ini akan kedaluwarsa dalam 1 jam.</p>
      `
    });

    res.status(200).json({ message: "Link reset password telah dikirim ke email Anda." });
  } catch (error) {
    console.error("Error forgotPassword:", error);
    res.status(500).json({ message: "Terjadi kesalahan server saat reset password." });
  }
};

// ✅ RESET PASSWORD (via token)
export const resetPassword = async (req, res) => {
  const { resettoken } = req.params;
  const { password } = req.body;

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password harus mengandung huruf, angka, simbol & minimal 8 karakter.' });
  }

  try {
    const [users] = await db.promise().query(
      'SELECT * FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [resettoken]
    );
    const user = users[0];

    if (!user) return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      'UPDATE users SET password = ?, reset_password_token = NULL, reset_password_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password berhasil direset. Silakan login.' });
  } catch (error) {
    console.error('Error resetPassword:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat reset password.' });
  }
};

// ✅ CEK TOKEN RESET PASSWORD
export const checkResetToken = async (req, res) => {
  const { resettoken } = req.params;

  try {
    const [users] = await db.promise().query(
      'SELECT id FROM users WHERE reset_password_token = ? AND reset_password_expires > NOW()',
      [resettoken]
    );

    if (users.length === 0) {
      return res.status(400).json({ valid: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
    }

    res.status(200).json({ valid: true, message: 'Token valid.' });
  } catch (error) {
    console.error('Error cek token:', error);
    res.status(500).json({ valid: false, message: 'Terjadi kesalahan saat memeriksa token.' });
  }
};
