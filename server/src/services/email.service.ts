import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;
const clientUrl = process.env.CLIENT_URL as string;

// Configure Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: email,
//         pass: password,
//     },
// });
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 465, 
  secure: true,
  auth: {
    user: email,
    pass: password,
  },
});
export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${clientUrl}/Account/verify-email?token=${token}`;

    const mailOptions = {
        from:  `"AassPass Support" <${email}>`,
        to,
        subject: "Confirm Your Email Address - AassPass",
        text: `
Thank you for registering with AassPass.

To complete your registration and activate your account, please verify your email address by clicking the link below:

${verificationLink}

This step is required to access your account. If you did not sign up for AassPass, you can safely ignore this email.

Best regards,  
The AassPass Team
        `,
        html: `
            <p>Hi,</p>
            <p>Thank you for registering with <strong>AassPass</strong>.</p>
            <p>To complete your registration and activate your account, please verify your email address by clicking the link below:</p>
            <p><a href="${verificationLink}" style="color: #1a73e8;">Verify My Email</a></p>
            <p>This step is required to access your account. If you did not sign up for AassPass, you can safely ignore this email.</p>
            <p>Best regards,<br/>The AassPass Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending verification email:", error);
    }
};

export const sendResetPasswordEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: `"AassPass Support" <${email}>`,
        to,
        subject: "AassPass Password Reset Request",
        text: `
We received a request to reset your AassPass account password.

Your One-Time Password (OTP) is: ${otp}

Please use this OTP to complete the password reset process. It is valid for a limited time only.

If you did not request a password reset, please ignore this email or contact our support team.

Best regards,  
The AassPass Team
        `,
        html: `
            <p>Hi,</p>
            <p>We received a request to reset your <strong>AassPass</strong> account password.</p>
            <p>Your One-Time Password (OTP) is:</p>
            <p style="font-size: 18px;"><strong>${otp}</strong></p>
            <p>Please use this OTP to complete the password reset process. It is valid for a limited time only.</p>
            <p>If you did not request a password reset, you can safely ignore this email or contact our support team.</p>
            <p>Best regards,<br/>The AassPass Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending reset password email:", error);
    }
};


export const sendIDPasswordEmail = async (adminId: string, to: string, adminPassword: string) => {
    const mailOptions = {
        from: `"AassPass Support" <${email}>`,
        to,
        subject: "Your AassPass Admin Credentials",
        text: `
Welcome to AassPass!

Your admin account has been successfully created. Below are your login credentials:

Admin ID: ${adminId}  
Password: ${adminPassword}

Please keep this information secure. You can log in to your AassPass admin dashboard using these credentials.

If you did not request or expect this email, please contact our support team immediately.

Best regards,  
The AassPass Team
        `,
        html: `
            <p>Hi,</p>
            <p>Welcome to <strong>AassPass</strong>!</p>
            <p>Your admin account has been successfully created. Below are your login credentials:</p>
            <ul>
                <li><strong>Admin ID:</strong> ${adminId}</li>
                <li><strong>Password:</strong> ${adminPassword}</li>
            </ul>
            <p>Please keep this information secure. You can log in to your AassPass admin dashboard using these credentials.</p>
            <p>If you did not request or expect this email, please contact our support team immediately.</p>
            <p>Best regards,<br/>The AassPass Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending admin credentials email:", error);
    }
};


export const sendUserIDPasswordEmail = async (to: string, userPassword: string) => {
    const mailOptions = {
        from: `"AassPass Support" <${email}>`,
        to,
        subject: "Your AassPass Account Credentials",
        text: `
Welcome to AassPass!

Your account has been successfully created. Below are your login details:

Email: ${to}  
Password: ${userPassword}

We recommend changing your password immediately after your first login by using the "Forgot Password" option on the login page.

Thank you for registering your business with AassPass.

Best regards,  
The AassPass Team
        `,
        html: `
            <p>Hi,</p>
            <p>Welcome to <strong>AassPass</strong>!</p>
            <p>Your account has been successfully created. Here are your login credentials:</p>
            <ul>
                <li><strong>Email:</strong> ${to}</li>
                <li><strong>Password:</strong> ${userPassword}</li>
            </ul>
            <p><strong>Important:</strong> Please change your password immediately after your first login using the "Forgot Password" option on the login page.</p>
            <p>Thank you for registering your business with AassPass.</p>
            <p>Best regards,<br/>The AassPass Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending user credentials email:", error);
    }
};

