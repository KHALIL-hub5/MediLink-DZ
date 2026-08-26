import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT),

    secure: false,

    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async testMail() {
    this.transporter.verify((err, success) => {
      if (err) console.error("SMTP connection failed:", err);
      else console.log("SMTP server is ready to send messages");
    });

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,

      to: "djaidjasarra26@gmail.com",

      subject: "MediLink test",

      text: "Email works goooooooooooooooooooooooooooood now",
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `http://localhost:3000/api/v1/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,

      to: email,

      subject: "Verify your MediLink DZ account",

      html: `

<h2>MediLink DZ</h2>

<p>
Welcome. Verify your account:
</p>

<a href="${url}">
Verify Account
</a>

`,
    });
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const url = `http://localhost:3000/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,

      to: email,

      subject: "Reset your MediLink DZ password",

      html: `

<h2>MediLink DZ</h2>

<p>
You requested a password reset.
</p>

<p>
Click here:
</p>

<a href="${url}">
Reset Password
</a>

<p>
This link expires in 15 minutes.
</p>

`,
    });
  }
}
