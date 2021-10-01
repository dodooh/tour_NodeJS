const nodemailer = require('nodemailer')

const sendEmail = async options => {
    // 1. create a transporter
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        // activate in gmail "less secure app" options
    })
    // 2. defined the email options
    const mailOptions = {
        from: 'Nguyen <nguyen26s@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: 
    }
    // 3. actually send the email
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail