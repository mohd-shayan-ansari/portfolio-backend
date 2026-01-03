const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Test email connection
if (process.env.SENDGRID_API_KEY) {
    console.log('✅ SendGrid configured');
} else {
    console.warn('⚠️ SendGrid API key not configured');
}

// Get proper from address with name
const getFromAddress = () => {
    const fromEnv = process.env.EMAIL_FROM || 'portfolio@shayan.co.in';
    
    // If it doesn't have a name, add one
    if (!fromEnv.includes('"') && !fromEnv.includes('<')) {
        return `"Shayan - Portfolio Website" <${fromEnv}>`;
    }
    return fromEnv;
};

// Send notification to admin
exports.sendNotificationToAdmin = async (messageData) => {
    try {
        const fromAddress = getFromAddress();
        const msg = {
            to: process.env.ADMIN_EMAIL,
            from: fromAddress,
            subject: `📨 New Message from ${messageData.name} - Portfolio Contact`,
            // Plain text version (better for deliverability)
            text: `
NEW CONTACT FORM SUBMISSION

Name: ${messageData.name}
Email: ${messageData.email}
Message: ${messageData.message}

${messageData.file ? `File: ${messageData.file.originalName || 'File attached'}` : ''}

Received: ${new Date().toLocaleString()}
Source: shayan.co.in

---
This is an automated notification from your portfolio website.
            `,
            // HTML version
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Message from ${messageData.name}</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">📨 New Contact Form Submission</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9;">Portfolio Website Notification</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
                        
                        <!-- Sender Info -->
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                👤 Contact Details
                            </h2>
                            
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; width: 100px; font-weight: bold; color: #555;">Name:</td>
                                    <td style="padding: 8px 0; font-size: 16px;">${messageData.name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                                    <td style="padding: 8px 0;">
                                        <a href="mailto:${messageData.email}" style="color: #667eea; text-decoration: none; font-weight: 500;">
                                            ${messageData.email}
                                        </a>
                                    </td>
                                </tr>
                                ${messageData.file ? `
                                <tr>
                                    <td style="padding: 8px 0; font-weight: bold; color: #555;">File:</td>
                                    <td style="padding: 8px 0; color: #666;">
                                        📎 ${messageData.file.originalName || 'File attached'} 
                                        (${Math.round(messageData.file.size / 1024)} KB)
                                    </td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>
                        
                        <!-- Message -->
                        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                            <h2 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                📝 Message
                            </h2>
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea; margin-top: 10px;">
                                ${messageData.message.replace(/\n/g, '<br>')}
                            </div>
                        </div>
                        
                        <!-- Metadata -->
                        <div style="background: #e8f4fc; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; font-size: 13px; color: #2c3e50;">
                            <p style="margin: 5px 0;">
                                <strong>🕒 Received:</strong> ${new Date().toLocaleString()}
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>🌐 Source:</strong> shayan.co.in
                            </p>
                            <p style="margin: 5px 0;">
                                <strong>🔗 Message ID:</strong> ${Date.now()}
                            </p>
                        </div>
                        
                        <!-- Actions -->
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="mailto:${messageData.email}" 
                               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                ✉️ Reply to ${messageData.name.split(' ')[0]}
                            </a>
                            <p style="margin-top: 10px; font-size: 12px; color: #777;">
                                This link will open your email client with ${messageData.email} as recipient
                            </p>
                        </div>
                        
                    </div>
                    
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
                        <p style="margin: 5px 0;">
                            This is an automated notification from your portfolio website.
                        </p>
                        <p style="margin: 5px 0;">
                            💻 Powered by SendGrid • 🚀 Deployed on Render
                        </p>
                    </div>
                    
                </body>
                </html>
            `,
            // Important headers for deliverability
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high'
            },
            // Email categories for analytics
            categories: ['portfolio-contact', 'notification'],
            // Custom args for tracking
            customArgs: {
                source: 'portfolio_website',
                type: 'admin_notification'
            }
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
        const fromAddress = getFromAddress();
        const firstName = toName.split(' ')[0] || toName;
        
        const msg = {
            to: toEmail,
            from: fromAddress,
            subject: 'Thank you for your message, ' + firstName + '!',
            // Plain text version
            text: `
Hi ${firstName},

Thank you for reaching out through my portfolio website!

I've received your message and will get back to you as soon as possible. I typically respond within 24-48 hours.

📌 What happens next?
1. I'll review your message carefully
2. Prepare a thoughtful response
3. Get back to you via email

In the meantime, you can:
• Check out my other projects on https://shayan.co.in
• Connect with me on LinkedIn
• Browse my code on GitHub

Best regards,
Shayan
Full Stack Developer

---
This is an automated response. Please do not reply to this email.
If you need to send additional information, please use the contact form again.
            `,
            // HTML version
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thank you for your message</title>
                </head>
                <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                    
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 40px; border-radius: 10px 10px 0 0; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">✅ Message Received!</h1>
                        <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Thank you for contacting me</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="background: #f9f9f9; padding: 40px; border-radius: 0 0 10px 10px; border: 1px solid #eee;">
                        
                        <!-- Greeting -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Hi ${firstName}! 👋</h2>
                            <p style="font-size: 16px; color: #555;">
                                I've received your message through my portfolio website and will get back to you 
                                as soon as possible.
                            </p>
                        </div>
                        
                        <!-- Timeline -->
                        <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
                            <h3 style="color: #2c3e50; margin-top: 0; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
                                📌 What happens next?
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 15px; margin-top: 20px;">
                                <div style="display: flex; align-items: flex-start;">
                                    <div style="background: #4CAF50; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">
                                        1
                                    </div>
                                    <div>
                                        <strong style="color: #2c3e50;">I'll review your message carefully</strong>
                                        <p style="margin: 5px 0 0; color: #666;">Reading through your inquiry to understand your needs</p>
                                    </div>
                                </div>
                                
                                <div style="display: flex; align-items: flex-start;">
                                    <div style="background: #4CAF50; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">
                                        2
                                    </div>
                                    <div>
                                        <strong style="color: #2c3e50;">Prepare a thoughtful response</strong>
                                        <p style="margin: 5px 0 0; color: #666;">Crafting a detailed reply to address your questions</p>
                                    </div>
                                </div>
                                
                                <div style="display: flex; align-items: flex-start;">
                                    <div style="background: #4CAF50; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0;">
                                        3
                                    </div>
                                    <div>
                                        <strong style="color: #2c3e50;">Get back to you via email</strong>
                                        <p style="margin: 5px 0 0; color: #666;">You'll hear from me within 24-48 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Links -->
                        <div style="background: #e8f5e9; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #4CAF50;">
                            <h3 style="color: #2c3e50; margin-top: 0;">🔗 Explore More</h3>
                            <p style="color: #555;">In the meantime, you can:</p>
                            <ul style="color: #555; padding-left: 20px;">
                                <li style="margin-bottom: 10px;">
                                    <strong>📁 Check out my projects</strong><br>
                                    <a href="https://shayan.co.in" style="color: #4CAF50; text-decoration: none;">shayan.co.in →</a>
                                </li>
                                <li style="margin-bottom: 10px;">
                                    <strong>💼 Connect professionally</strong><br>
                                    <a href="https://www.linkedin.com/in/shayan-32b672381/" style="color: #4CAF50; text-decoration: none;">LinkedIn Profile →</a>
                                </li>
                                <li>
                                    <strong>💻 Browse my code</strong><br>
                                    <a href="https://github.com/mohd-shayan-ansari" style="color: #4CAF50; text-decoration: none;">GitHub Repository →</a>
                                </li>
                            </ul>
                        </div>
                        
                        <!-- Signature -->
                        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; margin-top: 30px;">
                            <p style="font-size: 16px; color: #555; margin: 0;">
                                Best regards,<br>
                                <strong style="color: #2c3e50; font-size: 18px;">Shayan</strong><br>
                                <span style="color: #4CAF50; font-style: italic;">Full Stack Developer</span>
                            </p>
                        </div>
                        
                    </div>
                    
                    <!-- Footer -->
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
                        <p style="margin: 5px 0;">
                            This is an automated response. Please do not reply to this email.
                        </p>
                        <p style="margin: 5px 0;">
                            If you need to send additional information, please use the contact form again.
                        </p>
                        <p style="margin: 5px 0; font-size: 11px;">
                            💌 Sent via SendGrid • 🚀 Portfolio Notification System
                        </p>
                    </div>
                    
                </body>
                </html>
            `,
            // Important headers
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High'
            },
            categories: ['portfolio-contact', 'auto-reply'],
            customArgs: {
                source: 'portfolio_website',
                type: 'auto_reply',
                visitor_name: firstName
            }
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
        const fromAddress = getFromAddress();
        const msg = {
            to: process.env.ADMIN_EMAIL,
            from: fromAddress,
            subject: '✅ Portfolio Email System Test - Working Correctly',
            text: 'Your portfolio website email system is working correctly! This is a test email to verify deliverability.',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white; margin-bottom: 20px;">
                        <h1 style="margin: 0;">✅ Email Test Successful</h1>
                        <p style="margin: 10px 0 0;">Your portfolio website can now send emails</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 5px;">
                        <p>Hello,</p>
                        <p>This test email confirms that your portfolio website email notification system is working correctly.</p>
                        <p><strong>System Details:</strong></p>
                        <ul>
                            <li>Service: SendGrid</li>
                            <li>Type: Transactional Emails</li>
                            <li>Status: Active</li>
                            <li>Timestamp: ${new Date().toLocaleString()}</li>
                        </ul>
                        <p>When someone submits your contact form:</p>
                        <ol>
                            <li>You will receive a notification email</li>
                            <li>Visitor will receive an auto-reply</li>
                            <li>All data will be saved to database</li>
                        </ol>
                        <p style="text-align: center; margin-top: 30px;">
                            <span style="background: #28a745; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block;">
                                🎉 System Ready for Production!
                            </span>
                        </p>
                    </div>
                </div>
            `,
            categories: ['portfolio-contact', 'test'],
            customArgs: {
                source: 'portfolio_website',
                type: 'test_email'
            }
        };

        await sgMail.send(msg);
        console.log('✅ Test email sent successfully via SendGrid');
        return true;
    } catch (error) {
        console.error('❌ Test email failed:', error.response?.body || error.message);
        return false;
    }
};