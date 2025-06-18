import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.EMAIL as string;
const password = process.env.PASSWORD as string;
const clientUrl = process.env.CLIENT_URL as string;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: password,
    },
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verificationLink = `${clientUrl}/Account/verify-email?token=${token}`;

    const mailOptions = {
        from: email,
        to,
        subject: "Verify Your Email",
        text: `Click on the link to verify your email: ${verificationLink}`,
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export const sendResetPasswordEmail = async (to: string, otp: string) => {
    const mailOptions = {
        from: email,
        to,
        subject: "Reset Your Password",
        text: `Your OTP for password reset is: ${otp}. This OTP is valid for a limited time only.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. This OTP is valid for a limited time only.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console.log("Password reset email sent to:", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export const sendIDPasswordEmail = async (adminId: string, to: string, adminPassword: string) => {
    const mailOptions = {
        from: email,
        to,
        subject: "Generated Password for user on AasPass",
        text: `For admin registered with Email - ${to}, ID and Password for your registered admin on AasPass's : Admin ID - ${adminId}, Password - ${adminPassword}`,
        html: `<p>For admin registered with Email - <strong>${to}</strong>, ID and Password for your registered user on AasPass's : Admin ID - <strong>${adminId}</strong>, Password - <strong>${adminPassword}</strong></p>
        <br>
        <p>AasPass</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export const sendUserIDPasswordEmail = async (to: string, userPassword: string) => {
    const mailOptions = {
        from: email,
        to,
        subject: "Generated Password for user on AasPass",
        text: `Your ID and Password for your registered user on AasPass's : Email - ${to}, Password - ${userPassword}`,
        html: `<p>Your Password for your registered user on AasPass's : Email - <strong>${to}</strong>, Password - <strong>${userPassword}</strong></p>
        <p>Change this password by choosing forget password option</p>
        <p>Thank you for registering your business</p>
        <br>
        <p>AasPass</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


