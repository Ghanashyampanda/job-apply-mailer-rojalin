import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Increase payload limit to handle resume/cover letter attachments in base64
app.use(express.json({ limit: "25mb" }));

// Helper function to build RFC 2822 compliant MIME email
function createRawMimeEmail({
  to,
  fromName,
  fromEmail,
  subject,
  body,
  attachments = [],
}: {
  to: string;
  fromName?: string;
  fromEmail?: string;
  subject: string;
  body: string;
  attachments?: Array<{ filename: string; mimeType: string; contentBase64: string }>;
}): string {
  const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  let email = "";

  if (fromEmail) {
    const formattedName = fromName ? `"${fromName.replace(/"/g, "")}"` : "";
    email += `From: ${formattedName ? `${formattedName} <${fromEmail}>` : fromEmail}\r\n`;
  }
  email += `To: ${to}\r\n`;
  // Encode subject in UTF-8 base64 header format to handle non-ASCII safely
  const encodedSubject = Buffer.from(subject, "utf-8").toString("base64");
  email += `Subject: =?UTF-8?B?${encodedSubject}?=\r\n`;
  email += `MIME-Version: 1.0\r\n`;

  if (attachments && attachments.length > 0) {
    email += `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n`;

    // Text Body Part
    email += `--${boundary}\r\n`;
    email += `Content-Type: text/plain; charset="UTF-8"\r\n`;
    email += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
    email += `${body}\r\n\r\n`;

    // Attachment Parts
    for (const att of attachments) {
      const cleanBase64 = att.contentBase64.replace(/^data:[^;]+;base64,/, "").trim();
      email += `--${boundary}\r\n`;
      email += `Content-Type: ${att.mimeType || "application/octet-stream"}; name="${att.filename}"\r\n`;
      email += `Content-Disposition: attachment; filename="${att.filename}"\r\n`;
      email += `Content-Transfer-Encoding: base64\r\n\r\n`;
      // Break base64 into 76-character lines as required by MIME RFC
      const chunked = cleanBase64.match(/.{1,76}/g)?.join("\r\n") || cleanBase64;
      email += `${chunked}\r\n\r\n`;
    }

    email += `--${boundary}--`;
  } else {
    email += `Content-Type: text/plain; charset="UTF-8"\r\n`;
    email += `Content-Transfer-Encoding: 7bit\r\n\r\n`;
    email += body;
  }

  // Encode full message into URL-safe Base64 for Gmail API
  return Buffer.from(email, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// API Health Endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// API Endpoint to verify Gmail App Password (SMTP)
app.post("/api/verify-smtp", async (req, res) => {
  try {
    const { user, pass } = req.body;
    if (!user || !pass) {
      return res.status(400).json({ error: "Missing Gmail address or App Password." });
    }
    const cleanPass = String(pass).replace(/\s+/g, "").trim();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(user).trim(),
        pass: cleanPass,
      },
    });

    await transporter.verify();
    return res.json({ success: true, message: `Connected to ${user} successfully.` });
  } catch (err: any) {
    console.error("SMTP verification error:", err);
    return res.status(400).json({
      error: err.message || "Failed to authenticate Gmail credentials. Please check your App Password.",
      code: err.code,
    });
  }
});

// API Endpoint to send individual email via either Gmail App Password (SMTP) or Gmail API OAuth
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, fromName, fromEmail, subject, body, attachments, smtpConfig } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields (to, subject, body)." });
    }

    // Path 1: Direct SMTP via Gmail App Password (Zero OAuth restrictions)
    if (smtpConfig && smtpConfig.user && smtpConfig.pass) {
      const cleanPass = String(smtpConfig.pass).replace(/\s+/g, "").trim();
      const senderEmail = String(smtpConfig.user).trim();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: senderEmail,
          pass: cleanPass,
        },
      });

      const mailAttachments = attachments?.map((att: any) => {
        const cleanBase64 = String(att.contentBase64 || "").replace(/^data:[^;]+;base64,/, "").trim();
        return {
          filename: att.filename || "attachment",
          content: Buffer.from(cleanBase64, "base64"),
          contentType: att.mimeType || "application/octet-stream",
        };
      });

      const info = await transporter.sendMail({
        from: fromName ? `"${fromName.replace(/"/g, "")}" <${senderEmail}>` : senderEmail,
        to: to.trim(),
        subject: subject,
        text: body,
        attachments: mailAttachments,
      });

      return res.json({
        success: true,
        id: info.messageId,
        mode: "smtp",
      });
    }

    // Path 2: Gmail REST API using OAuth Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No authorization method provided. Please connect via Gmail App Password or Google OAuth.",
      });
    }

    const token = authHeader.substring(7);

    // Build raw MIME email string
    const rawBase64Url = createRawMimeEmail({
      to,
      fromName,
      fromEmail,
      subject,
      body,
      attachments,
    });

    // Call official Gmail API
    const gmailResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: rawBase64Url,
      }),
    });

    const result = await gmailResponse.json();

    if (!gmailResponse.ok) {
      console.error("Gmail API Error:", result);
      const errorMessage = result.error?.message || result.error_description || "Gmail API error";
      return res.status(gmailResponse.status).json({
        error: errorMessage,
        code: result.error?.code,
        status: result.error?.status,
      });
    }

    return res.json({
      success: true,
      id: result.id,
      threadId: result.threadId,
      mode: "oauth",
    });
  } catch (err: any) {
    console.error("Server error sending email:", err);
    return res.status(500).json({ error: err.message || "Failed to process email request." });
  }
});

// API Endpoint to fetch user Gmail profile info
app.get("/api/gmail-profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Failed to fetch profile" });
    }

    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV === "development" || (!process.env.NODE_ENV && Boolean(import.meta?.url?.endsWith(".ts")));

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Job Apply Mailer server running on http://localhost:${PORT}`);
  });
}

startServer();
