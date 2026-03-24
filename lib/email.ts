import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/verify?token=${token}`
  await transporter.sendMail({
    from: `"EarthPulse" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '✅ Verify your EarthPulse account',
    html: `
      <div style="font-family:Arial,sans-serif;background:#030a0f;color:#e8f5f0;padding:40px;border-radius:12px;max-width:520px;margin:auto">
        <h2 style="color:#00ffa3;font-size:22px">Welcome to EarthPulse 🌍</h2>
        <p>Hi ${name || email},</p>
        <p style="color:rgba(232,245,240,0.7)">Click below to verify your email address and activate your account:</p>
        <a href="${verifyUrl}" style="display:inline-block;margin:20px 0;padding:12px 28px;background:rgba(0,255,163,0.15);border:1px solid #00ffa3;color:#00ffa3;text-decoration:none;border-radius:8px;font-weight:600">
          ✅ Verify Email
        </a>
        <p style="color:rgba(232,245,240,0.4);font-size:12px">Or copy this link: ${verifyUrl}</p>
        <p style="color:rgba(232,245,240,0.3);font-size:11px;margin-top:30px">This link expires in 24 hours. If you didn't register, ignore this email.</p>
      </div>
    `,
  })
}
