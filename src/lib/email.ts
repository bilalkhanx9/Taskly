import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface SendOtpEmailParams {
  to: string;
  name?: string;
  otp: string;
}

export async function sendVerificationOtpEmail({ to, name, otp }: SendOtpEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ RESEND_API_KEY is not configured. OTP code:", otp);
    return {
      success: false,
      error: "RESEND_API_KEY is missing",
      devOtp: otp,
    };
  }

  const client = new Resend(apiKey);

  const fromEmail = process.env.EMAIL_FROM || "Orbitask <onboarding@resend.dev>";
  const recipientName = name?.trim() || "there";

  try {
    const { data, error } = await client.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Your Orbitask Verification Code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Orbitask Email Verification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; color: #0F172A;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="520px" style="max-width: 520px; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 30px 36px 20px; text-align: left; border-bottom: 1px solid #F1F5F9;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="vertical-align: middle;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #2563EB; text-align: center; line-height: 32px; color: #FFFFFF; font-weight: bold; font-size: 16px;">O</div>
                          </td>
                          <td style="vertical-align: middle; padding-left: 10px;">
                            <span style="font-size: 20px; font-weight: 700; color: #0F172A; letter-spacing: -0.5px;">Orbitask</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 32px 36px;">
                      <h1 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 12px; letter-spacing: -0.3px;">Email Verification Code</h1>
                      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px;">
                        Hi <strong>${recipientName}</strong>, welcome to Orbitask! Please use the following 6-digit verification code to complete your account setup:
                      </p>

                      <!-- OTP Box -->
                      <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 18px 24px; text-align: center; margin: 28px 0;">
                        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1D4ED8; font-family: 'Courier New', Courier, monospace;">
                          ${otp}
                        </span>
                      </div>

                      <p style="font-size: 13px; color: #64748B; line-height: 1.5; margin: 0 0 16px;">
                        ⏱️ This verification code is valid for <strong>10 minutes</strong>.
                      </p>
                      <p style="font-size: 12px; color: #94A3B8; line-height: 1.5; margin: 0;">
                        If you did not request this verification code, someone may have entered your email by mistake. You can safely ignore this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #F8FAFC; padding: 20px 36px; text-align: center; border-top: 1px solid #F1F5F9;">
                      <p style="font-size: 12px; color: #94A3B8; margin: 0;">
                        © 2026 Orbitask Inc. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend send error:", error);
      return {
        success: false,
        error: error.message,
        devOtp: otp,
      };
    }

    return {
      success: true,
      messageId: data?.id,
      devOtp: otp,
    };
  } catch (err: any) {
    console.error("Failed to send OTP email:", err);
    return {
      success: false,
      error: err.message || "Failed to send email",
      devOtp: otp,
    };
  }
}
