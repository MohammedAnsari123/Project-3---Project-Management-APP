const nodemailer = require('nodemailer');

const sendInvitationEmail = async (email, projectTitle, inviteLink) => {
    try {
        // Create transporter
        // NOTE: User must configure these env vars
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use host/port for other providers
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Invitation to join ${projectTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0052CC;">You've been invited!</h2>
                    <p>You have been invited to join the project <strong>${projectTitle}</strong> on BugTracker.</p>
                    <p>Click the link below to create your account and join the team:</p>
                    <a href="${inviteLink}" style="display: inline-block; background-color: #0052CC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Join Project</a>
                    <p>If you already have an account, simply log in and you will see the project in your dashboard (after the admin adds you directly if you are a registered user).</p>
                    <p style="color: #666; font-size: 12px;">If you didn't expect this invitation, you can ignore this email.</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const sendAddedNotification = async (email, projectTitle) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Added to ${projectTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #00875A;">You're in!</h2>
                    <p>You have been added to the project <strong>${projectTitle}</strong> on BugTracker.</p>
                    <p>Log in to your dashboard to collaborate.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending added notification:', error);
        return false;
    }
};

module.exports = { sendInvitationEmail, sendAddedNotification };
