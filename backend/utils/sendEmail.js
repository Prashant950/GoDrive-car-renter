import nodemailer from "nodemailer";

/**
 * Send Email via Nodemailer with customized HTML template
 * @param {Object} options - { to, subject, text, html }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const port = Number(process.env.EMAIL_PORT) || 465;
  const isSecure = port === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: isSecure, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"GoDrive Self Drive Car Rental" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * Generate a luxury styled HTML email for OTP Password Reset
 */
export const getOtpEmailTemplate = (name, otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP - GoDrive</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 38, 77, 0.08);">
            <!-- Header with Dark Blue Gradient -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #001f3f 0%, #00264d 100%); padding: 36px 20px;">
                <div style="background: linear-gradient(135deg, #f5a623 0%, #d97706 100%); width: 52px; height: 52px; border-radius: 14px; line-height: 52px; text-align: center; color: #001f3f; font-size: 26px; font-weight: 900; margin-bottom: 12px; display: inline-block;">
                  G
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 0.5px;">GoDrive Self Drive</h1>
                <p style="margin: 4px 0 0; color: #f5a623; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Premium Self Drive Car Rental</p>
              </td>
            </tr>

            <!-- Content Area -->
            <tr>
              <td style="padding: 36px 32px 24px;">
                <h2 style="margin: 0 0 14px; color: #00264d; font-size: 20px; font-weight: 700;">Password Reset Verification</h2>
                <p style="margin: 0 0 16px; color: #475569; font-size: 14px; line-height: 1.6;">
                  Hello <strong>${name || "Valued User"}</strong>,
                </p>
                <p style="margin: 0 0 24px; color: #475569; font-size: 14px; line-height: 1.6;">
                  We received a request to reset your GoDrive account password. Please use the following 6-digit One-Time Password (OTP) to complete the verification:
                </p>

                <!-- OTP Display Box -->
                <div style="background: #f8fafc; border: 2px dashed #f5a623; border-radius: 16px; padding: 22px; text-align: center; margin-bottom: 24px;">
                  <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #00264d; display: inline-block;">
                    ${otp}
                  </span>
                  <p style="margin: 8px 0 0; color: #64748b; font-size: 12px; font-weight: 600;">
                    ⏱️ Valid for 10 minutes only
                  </p>
                </div>

                <p style="margin: 0 0 12px; color: #64748b; font-size: 13px; line-height: 1.5;">
                  ⚠️ If you did not initiate this request, please ignore this email. Your password will remain unchanged and your account is secure.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                  © ${new Date().getFullYear()} GoDrive Self Drive Car Rental. All rights reserved.
                </p>
                <p style="margin: 4px 0 0; color: #94a3b8; font-size: 11px;">
                  Need help? Reach out at 24×7 Support Helpline (+91 7275647029) or reply to this email.
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

/**
 * Luxury HTML Email Template for Booking & Token Payment Confirmation
 */
export const getBookingConfirmationEmailTemplate = (booking) => {
  const formatD = (d) => {
    try {
      return new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed - GoDrive Self Drive</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 40px rgba(0, 31, 63, 0.1);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #001f3f 0%, #00264d 100%); padding: 36px 24px; text-align: center;">
                <div style="background: linear-gradient(135deg, #f5a623 0%, #d97706 100%); width: 56px; height: 56px; border-radius: 16px; line-height: 56px; text-align: center; color: #001f3f; font-size: 28px; font-weight: 900; margin: 0 auto 12px; display: inline-block;">
                  🚗
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 0.5px;">GoDrive Self Drive</h1>
                <p style="margin: 6px 0 0; color: #f5a623; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                  Booking &amp; Payment Confirmed 🎉
                </p>
              </td>
            </tr>

            <!-- Body Area -->
            <tr>
              <td style="padding: 32px 28px 20px;">
                <p style="margin: 0 0 12px; color: #0f172a; font-size: 16px; font-weight: 700;">
                  Dear ${booking.customerName || "Customer"},
                </p>
                <p style="margin: 0 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                  Thank you for choosing GoDrive! We have received your advance confirmation token for <strong>${booking.vehicleName}</strong>. Your self-drive booking is now officially <strong>Confirmed</strong>.
                </p>

                <!-- Booking ID Badge -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Booking ID:</span>
                    <p style="margin: 2px 0 0; font-size: 15px; font-weight: 900; color: #001f3f;">${booking._id.toString().slice(-8).toUpperCase()}</p>
                  </div>
                  <div style="text-align: right;">
                    <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Status:</span>
                    <p style="margin: 2px 0 0; font-size: 14px; font-weight: 900; color: #16a34a;">CONFIRMED &amp; PAID</p>
                  </div>
                </div>

                <!-- Trip Details Table -->
                <h3 style="margin: 0 0 12px; color: #001f3f; font-size: 15px; font-weight: 800; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
                  🗓️ Trip &amp; Vehicle Details
                </h3>

                <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 13px; color: #334155; margin-bottom: 20px; border-collapse: collapse;">
                  <tr style="background: #f8fafc;">
                    <td style="font-weight: 600; color: #64748b; width: 40%; border-bottom: 1px solid #edf2f7;">Vehicle:</td>
                    <td style="font-weight: 800; color: #001f3f; border-bottom: 1px solid #edf2f7;">${booking.vehicleName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Driving Mode:</td>
                    <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${booking.withDriver ? "With Chauffeur" : "Self Drive (Unlimited Freedom)"}</td>
                  </tr>
                  <tr style="background: #f8fafc;">
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Pickup Date &amp; Time:</td>
                    <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${formatD(booking.startDate)}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Return Date &amp; Time:</td>
                    <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${formatD(booking.endDate)}</td>
                  </tr>
                  <tr style="background: #f8fafc;">
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Duration:</td>
                    <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${booking.days} Day(s)</td>
                  </tr>
                  <tr>
                    <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Pickup Location:</td>
                    <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${booking.pickupLocation || "Doorstep Delivery / Hub Handover"}</td>
                  </tr>
                </table>

                <!-- Payment Receipt Card -->
                <div style="background: #fffbeb; border: 2px dashed #f5a623; border-radius: 16px; padding: 18px 20px; margin-bottom: 24px;">
                  <h4 style="margin: 0 0 10px; font-size: 14px; font-weight: 800; color: #92400e; text-transform: uppercase;">
                    💳 Payment Breakdown
                  </h4>
                  <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px; color: #451a03;">
                    <tr>
                      <td style="color: #78350f;">Total Estimated Rent:</td>
                      <td align="right" style="font-weight: 800; color: #001f3f;">₹${Number(booking.estimatedTotal).toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td style="color: #15803d; font-weight: 700;">Advance Token Paid Now:</td>
                      <td align="right" style="font-weight: 900; color: #16a34a; font-size: 15px;">₹${Number(booking.amountPaid).toLocaleString("en-IN")}</td>
                    </tr>
                    <tr>
                      <td style="color: #78350f;">Payment Transaction ID:</td>
                      <td align="right" style="font-family: monospace; font-size: 11px; font-weight: 700; color: #0f172a;">${booking.paymentId || "Verified"}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="border-top: 1px solid #fde68a; padding-top: 8px;"></td>
                    </tr>
                    <tr>
                      <td style="font-weight: 800; color: #92400e;">Balance Due at Car Handover:</td>
                      <td align="right" style="font-weight: 900; color: #b45309; font-size: 16px;">₹${Number(booking.balanceDue).toLocaleString("en-IN")}</td>
                    </tr>
                  </table>
                </div>

                <!-- Handover Guidelines -->
                <div style="background: #f1f5f9; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
                  <p style="margin: 0 0 6px; font-size: 12px; font-weight: 800; color: #001f3f;">
                    📋 Mandatory Handover Checklist:
                  </p>
                  <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                    <li>Original Valid Indian Driving Licence (held for min. 1 year).</li>
                    <li>Original Aadhaar Card / Passport for identity verification.</li>
                    <li>Pay remaining balance ₹${Number(booking.balanceDue).toLocaleString("en-IN")} comfortably at delivery.</li>
                  </ul>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 24px 0 10px;">
                  <a href="${clientUrl}/dashboard/bookings" style="background: linear-gradient(135deg, #f5a623 0%, #d97706 100%); color: #001f3f; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 900; font-size: 14px; display: inline-block; box-shadow: 0 6px 20px rgba(245, 166, 35, 0.35);">
                    View Booking in Dashboard &rarr;
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 24px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 4px; color: #001f3f; font-size: 13px; font-weight: 800;">GoDrive Self Drive Car Rental</p>
                <p style="margin: 0 0 8px; color: #64748b; font-size: 11px;">
                  📍 GoDrive Self Drive, JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, UP 201304
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                  24×7 Roadside Emergency Helpline: <strong style="color: #001f3f;">+91 7275647029</strong>
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

export default sendEmail;
