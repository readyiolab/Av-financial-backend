// src/services/emailService.js
const path = require("path");
const fs = require("fs").promises;
const transporter = require("../utils/transporter");

class EmailService {
  constructor() {
    this.transporter = transporter;
    this.fromEmail = process.env.GMAIL_USER || "psurya162@gmail.com"; // Gmail account for sending
    this.displayEmail = "shrutep@avfinancial.com"; // Display email for clients
    this.adminEmail = "shrutep@avfinancial.com"; // All notifications go here
    this.companyName = "AV Financial Partners";
    this.websiteUrl = "https://avfinancial.com/";
  }

  /**
   * Send PDF guide to user with attachment
   */
  async sendPDFEmail(data) {
    const { name, email, pdf } = data;
    const pdfPath = path.join(__dirname, "../public/pdfs", pdf);

    try {
      // Verify PDF exists
      await fs.access(pdfPath);

      const mailOptions = {
        from: `"${this.companyName}" <${this.displayEmail}>`, // Shows as shrutep@avfinancial.com
        replyTo: this.displayEmail, // Replies go to shrutep@avfinancial.com
        to: email,
        subject: `Your Free Financial Guide: ${pdf.replace('.pdf', '')}`,
        html: this.generateUserEmailHTML(name, pdf),
        attachments: [
          {
            filename: pdf,
            path: pdfPath,
            contentType: "application/pdf",
          },
        ],
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ PDF email sent to ${email} - Message ID: ${result.messageId}`);
      return result;
    } catch (err) {
      console.error("❌ Error sending PDF email:", err);
      throw new Error(`Failed to send PDF email: ${err.message}`);
    }
  }

  /**
   * Send admin notification for new application
   */
  async sendAdminNotification(data) {
    const { name, email, phone, pdf } = data;

    const mailOptions = {
      from: `"${this.companyName}" <${this.fromEmail}>`, // Admin emails from Gmail
      to: this.adminEmail, // Goes to shrutep@avfinancial.com
      subject: `New PDF Download Request: ${pdf.replace('.pdf', '')}`,
      html: this.generateAdminEmailHTML(name, email, phone, pdf),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Admin notification sent to ${this.adminEmail} - Message ID: ${result.messageId}`);
      return result;
    } catch (err) {
      console.error("❌ Error sending admin notification:", err);
      throw new Error(`Failed to send admin notification: ${err.message}`);
    }
  }

  /**
   * Send contact form inquiry to admin
   */
  async sendContactInquiry(data) {
    const { name, email, phone, inquiry_type, message } = data;

    const mailOptions = {
      from: `"${this.companyName}" <${this.fromEmail}>`, // Admin emails from Gmail
      to: this.adminEmail, // Goes to shrutep@avfinancial.com
      subject: `New ${inquiry_type.charAt(0).toUpperCase() + inquiry_type.slice(1)} Inquiry from ${name}`,
      html: this.generateContactEmailHTML(name, email, phone, inquiry_type, message),
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Contact inquiry sent to ${this.adminEmail} - Message ID: ${result.messageId}`);
      return result;
    } catch (err) {
      console.error("❌ Error sending contact inquiry:", err);
      throw new Error(`Failed to send contact inquiry: ${err.message}`);
    }
  }

  /**
   * Generate HTML email for user who downloads PDF
   */
  generateUserEmailHTML(name, pdfTitle) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Financial Guide</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
        <div style="background-color:#f3f4f6; padding:20px;">
          <div style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
            
            <!-- Header with Logo -->
            <div style="background: linear-gradient(135deg, #1a2957 0%, #2563eb 100%); padding:30px; text-align:center;">
              <h1 style="color:#ffffff; font-size:24px; margin:20px 0 0; font-weight:600;">Your Financial Guide is Ready!</h1>
            </div>
            
            <!-- Main Content -->
            <div style="padding:40px 30px; color:#333333;">
              <h2 style="color:#1a2957; font-size:22px; margin:0 0 20px; font-weight:600;">Hello ${name},</h2>
              
              <p style="font-size:16px; line-height:1.7; margin-bottom:15px; color:#4b5563;">
                Thank you for downloading <strong style="color:#1a2957;">${pdfTitle.replace('.pdf', '')}</strong>! 
                Your comprehensive financial guide is attached to this email.
              </p>
              
              <div style="background-color:#f0f9ff; border-left:4px solid #2563eb; padding:20px; margin:25px 0; border-radius:6px;">
                <p style="font-size:15px; line-height:1.7; margin:0; color:#1e40af;">
                  <strong>💡 Inside Your Guide:</strong><br>
                  Expert strategies and actionable steps to help you make informed financial decisions with confidence.
                </p>
              </div>
              
              <p style="font-size:16px; line-height:1.7; margin-bottom:25px; color:#4b5563;">
                We're committed to helping you achieve financial security and peace of mind. 
                If you have any questions or would like personalized guidance, we're here to help!
              </p>
              
              <!-- CTA Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${this.websiteUrl}/contact" 
                   style="background-color:#2563eb; color:#ffffff; padding:14px 32px; border-radius:8px; font-size:16px; font-weight:600; text-decoration:none; display:inline-block; box-shadow:0 4px 6px rgba(37,99,235,0.3);">
                  Schedule a Free Consultation
                </a>
              </div>
              
              <div style="margin-top:30px; padding-top:25px; border-top:1px solid #e5e7eb;">
                <p style="font-size:15px; line-height:1.6; color:#6b7280; margin:0;">
                  Best regards,<br>
                  <strong style="color:#1a2957;">The ${this.companyName} Team</strong>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color:#1a2957; color:#ffffff; padding:25px; text-align:center; font-size:13px;">
              <p style="margin:0 0 10px;">&copy; 2025 ${this.companyName}. All rights reserved.</p>
              <p style="margin:5px 0;">
                <a href="${this.websiteUrl}/privacy" style="color:#93c5fd; text-decoration:none; margin:0 8px;">Privacy Policy</a> |
                <a href="${this.websiteUrl}/terms" style="color:#93c5fd; text-decoration:none; margin:0 8px;">Terms</a> |
                <a href="${this.websiteUrl}/contact" style="color:#93c5fd; text-decoration:none; margin:0 8px;">Contact Us</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML email for admin notification (PDF download)
   */
  generateAdminEmailHTML(name, email, phone, pdfTitle) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New PDF Download Request</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a2957 0%, #2563eb 100%); padding:25px; text-align:center;">
            <h2 style="color:#ffffff; font-size:22px; margin:0; font-weight:600;">
              📥 New PDF Download Request
            </h2>
          </div>
          
          <!-- Content -->
          <div style="padding:30px;">
            <div style="background-color:#fef3c7; border-left:4px solid #f59e0b; padding:15px; margin-bottom:25px; border-radius:6px;">
              <p style="margin:0; color:#92400e; font-size:14px;">
                <strong>⚡ Action Required:</strong> A new lead has downloaded a financial guide.
              </p>
            </div>
            
            <!-- Lead Information -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:25px;">
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957; width:140px;">
                  Full Name:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957;">
                  Email:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957;">
                  Phone:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  <a href="tel:${phone}" style="color:#2563eb; text-decoration:none;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; font-weight:600; color:#1a2957;">
                  PDF Downloaded:
                </td>
                <td style="padding:12px 0; color:#4b5563;">
                  <strong style="color:#059669;">${pdfTitle.replace('.pdf', '')}</strong>
                </td>
              </tr>
            </table>
            
            <!-- Action Items -->
            <div style="background-color:#eff6ff; padding:20px; border-radius:8px; margin-bottom:20px;">
              <h3 style="margin:0 0 15px; color:#1e40af; font-size:16px;">📋 Recommended Follow-up Actions:</h3>
              <ul style="margin:0; padding-left:20px; color:#1e40af;">
                <li style="margin-bottom:8px; line-height:1.6;">Send a personalized follow-up email within 24 hours</li>
                <li style="margin-bottom:8px; line-height:1.6;">Schedule a consultation call if interested</li>
                <li style="margin-bottom:8px; line-height:1.6;">Add to CRM and nurture sequence</li>
                <li style="line-height:1.6;">Monitor engagement with future communications</li>
              </ul>
            </div>
            
            <p style="font-size:13px; color:#6b7280; margin:20px 0 0; text-align:center;">
              Received on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
            <p style="margin:0;">&copy; 2025 ${this.companyName} Admin Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate HTML email for contact form inquiries
   */
  generateContactEmailHTML(name, email, phone, inquiry_type, message) {
    const inquiryLabels = {
      coaching: '🎯 Financial Coaching',
      workshop: '📚 Workshop Inquiry',
      general: '💬 General Question',
      testimonial: '⭐ Testimonial'
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Inquiry</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: Arial, sans-serif;">
        <div style="max-width:600px; margin:20px auto; background-color:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a2957 0%, #2563eb 100%); padding:25px; text-align:center;">
            <h2 style="color:#ffffff; font-size:22px; margin:0; font-weight:600;">
              ${inquiryLabels[inquiry_type] || '📧 New Contact Inquiry'}
            </h2>
          </div>
          
          <!-- Content -->
          <div style="padding:30px;">
            <!-- Contact Information -->
            <table style="width:100%; border-collapse:collapse; margin-bottom:25px;">
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957; width:140px;">
                  Full Name:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  ${name}
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957;">
                  Email:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; font-weight:600; color:#1a2957;">
                  Phone:
                </td>
                <td style="padding:12px 0; border-bottom:1px solid #e5e7eb; color:#4b5563;">
                  <a href="tel:${phone}" style="color:#2563eb; text-decoration:none;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 0; font-weight:600; color:#1a2957;">
                  Inquiry Type:
                </td>
                <td style="padding:12px 0; color:#4b5563;">
                  <span style="background-color:#dbeafe; color:#1e40af; padding:4px 12px; border-radius:12px; font-size:13px; font-weight:600;">
                    ${inquiry_type.charAt(0).toUpperCase() + inquiry_type.slice(1)}
                  </span>
                </td>
              </tr>
            </table>
            
            <!-- Message -->
            <div style="background-color:#f9fafb; padding:20px; border-radius:8px; margin-bottom:20px; border-left:4px solid #2563eb;">
              <h3 style="margin:0 0 12px; color:#1a2957; font-size:15px; font-weight:600;">Message:</h3>
              <p style="margin:0; color:#4b5563; font-size:14px; line-height:1.7; white-space:pre-wrap;">
${message}
              </p>
            </div>
            
            <p style="font-size:13px; color:#6b7280; margin:20px 0 0; text-align:center;">
              Received on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
            <p style="margin:0;">&copy; 2025 ${this.companyName} Admin Portal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();