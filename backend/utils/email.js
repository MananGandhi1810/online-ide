import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const resendEmail = process.env.RESEND_EMAIL;
const resendApiKey = process.env.RESEND_API_KEY;

const resend = new Resend(resendApiKey);

const sendEmail = async (to, subject, html) => {
    await resend.emails.send({
        from: `Manan <${resendEmail}>`,
        to: [to],
        subject: subject,
        html: html,
    });
};

export default sendEmail;
