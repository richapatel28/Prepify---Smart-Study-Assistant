import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create transporter using SMTP (example using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password or actual password
      },
    });

    const mailOptions = {
      from: `"Smart Study Assistant" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to", to);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
};
