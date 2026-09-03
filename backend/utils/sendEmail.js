import nodemailer from "nodemailer";

/**
 * Send Email via Nodemailer with customized HTML template
 * @param {Object} options - { to, subject, text, html }
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const port = Number(process.env.EMAIL_PORT) || 465;
  const isSecure = port === 465;
  const emailUser = (process.env.EMAIL_USER || "").trim();
  const emailPass = (process.env.EMAIL_PASS || "").trim();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: isSecure, // true for 465, false for 587
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: `"GoDrive Self Drive Car Rental" <${emailUser}>`,
    to: (to || "").trim(),
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

            <!-- Footer with Noida Head Office & Pune Branch Office details -->
            <tr>
              <td style="background-color: #f8fafc; padding: 24px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 4px; color: #001f3f; font-size: 13px; font-weight: 800;">GoDrive Self Drive Car Rental</p>
                <p style="margin: 0 0 4px; color: #64748b; font-size: 11px;">
                  🏢 <strong>Head Office:</strong> JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, UP 201304
                </p>
                <p style="margin: 0 0 8px; color: #64748b; font-size: 11px;">
                  📍 <strong>Branch Office:</strong> Colony No.10, Om Siddhi Colony, Ganesh Nagar, Bopkhel, Pune, MH 411031
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

/**
 * Luxury HTML Email Template for New User Registration Welcome
 */
export const getWelcomeEmailTemplate = (user) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const registeredDate = new Date(user.createdAt || Date.now()).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to GoDrive Self Drive</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f1f5f9; padding: 30px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 40px rgba(0, 31, 63, 0.1);">
            
            <!-- Header with Luxury Dark Blue & Gold Banner -->
            <tr>
              <td align="center" style="background: linear-gradient(135deg, #001f3f 0%, #00264d 100%); padding: 38px 24px; text-align: center;">
                <div style="background: linear-gradient(135deg, #f5a623 0%, #d97706 100%); width: 56px; height: 56px; border-radius: 16px; line-height: 56px; text-align: center; color: #001f3f; font-size: 28px; font-weight: 900; margin: 0 auto 12px; display: inline-block;">
                  🚗
                </div>
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 0.5px;">GoDrive Self Drive</h1>
                <p style="margin: 6px 0 0; color: #f5a623; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                  Account Created Successfully 🎉
                </p>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding: 32px 28px 20px;">
                <p style="margin: 0 0 10px; color: #0f172a; font-size: 18px; font-weight: 800;">
                  Welcome aboard, ${user.name || "Customer"}! 👋
                </p>
                <p style="margin: 0 0 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                  Congratulations! Your <strong>GoDrive Self Drive</strong> account has been successfully created. You are now ready to explore our premium fleet and enjoy unlimited freedom across <strong>Delhi NCR &amp; Pune</strong>.
                </p>

                <!-- Registration Details Card -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px 22px; margin-bottom: 24px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 12px;">
                    <span style="font-size: 12px; font-weight: 800; color: #001f3f; text-transform: uppercase; letter-spacing: 1px;">
                      📋 Account &amp; Profile Details
                    </span>
                    <span style="background: #dcfce7; color: #15803d; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 8px; text-transform: uppercase;">
                      Active &amp; Verified 🟢
                    </span>
                  </div>

                  <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; color: #334155; border-collapse: collapse;">
                    <tr>
                      <td style="font-weight: 600; color: #64748b; width: 38%; border-bottom: 1px solid #edf2f7;">Full Name:</td>
                      <td style="font-weight: 800; color: #001f3f; border-bottom: 1px solid #edf2f7;">${user.name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Email Address:</td>
                      <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${user.email}</td>
                    </tr>
                    <tr>
                      <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Mobile Number:</td>
                      <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${user.mobile}</td>
                    </tr>
                    ${
                      user.city
                        ? `
                    <tr>
                      <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">City / Location:</td>
                      <td style="font-weight: 700; color: #001f3f; border-bottom: 1px solid #edf2f7;">${user.city}</td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      user.address
                        ? `
                    <tr>
                      <td style="font-weight: 600; color: #64748b; border-bottom: 1px solid #edf2f7;">Address:</td>
                      <td style="font-weight: 600; color: #001f3f; border-bottom: 1px solid #edf2f7;">${user.address}</td>
                    </tr>
                    `
                        : ""
                    }
                    <tr>
                      <td style="font-weight: 600; color: #64748b;">Registered On:</td>
                      <td style="font-weight: 700; color: #001f3f;">${registeredDate}</td>
                    </tr>
                  </table>
                </div>

                <!-- Why GoDrive Member Benefits Card -->
                <div style="background: #fffbeb; border: 2px dashed #f5a623; border-radius: 18px; padding: 18px 20px; margin-bottom: 24px;">
                  <h4 style="margin: 0 0 12px; font-size: 13px; font-weight: 800; color: #92400e; text-transform: uppercase; letter-spacing: 0.5px;">
                    ✨ Your Exclusive GoDrive Privileges
                  </h4>
                  <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 12px; color: #451a03;">
                    <tr>
                      <td style="width: 24px; vertical-align: top; font-size: 15px;">🪙</td>
                      <td>
                        <strong>Only ₹500 Advance Token:</strong> Reserve any vehicle by paying just ₹500. Pay balance at handover!
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 24px; vertical-align: top; font-size: 15px;">🚚</td>
                      <td>
                        <strong>Doorstep Handover:</strong> Get cars delivered directly to your home, office, or airport in Delhi NCR &amp; Pune.
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 24px; vertical-align: top; font-size: 15px;">🛡️</td>
                      <td>
                        <strong>100% Comprehensive Insurance:</strong> Drive with zero stress and complete safety coverage.
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 24px; vertical-align: top; font-size: 15px;">🚀</td>
                      <td>
                        <strong>Unlimited Kilometers:</strong> Choose unlimited km packages for memorable outstation road trips.
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Easy 3-Step Booking Guide -->
                <div style="background: #f1f5f9; border-radius: 14px; padding: 16px 20px; margin-bottom: 24px;">
                  <p style="margin: 0 0 8px; font-size: 12px; font-weight: 800; color: #001f3f; text-transform: uppercase;">
                    🧭 How to Book Your First Car:
                  </p>
                  <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.7;">
                    <li><strong>Choose Vehicle:</strong> Select from SUVs, Sedans, or 7-Seaters from our fleet catalog.</li>
                    <li><strong>Pick Dates &amp; Delivery:</strong> Select your rental duration &amp; pickup location.</li>
                    <li><strong>Pay ₹500 Token:</strong> Complete instant online payment to confirm your booking!</li>
                  </ol>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 26px 0 12px;">
                  <a href="${clientUrl}/fleet" style="background: linear-gradient(135deg, #f5a623 0%, #d97706 100%); color: #001f3f; text-decoration: none; padding: 15px 36px; border-radius: 14px; font-weight: 900; font-size: 14px; display: inline-block; box-shadow: 0 8px 24px rgba(245, 166, 35, 0.4);">
                    Explore Fleet &amp; Book Now &rarr;
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer with Noida Head Office & Pune Branch Office details -->
            <tr>
              <td style="background-color: #f8fafc; padding: 24px 28px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 6px; color: #001f3f; font-size: 13px; font-weight: 800;">GoDrive Self Drive Car Rental</p>
                <p style="margin: 0 0 4px; color: #64748b; font-size: 11px;">
                  🏢 <strong>Head Office:</strong> JAYPEE KENSINGTON PARK, Plot 1, Sector 133, Noida, UP 201304
                </p>
                <p style="margin: 0 0 8px; color: #64748b; font-size: 11px;">
                  📍 <strong>Branch Office:</strong> Colony No.10, Om Siddhi Colony, Ganesh Nagar, Bopkhel, Pune, MH 411031
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 11px;">
                  📞 24×7 Concierge Helpline: <strong style="color: #001f3f;">+91 7275647029</strong> · ✉️ <a href="mailto:hello@godriveselfdrive.com" style="color: #d97706; text-decoration: none;">hello@godriveselfdrive.com</a>
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
