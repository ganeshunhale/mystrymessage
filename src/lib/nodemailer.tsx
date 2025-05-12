import nodemailer from "nodemailer"

console.log("EMAIL_USER",process.env.EMAIL_USER,"EMAIL_PASS",process.env.EMAIL_PASS);

export const transporter = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    }
)
