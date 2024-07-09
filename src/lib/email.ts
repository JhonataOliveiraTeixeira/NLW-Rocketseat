import nodemailer from "nodemailer"

export async function getMailClient() {
    const acconoutn = await nodemailer.createTestAccount()

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: acconoutn.user,
            pass: acconoutn.pass
        }
    }
    )
    return transporter
}