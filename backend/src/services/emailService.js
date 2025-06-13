// ----------------------------------------------------
import nodemailer from 'nodemailer';

// Transporter reusable (1x deklarasi saja)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_PORT == 465, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER, // LOGIN pakai akun Brevo Anda
    pass: process.env.SMTP_PASS,
  },
});

// ✅ Kirim Email OTP (pendaftaran)
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>', // ✅ From pakai email diverifikasi
    to: email,
    subject: `Kode Verifikasi Oxdel Anda: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #0056b3;">Verifikasi Akun Oxdel Anda</h2>
        <p>Terima kasih telah mendaftar. Gunakan kode OTP di bawah ini untuk mengaktifkan akun Anda.</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px; border-radius: 8px; display: inline-block;">
          ${otp}
        </p>
        <p>Kode ini hanya berlaku selama 10 menit.</p>
        <p style="font-size: 12px; color: #777;">Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
      </div>
    `,
  };

  console.log('📨 Sending OTP email with config:');
  console.log({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    from: 'info@oxdel.id',
  });

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email OTP berhasil dikirim ke ${email}`);
  } catch (error) {
    console.error(`❌ Gagal mengirim email OTP ke ${email}:`, error);
    throw new Error('Gagal mengirim email verifikasi.');
  }
};

// ✅ Kirim Email Umum (reset password, notifikasi, dll)
export const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: '"Oxdel Platform" <info@oxdel.id>', // ✅ Selalu gunakan sender diverifikasi
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
