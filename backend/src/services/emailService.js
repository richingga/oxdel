import nodemailer from 'nodemailer';

// Transporter reusable (1x deklarasi saja)
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  otp: (otp, username) => ({
    subject: `Kode Verifikasi Oxdel Anda: ${otp}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Akun Oxdel</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .otp-box { background: #f1f5f9; border: 2px dashed #3b82f6; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1e293b; margin: 10px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat Datang di Oxdel!</h1>
          </div>
          <div class="content">
            <h2>Halo ${username || 'Pengguna'}!</h2>
            <p>Terima kasih telah bergabung dengan Oxdel. Untuk mengaktifkan akun Anda, silakan gunakan kode verifikasi di bawah ini:</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Kode Verifikasi Anda</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #64748b; font-size: 12px;">Kode ini berlaku selama 10 menit</p>
            </div>
            
            <p>Jika Anda tidak merasa mendaftar di Oxdel, abaikan email ini.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p><strong>Apa yang bisa Anda lakukan dengan Oxdel?</strong></p>
              <ul style="color: #64748b;">
                <li>Buat undangan digital yang memukau</li>
                <li>Bangun landing page profesional</li>
                <li>Kelola katalog jasa Anda</li>
                <li>Dapatkan analytics mendalam</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Oxdel. Platform digital terdepan untuk kreativitas Anda.</p>
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  resetPassword: (resetLink, username) => ({
    subject: 'Reset Password Akun Oxdel Anda',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password Oxdel</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .btn { display: inline-block; padding: 15px 30px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Password</h1>
          </div>
          <div class="content">
            <h2>Halo ${username || 'Pengguna'}!</h2>
            <p>Kami menerima permintaan untuk mereset password akun Oxdel Anda.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" class="btn">Reset Password Sekarang</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Penting:</strong></p>
              <ul style="margin: 10px 0;">
                <li>Link ini akan kedaluwarsa dalam 1 jam</li>
                <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                <li>Jangan bagikan link ini kepada siapa pun</li>
              </ul>
            </div>
            
            <p>Jika tombol di atas tidak berfungsi, salin dan tempel link berikut ke browser Anda:</p>
            <p style="word-break: break-all; color: #3b82f6; font-size: 14px;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>© 2025 Oxdel. Keamanan akun Anda adalah prioritas kami.</p>
            <p>Email ini dikirim otomatis, mohon tidak membalas.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  affiliateApproval: (username, referralCode) => ({
    subject: '🎉 Selamat! Aplikasi Affiliate Anda Disetujui',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Affiliate Disetujui - Oxdel</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .code-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .referral-code { font-size: 24px; font-weight: bold; color: #059669; margin: 10px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat Bergabung!</h1>
          </div>
          <div class="content">
            <h2>Halo ${username}!</h2>
            <p>Selamat! Aplikasi affiliate Anda telah <strong>disetujui</strong>. Anda sekarang resmi menjadi bagian dari tim Oxdel Affiliate Program.</p>
            
            <div class="code-box">
              <p style="margin: 0; color: #059669; font-weight: 600;">Kode Referral Anda</p>
              <div class="referral-code">${referralCode}</div>
              <p style="margin: 0; color: #64748b; font-size: 12px;">Gunakan kode ini untuk mendapatkan komisi</p>
            </div>
            
            <h3>Apa selanjutnya?</h3>
            <ul>
              <li>Login ke dashboard affiliate Anda</li>
              <li>Dapatkan link referral khusus</li>
              <li>Mulai promosikan Oxdel</li>
              <li>Dapatkan komisi untuk setiap referral</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Akses Dashboard Affiliate</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <h4>💰 Komisi Affiliate:</h4>
              <ul style="color: #64748b;">
                <li>Rp 10.000 per referral yang mendaftar</li>
                <li>5% dari setiap pembelian template premium</li>
                <li>Bonus bulanan untuk top performer</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Oxdel. Terima kasih telah menjadi partner kami!</p>
            <p>Butuh bantuan? Hubungi support@oxdel.id</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcomeUser: (username) => ({
    subject: '🎉 Selamat Datang di Oxdel - Mari Mulai Berkreasi!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Selamat Datang di Oxdel</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .feature-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 15px 0; }
          .footer { background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Selamat Datang di Oxdel!</h1>
          </div>
          <div class="content">
            <h2>Halo ${username}!</h2>
            <p>Terima kasih telah bergabung dengan Oxdel! Kami sangat senang Anda menjadi bagian dari komunitas kreatif kami.</p>
            
            <h3>🚀 Apa yang bisa Anda lakukan sekarang?</h3>
            
            <div class="feature-box">
              <h4>📱 Buat Undangan Digital</h4>
              <p>Desain undangan pernikahan, ulang tahun, atau acara spesial lainnya dengan template yang memukau.</p>
            </div>
            
            <div class="feature-box">
              <h4>🌐 Bangun Landing Page</h4>
              <p>Buat halaman promosi bisnis atau jasa Anda yang profesional dan menarik.</p>
            </div>
            
            <div class="feature-box">
              <h4>💼 Katalog Jasa</h4>
              <p>Tampilkan layanan Anda dengan portfolio yang menarik dan mudah diakses.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Mulai Berkreasi Sekarang</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <h4>💡 Tips untuk Memulai:</h4>
              <ol style="color: #64748b;">
                <li>Jelajahi koleksi template kami</li>
                <li>Pilih template yang sesuai kebutuhan</li>
                <li>Kustomisasi dengan konten Anda</li>
                <li>Preview dan publikasikan</li>
                <li>Bagikan ke dunia!</li>
              </ol>
            </div>
          </div>
          <div class="footer">
            <p>© 2025 Oxdel. Platform digital untuk kreativitas tanpa batas.</p>
            <p>Butuh bantuan? Hubungi support@oxdel.id</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// ✅ Kirim Email OTP (pendaftaran)
export const sendOtpEmail = async (email, otp, username) => {
  const template = emailTemplates.otp(otp, username);
  
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>',
    to: email,
    subject: template.subject,
    html: template.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email OTP ke ${email}:`, error);
    throw new Error('Gagal mengirim email verifikasi.');
  }
};

// ✅ Kirim Email Reset Password
export const sendResetPasswordEmail = async (email, resetLink, username) => {
  const template = emailTemplates.resetPassword(resetLink, username);
  
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>',
    to: email,
    subject: template.subject,
    html: template.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email reset password berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email reset password ke ${email}:`, error);
    throw new Error('Gagal mengirim email reset password.');
  }
};

// ✅ Kirim Email Affiliate Approval
export const sendAffiliateApprovalEmail = async (email, username, referralCode) => {
  const template = emailTemplates.affiliateApproval(username, referralCode);
  
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>',
    to: email,
    subject: template.subject,
    html: template.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email affiliate approval berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email affiliate approval ke ${email}:`, error);
    throw new Error('Gagal mengirim email affiliate approval.');
  }
};

// ✅ Kirim Email Welcome User
export const sendWelcomeEmail = async (email, username) => {
  const template = emailTemplates.welcomeUser(username);
  
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>',
    to: email,
    subject: template.subject,
    html: template.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email welcome berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email welcome ke ${email}:`, error);
    // Don't throw error for welcome email to not block registration
  }
};

// ✅ Kirim Email Umum (backward compatibility)
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>',
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email berhasil dikirim ke ${to}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email ke ${to}:`, error);
    throw new Error('Gagal mengirim email.');
  }
};