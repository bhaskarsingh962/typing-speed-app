import nodemailer from 'nodemailer';

const sendEmail = async(options) =>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    }) 

    const mailOptions = {
        from: `Typing Test App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(mailOptions);
}

 export {sendEmail};