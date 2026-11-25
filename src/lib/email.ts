import nodemailer from 'nodemailer';

export interface EmailPayload {
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface HomeCollectionPayload {
  name: string;
  phone: string;
  address: string;
  preferredDate?: string;
  preferredTime?: string;
}

/**
 * Dispatches an inquiry notification email to the configured administrator inbox.
 */
export async function sendAdminNotification(payload: EmailPayload): Promise<{ success: boolean; message: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || 'janasakthip2005@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const formattedSubject = `New Website Enquiry — ${payload.inquiryType} — ${payload.fullName}`;
  const serverTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const escapedMessage = (payload.message || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Website Enquiry</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
          .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 24px; text-align: left; }
          .header-title { font-size: 20px; font-weight: 700; margin: 0; }
          .header-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #0284c7; font-weight: 600; margin-top: 4px; }
          .content { padding: 30px; }
          .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .info-table td { padding: 8px 0; font-size: 14px; }
          .info-label { font-weight: 600; color: #475569; width: 120px; }
          .info-value { color: #0f172a; font-weight: 700; }
          .message-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; font-weight: 550; }
          .footer { background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: left; }
          .footer-text { font-size: 11px; color: #64748b; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="header-title">New Website Enquiry</h1>
            <div class="header-sub">Saraswathy Lab & Medicals</div>
          </div>
          <div class="content">
            <h2 class="section-title">Patient Contact Details</h2>
            <table class="info-table">
              <tr>
                <td class="info-label">Full Name:</td>
                <td class="info-value">${payload.fullName}</td>
              </tr>
              <tr>
                <td class="info-label">Email:</td>
                <td class="info-value"><a href="mailto:${payload.email}" style="color: #0284c7; text-decoration: none;">${payload.email}</a></td>
              </tr>
              <tr>
                <td class="info-label">Phone:</td>
                <td class="info-value">${payload.phone || 'Not provided'}</td>
              </tr>
            </table>

            <h2 class="section-title">Enquiry Vitals</h2>
            <table class="info-table">
              <tr>
                <td class="info-label">Category:</td>
                <td class="info-value"><span style="background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 4px 8px; border-radius: 6px; font-size: 12px;">${payload.inquiryType}</span></td>
              </tr>
              <tr>
                <td class="info-label">Subject:</td>
                <td class="info-value">${payload.subject}</td>
              </tr>
            </table>

            <h2 class="section-title">Message Body</h2>
            <div class="message-box">${escapedMessage}</div>
          </div>
          <div class="footer">
            <div class="footer-text">
              <strong>Submitted At:</strong> ${serverTimestamp}<br />
              <strong>Source:</strong> Official Website Contact Form &bull; saraswathylab.com
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
NEW WEBSITE ENQUIRY
Saraswathy Lab & Medicals (saraswathylab.com)

--- PATIENT DETAILS ---
Name: ${payload.fullName}
Email: ${payload.email}
Phone: ${payload.phone || 'Not provided'}

--- ENQUIRY VITALS ---
Category: ${payload.inquiryType}
Subject: ${payload.subject}
Submitted At: ${serverTimestamp}

--- MESSAGE BODY ---
${payload.message}
  `;

  const errors: string[] = [];

  // 1. Primary Service: Resend REST API (Runs over HTTPS port 443 — 100% reliable on Vercel Serverless)
  if (resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const senderFrom = process.env.EMAIL_FROM || 'Saraswathy Lab <onboarding@resend.dev>';
      console.log(`[Resend] Dispatching email from "${senderFrom}" to "${adminEmail}"...`);

      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderFrom,
          to: [adminEmail.trim()],
          reply_to: payload.email,
          subject: formattedSubject,
          html: htmlBody,
          text: textBody,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const resData = await resendRes.json().catch(() => ({}));

      if (resendRes.ok) {
        console.log(`[Resend Success] Notification email delivered to: ${adminEmail} (ID: ${resData.id})`);
        return { success: true, message: `Delivered via Resend (ID: ${resData.id})` };
      } else {
        const errorMsg = resData.message || JSON.stringify(resData) || `HTTP ${resendRes.status}`;
        console.error(`[Resend API Error ${resendRes.status}]:`, errorMsg);
        errors.push(`Resend error (${resendRes.status}): ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('[Resend Network Error]', err.message);
      errors.push(`Resend network error: ${err.message}`);
    }
  } else {
    errors.push('RESEND_API_KEY is not configured');
  }

  // 2. Secondary Service: Fallback SMTP (Nodemailer)
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || '465', 10);
      const isSecure = port === 465 || process.env.SMTP_SECURE === 'true';

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: isSecure,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      // For Gmail or general SMTP, from address must match authenticated user to avoid relay rejection
      const smtpSender = smtpHost.includes('gmail.com')
        ? `"Saraswathy Lab & Medicals" <${smtpUser}>`
        : (process.env.EMAIL_FROM || `"Saraswathy Lab" <${smtpUser}>`);

      const info = await transporter.sendMail({
        from: smtpSender,
        to: adminEmail,
        replyTo: payload.email,
        subject: formattedSubject,
        text: textBody,
        html: htmlBody,
      });

      console.log(`[SMTP Success] Notification email delivered to: ${adminEmail} (ID: ${info.messageId})`);
      return { success: true, message: `Delivered via SMTP (${info.messageId})` };
    } catch (err: any) {
      console.error('[SMTP Error]', err.message);
      errors.push(`SMTP error: ${err.message}`);
    }
  } else {
    errors.push('SMTP configuration incomplete (missing host, user, or password)');
  }

  const finalDiagnostic = errors.join('; ');
  console.warn(`[Email Notification Failed] ${finalDiagnostic}`);
  return { success: false, message: finalDiagnostic };
}

/**
 * Dispatches a Home Collection Request email to the configured administrator inbox.
 */
export async function sendHomeCollectionNotification(payload: HomeCollectionPayload): Promise<{ success: boolean; message: string }> {
  const adminEmail = process.env.ADMIN_EMAIL || 'janasakthip2005@gmail.com';
  const resendApiKey = process.env.RESEND_API_KEY;
  const formattedSubject = `New Home Collection Request — ${payload.name} (${payload.phone})`;
  const serverTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const escapedAddress = (payload.address || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Home Collection Request</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
          .header { background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); color: #ffffff; padding: 24px; text-align: left; }
          .header-title { font-size: 20px; font-weight: 700; margin: 0; }
          .header-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #e0f2fe; font-weight: 600; margin-top: 4px; }
          .content { padding: 30px; }
          .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700; margin-top: 0; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .info-table td { padding: 8px 0; font-size: 14px; }
          .info-label { font-weight: 600; color: #475569; width: 140px; }
          .info-value { color: #0f172a; font-weight: 700; }
          .address-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; font-weight: 600; }
          .footer { background-color: #f8fafc; padding: 20px 30px; border-top: 1px solid #e2e8f0; text-align: left; }
          .footer-text { font-size: 11px; color: #64748b; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 class="header-title">New Home Collection Request</h1>
            <div class="header-sub">Saraswathy Lab Phlebotomy Dispatch</div>
          </div>
          <div class="content">
            <h2 class="section-title">Patient Contact Info</h2>
            <table class="info-table">
              <tr>
                <td class="info-label">Patient Name:</td>
                <td class="info-value">${payload.name}</td>
              </tr>
              <tr>
                <td class="info-label">Phone Number:</td>
                <td class="info-value"><a href="tel:${payload.phone}" style="color: #0284c7; text-decoration: none;">${payload.phone}</a></td>
              </tr>
              <tr>
                <td class="info-label">Preferred Timing:</td>
                <td class="info-value">${payload.preferredDate || 'As soon as possible'} ${payload.preferredTime ? `(${payload.preferredTime})` : ''}</td>
              </tr>
            </table>

            <h2 class="section-title">Collection Address</h2>
            <div class="address-box">${escapedAddress}</div>
          </div>
          <div class="footer">
            <div class="footer-text">
              <strong>Submitted At:</strong> ${serverTimestamp}<br />
              <strong>Source:</strong> Saraswathy Lab Home Collection Portal &bull; saraswathylab.com
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textBody = `
NEW HOME COLLECTION REQUEST
Saraswathy Lab & Medicals (saraswathylab.com)

Name: ${payload.name}
Phone: ${payload.phone}
Address: ${payload.address}
Preferred Timing: ${payload.preferredDate || 'As soon as possible'} ${payload.preferredTime || ''}
Submitted At: ${serverTimestamp}
  `;

  const errors: string[] = [];

  if (resendApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const senderFrom = process.env.EMAIL_FROM || 'Saraswathy Lab <onboarding@resend.dev>';
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: senderFrom,
          to: [adminEmail.trim()],
          subject: formattedSubject,
          html: htmlBody,
          text: textBody,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const resData = await resendRes.json().catch(() => ({}));

      if (resendRes.ok) {
        console.log(`[Resend Success] Home collection email delivered to: ${adminEmail}`);
        return { success: true, message: `Delivered via Resend (ID: ${resData.id})` };
      } else {
        const errorMsg = resData.message || JSON.stringify(resData) || `HTTP ${resendRes.status}`;
        console.error(`[Resend Error ${resendRes.status}]:`, errorMsg);
        errors.push(`Resend error (${resendRes.status}): ${errorMsg}`);
      }
    } catch (err: any) {
      console.error('[Resend Error]', err.message);
      errors.push(`Resend network error: ${err.message}`);
    }
  } else {
    errors.push('RESEND_API_KEY is not configured');
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const port = parseInt(process.env.SMTP_PORT || '465', 10);
      const isSecure = port === 465 || process.env.SMTP_SECURE === 'true';

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: port,
        secure: isSecure,
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      const smtpSender = smtpHost.includes('gmail.com')
        ? `"Saraswathy Lab & Medicals" <${smtpUser}>`
        : (process.env.EMAIL_FROM || `"Saraswathy Lab" <${smtpUser}>`);

      const info = await transporter.sendMail({
        from: smtpSender,
        to: adminEmail,
        subject: formattedSubject,
        text: textBody,
        html: htmlBody,
      });

      console.log(`[SMTP Success] Home collection email delivered to: ${adminEmail}`);
      return { success: true, message: `Delivered via SMTP (${info.messageId})` };
    } catch (err: any) {
      console.error('[SMTP Error]', err.message);
      errors.push(`SMTP error: ${err.message}`);
    }
  } else {
    errors.push('SMTP configuration incomplete');
  }

  const finalDiagnostic = errors.join('; ');
  return { success: false, message: finalDiagnostic };
}
