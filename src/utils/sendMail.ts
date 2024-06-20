import nodemailer from 'nodemailer';

export default async function sendMail(to: string, subject: string, text: string) {
    const user = process.env.GMAIL;
    const pass = process.env.GMAIL_PASSWORD;
    const host = process.env.GMAIL_HOST;
    const port = Number(process.env.GMAIL_PORT);

    const transporter = nodemailer.createTransport({ host, port, secure: true, auth: { user, pass } });
    const mailOptions = { from: user, to, subject, html: text };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export const getPasswordResetHTML = (firstName: string, otp: string) => `
    <div style="font-family: Arial, Helvetica, sans-serif;">
        <header>
            <img src="https://res.cloudinary.com/dsgqulmnp/image/upload/v1718721138/Screen_Shot_2024-06-18_at_3.29.21_PM_vcng25.png" alt="Allroutes logo" width="200">
        </header>
        <main style="border-top: 1px solid rgb(218, 216, 216); border-bottom: 1px solid rgb(218, 216, 216);">
            <p>Hello ${firstName},</p>
            <p>To reset your AllRoutes account password, please use the following code for verification</p>
            <p style="background-color: rgb(29, 68, 24); color: white; padding: 10px; margin: 20px 0; width: 150px; text-align: center; font-weight: 700; border-radius: 20px; letter-spacing: 4px;">${otp}</p>
            <p>This code expires in 30 minutes.</p>
        </main>
        <footer style="color:rgb(64, 81, 60)">
            <p>© AllRoutes Logistics. All Rights Reserved</p>
        </footer>
    </div>
`

