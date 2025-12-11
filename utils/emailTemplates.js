// utils/emailTemplates.js
// Helper functions for email templates

const createEmailWrapper = (content, unsubscribeUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Unsubscribe Section -->
          <tr>
            <td style="padding: 30px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0;">
            
              <p style="margin: 0; font-size: 12px; color: #6c757d;">
                <a href="${unsubscribeUrl}" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a> from this list
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #ffffff;">
              <p style="margin: 0; font-size: 12px; color: #6c757d; line-height: 1.8;">
                <strong>Karman Singh</strong><br>
                Building generational wealth through purpose-driven financial strategies<br>
                <a href="mailto:admin@singhkarman.com" style="color: #6c757d; text-decoration: none;">admin@singhkarman.com</a> | (206) 801-0330
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const sampleTemplates = {
  weekly_update: `
<h2 style="color: #2c3e50; margin-top: 0;">This Week's Financial Insights</h2>
<p style="color: #34495e; line-height: 1.6;">Hi there,</p>
<p style="color: #34495e; line-height: 1.6;">
  Welcome to this week's newsletter! Here are the key financial insights you need to know:
</p>

<div style="background-color: #e8f4f8; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
  <h3 style="color: #2c3e50; margin-top: 0;">📈 Market Update</h3>
  <p style="color: #34495e; line-height: 1.6; margin-bottom: 0;">
    [Add your market analysis here]
  </p>
</div>

<div style="background-color: #fef9e7; border-left: 4px solid #f39c12; padding: 15px; margin: 20px 0;">
  <h3 style="color: #2c3e50; margin-top: 0;">💡 Investment Tip of the Week</h3>
  <p style="color: #34495e; line-height: 1.6; margin-bottom: 0;">
    [Add your investment tip here]
  </p>
</div>

<div style="background-color: #e8f8f5; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0;">
  <h3 style="color: #2c3e50; margin-top: 0;">🎯 Action Items</h3>
  <ul style="color: #34495e; line-height: 1.8;">
    <li>Review your portfolio allocation</li>
    <li>Check your emergency fund</li>
    <li>Consider tax-loss harvesting opportunities</li>
  </ul>
</div>

<p style="color: #34495e; line-height: 1.6;">
  Have questions? Reply to this email and I'll get back to you.
</p>

<p style="color: #34495e; line-height: 1.6;">
  Best regards,<br>
  <strong>Karman Singh</strong>
</p>
  `,

  announcement: `
<h2 style="color: #2c3e50; margin-top: 0;">Important Announcement</h2>
<p style="color: #34495e; line-height: 1.6;">Hi there,</p>
<p style="color: #34495e; line-height: 1.6;">
  I wanted to share some exciting news with you:
</p>

<div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 5px; padding: 20px; margin: 20px 0;">
  <p style="color: #856404; font-size: 16px; line-height: 1.6; margin: 0;">
    [Add your announcement here]
  </p>
</div>

<p style="color: #34495e; line-height: 1.6;">
  Thank you for being part of this journey!
</p>

<p style="color: #34495e; line-height: 1.6;">
  Best regards,<br>
  <strong>Karman Singh</strong>
</p>
  `,

  educational: `
<h2 style="color: #2c3e50; margin-top: 0;">Financial Education Series</h2>
<p style="color: #34495e; line-height: 1.6;">Hi there,</p>
<p style="color: #34495e; line-height: 1.6;">
  Today, let's dive into an important financial concept:
</p>

<h3 style="color: #2c3e50;">Understanding Compound Interest</h3>
<p style="color: #34495e; line-height: 1.6;">
  Compound interest is the process of earning interest on both the initial principal and the interest that has been added to your investment over time. This powerful concept can significantly grow your wealth if leveraged correctly.
</p>

<div style="background-color: #f8f9fa; border-radius: 5px; padding: 20px; margin: 20px 0;">
  <h4 style="color: #2c3e50; margin-top: 0;">Key Takeaways:</h4>
  <ul style="color: #34495e; line-height: 1.8;">
    <li>Start investing early to maximize the benefits of compounding.</li>
    <li>Regularly contribute to your investments to boost growth.</li>
    <li>Choose investments with higher interest rates or returns for greater impact.</li>
  </ul>
</div>

<p style="color: #34495e; line-height: 1.6;">
  Want to learn more? Reply to this email with your questions, or schedule a consultation to discuss how compound interest can work for your financial goals.
</p>

<p style="color: #34495e; line-height: 1.6;">
  Best regards,<br>
  <strong>Karman Singh</strong>
</p>
  `
};

module.exports = { createEmailWrapper, sampleTemplates };