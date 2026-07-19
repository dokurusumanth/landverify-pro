import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const payloadSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().min(6).max(20),
  country: z.string().trim().min(2).max(60),
  propertyState: z.string().trim().min(2).max(60),
  propertyDetails: z.string().trim().min(10).max(1000),
  service: z.enum(["photo", "location", "title", "all"]),
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function base64UrlEncode(input: string) {
  // btoa handles latin1; encode as UTF-8 first
  const utf8 = new TextEncoder().encode(input);
  let bin = "";
  for (const b of utf8) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export const sendInquiryEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => payloadSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
    const recipient =
      process.env.INQUIRY_RECIPIENT_EMAIL || "dok-func-testing@gmail.com";

    if (!lovableKey || !gmailKey) {
      throw new Error("Email service not configured");
    }

    const serviceLabels: Record<string, string> = {
      photo: "Photo Proof",
      location: "Live Location",
      title: "Title Checks",
      all: "All services",
    };

    // Generate a short, unique inquiry ID (e.g. NLC-8F3A2K)
    const genId = () => {
      const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const bytes = new Uint8Array(6);
      crypto.getRandomValues(bytes);
      let out = "";
      for (const b of bytes) out += alphabet[b % alphabet.length];
      return `NLC-${out}`;
    };
    const inquiryId = genId();

    const fromAddress =
      process.env.INQUIRY_FROM_EMAIL || "contact@nrilandcheck.in";
    const fromHeader = `NRILandCheck.in <${fromAddress}>`;

    const subject = `[${inquiryId}] New Land Verification Inquiry — ${data.fullName}`;

    const textBody = [
      `New verification inquiry from NRILandCheck.in`,
      ``,
      `Inquiry ID: ${inquiryId}`,
      `Name: ${data.fullName}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Country of residence: ${data.country}`,
      `Property state (India): ${data.propertyState}`,
      `Service requested: ${serviceLabels[data.service] || data.service}`,
      ``,
      `Property details:`,
      data.propertyDetails,
    ].join("\n");

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h2 style="color:#0b2545;margin:0 0 4px">New Land Verification Inquiry</h2>
        <p style="margin:0 0 16px;color:#475569">From the NRILandCheck.in website · Inquiry ID <strong>${inquiryId}</strong></p>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Inquiry ID</td><td style="padding:4px 0"><strong>${inquiryId}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td style="padding:4px 0"><strong>${escapeHtml(data.fullName)}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Phone</td><td style="padding:4px 0">${escapeHtml(data.phone)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Country</td><td style="padding:4px 0">${escapeHtml(data.country)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Property state</td><td style="padding:4px 0">${escapeHtml(data.propertyState)}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#64748b">Service</td><td style="padding:4px 0">${escapeHtml(serviceLabels[data.service] || data.service)}</td></tr>
        </table>
        <h3 style="color:#0b2545;margin:20px 0 6px">Property details</h3>
        <p style="white-space:pre-wrap;margin:0;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">${escapeHtml(data.propertyDetails)}</p>
      </div>
    `;

    // Build a multipart/alternative MIME message so Gmail renders HTML with a text fallback
    const boundary = `nlc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    const mime = [
      `From: ${fromHeader}`,
      `To: ${recipient}`,
      `Reply-To: ${data.fullName} <${data.email}>`,
      `Subject: ${subject}`,
      `X-Inquiry-Id: ${inquiryId}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      textBody,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlBody,
      ``,
      `--${boundary}--`,
      ``,
    ].join("\r\n");

    const raw = base64UrlEncode(mime);

    const res = await fetch(
      "https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": gmailKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      console.error(`Gmail send failed [${res.status}]: ${body}`);
      throw new Error(`Email send failed [${res.status}]`);
    }

    return { ok: true as const };
  });
