const nodemailer = require('nodemailer');

async function sendConfirmationMail(useremail,username){
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'todotyapp@gmail.com',
                pass: 'Todoty2021'
            }
        });

        let mailOptions = {
            from: 'todotyapp@gmail.com',
            to: `${useremail}`,
            subject: 'Sending Email using Node.js',
            text: `Welcome to our Familia ${username}!`
        };
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = sendConfirmationMail
