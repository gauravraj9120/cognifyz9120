/**
 * CodeWithMe9120 - Email Notification Service
 * Sends registration form submission alerts to target email (gauravrajput9120@gmail.com)
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

const TARGET_EMAIL = process.env.NOTIFICATION_EMAIL || 'gauravrajput9120@gmail.com';

/**
 * Creates and returns a Nodemailer transporter
 */
function createTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASS;

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user,
        pass: pass
      }
    });
  }

  return null;
}

/**
 * Sends a rich HTML email with candidate registration details
 * @param {Object} submission - The candidate submission data
 */
async function sendRegistrationEmail(submission) {
  const transporter = createTransporter();

  const skillsHtml = (submission.skills || [])
    .map(
      (skill) =>
        `<span style="display:inline-block;background:#e0e7ff;color:#4338ca;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:bold;margin:2px 4px 2px 0;">${skill}</span>`
    )
    .join('');

  const htmlContent = `
    <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);color:#ffffff;padding:25px 30px;text-align:center;">
        <h2 style="margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">CodeWithMe9120</h2>
        <p style="margin:6px 0 0;font-size:14px;color:#e0e7ff;">New Internship Student Registration Received</p>
      </div>

      <!-- Content -->
      <div style="padding:25px 30px;">
        <div style="margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:14px;color:#64748b;">Reference ID: <strong style="color:#4f46e5;">${submission.id}</strong></span>
          <span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:9999px;font-size:12px;font-weight:bold;">${submission.type}</span>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;width:35%;font-size:14px;">Full Name:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-weight:bold;font-size:14px;">${submission.fullName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Email Address:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;"><a href="mailto:${submission.email}" style="color:#4f46e5;text-decoration:none;">${submission.email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Phone Number:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">${submission.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Track / Domain:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;"><strong>${submission.track}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Experience Level:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">${submission.experience}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Primary Language:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#0f172a;font-size:14px;">${submission.preferredLanguage}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Technical Skills:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;">
              ${skillsHtml || '<em>None specified</em>'}
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:600;font-size:14px;">Project Statement:</td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;color:#334155;font-size:13px;font-style:italic;">
              "${submission.projectIdea}"
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#64748b;font-weight:600;font-size:14px;">Submitted At:</td>
            <td style="padding:10px 0;color:#64748b;font-size:13px;">${submission.submittedAt}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:15px 30px;text-align:center;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
        This notification was automatically dispatched by the <strong>CodeWithMe9120 Express Server</strong>.<br>
        Target Recipient: <strong>${TARGET_EMAIL}</strong>
      </div>
    </div>
  `;

  const mailOptions = {
    from: `"CodeWithMe9120 Registration" <${process.env.GMAIL_USER || 'no-reply@codewithme9120.com'}>`,
    to: TARGET_EMAIL,
    subject: `🎓 New Registration: ${submission.fullName} (${submission.id}) - CodeWithMe9120`,
    html: htmlContent
  };

  if (transporter) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 [Email Sent] Successfully delivered notification to ${TARGET_EMAIL}. Message ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error(`⚠️ [Email Error] Failed to send email via Gmail SMTP:`, err.message);
      return { success: false, error: err.message };
    }
  } else {
    // If SMTP credentials not provided in .env yet, log formatted email dispatch notice
    console.log(`\n============================================================`);
    console.log(`📧 [EMAIL NOTIFICATION DISPATCHED TO: ${TARGET_EMAIL}]`);
    console.log(`   Subject: ${mailOptions.subject}`);
    console.log(`   Candidate: ${submission.fullName} <${submission.email}>`);
    console.log(`   Track: ${submission.track} | Exp: ${submission.experience}`);
    console.log(`   Skills: ${submission.skills.join(', ')}`);
    console.log(`   Timestamp: ${submission.submittedAt}`);
    console.log(`   💡 Note: To enable live inbox delivery via Gmail SMTP, add GMAIL_USER and GMAIL_APP_PASS in .env`);
    console.log(`============================================================\n`);
    return { success: true, simulated: true };
  }
}

module.exports = {
  sendRegistrationEmail,
  TARGET_EMAIL
};
