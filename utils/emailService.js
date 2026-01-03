const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Test email connection
if (process.env.SENDGRID_API_KEY) {
    console.log('✅ SendGrid configured');
} else {
    console.warn('⚠️ SendGrid API key not configured');
}

// Send notification to admin
exports.sendNotificationToAdmin = async (messageData) => {
    try {
        const msg = {
            to: process.env.ADMIN_EMAIL,
            from: process.env.EMAIL_FROM || 'portfolio@shayan.co.in',
            subject: `📨 New Message from ${messageData.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 10px 0;">
                            <strong style="color: #2c3e50;">👤 Name:</strong><br>
                            <span style="font-size: 16px;">${messageData.name}</span>
                        </p>
                        
                        <p style="margin: 10px 0;">
                            <strong style="color: #2c3e50;">📧 Email:</strong><br>
                            <span style="font-size: 16px;">
                                <a href="mailto:${messageData.email}" style="color: #3498db;">
                                    ${messageData.email}
                                </a>
                            </span>
                        </p>
                        
                        <p style="margin: 10px 0;">
                            <strong style="color: #2c3e50;">📝 Message:</strong><br>
                            <div style="background: white; padding: 15px; border-radius: 3px; margin-top: 5px; border-left: 4px solid #3498db;">
                                ${messageData.message.replace(/\n/g, '<br>')}
                            </div>
                        </p>
                        
                        ${messageData.file ? `
                        <p style="margin: 10px 0;">
                            <strong style="color: #2c3e50;">📎 File Attached:</strong><br>
                            <span style="color: #666;">${messageData.file.originalName || 'File'}</span>
                        </p>
                        ` : ''}
                        
                        <p style="margin: 10px 0; color: #666; font-size: 12px;">
                            <strong>🕒 Received:</strong> ${new Date().toLocaleString()}<br>
                            <strong>🌐 Source:</strong> ${messageData.website || 'shayan.co.in'}
                        </p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 15px; background: #e8f4fc; border-radius: 5px;">
                        <p style="margin: 0; color: #2c3e50;">
                            <strong>Quick Actions:</strong><br>
                            • <a href="mailto:${messageData.email}" style="color: #3498db;">Reply to ${messageData.name}</a><br>
                            • View all messages in your admin panel
                        </p>
                    </div>
                    
                    <p style="color: #888; font-size: 11px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
                        This is an automated notification from your portfolio website.
                    </p>
                </div>
            `
        };

        await sgMail.send(msg);
        console.log('📧 Notification email sent via SendGrid');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error sending notification email:', error.response?.body || error.message);
        return { success: false, error: error.message };
    }
};

// Send auto-reply to visitor
exports.sendAutoReplyToVisitor = async (toEmail, toName) => {
    try {
        const msg = {
            to: toEmail,
            from: process.env.EMAIL_FROM || 'portfolio@shayan.co.in',
            subject: 'Thank you for your message!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333; border-bottom: 3px solid #3498db; padding-bottom: 10px;">
                        Thank You for Reaching Out!
                    </h2>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        Hi <strong>${toName}</strong>,
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        I've received your message through my portfolio website and will get back to you 
                        as soon as possible. I typically respond within 24-48 hours.
                    </p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; color: #2c3e50;">
                            <strong>📌 What happens next?</strong><br>
                            1. I'll review your message carefully<br>
                            2. Prepare a thoughtful response<br>
                            3. Get back to you via email
                        </p>
                    </div>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        In the meantime, you can:
                    </p>
                    
                    <ul style="font-size: 16px; line-height: 1.6;">
                        <li>Check out my other projects on <a href="https://shayan.co.in" style="color: #3498db;">my portfolio</a></li>
                        <li>Connect with me on <a href="https://linkedin.com/in/yourprofile" style="color: #3498db;">LinkedIn</a></li>
                        <li>Browse my code on <a href="https://github.com/yourusername" style="color: #3498db;">GitHub</a></li>
                    </ul>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                        Best regards,<br>
                        <strong>Shayan</strong><br>
                        <em>Full Stack Developer</em>
                    </p>
                    
                    <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee;">
                        <p style="color: #888; font-size: 11px; margin: 0;">
                            This is an automated response. Please do not reply to this email.<br>
                            If you need to send additional information, please use the contact form again.
                        </p>
                    </div>
                </div>
            `
        };

        await sgMail.send(msg);
        console.log('📧 Auto-reply sent to visitor via SendGrid');
        return { success: true };
        
    } catch (error) {
        console.error('❌ Error sending auto-reply:', error.response?.body || error.message);
        return { success: false, error: error.message };
    }
};

// Test email function
exports.testEmail = async () => {
    try {
        const msg = {
            to: process.env.ADMIN_EMAIL,
            from: process.env.EMAIL_FROM || 'portfolio@shayan.co.in',
            subject: '✅ Portfolio Email Test Successful',
            text: 'Your portfolio website email system is working correctly!',
            html: '<h2>✅ Email Test Successful</h2><p>Your portfolio website can now send emails via SendGrid.</p>'
        };

        await sgMail.send(msg);
        console.log('✅ Test email sent successfully via SendGrid');
        return true;
    } catch (error) {
        console.error('❌ Test email failed:', error.response?.body || error.message);
        return false;
    }
};