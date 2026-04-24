"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getAppUrl, getMailFrom, getTransport, buildResetEmailHtml } from "@/lib/mail";
import { generateResetToken } from "@/lib/reset-token";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function adminLogout() {
  const store = await cookies();
  store.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0
  });
}

export async function requestPasswordReset(email: string) {
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!normalized) return { ok: true as const };

  const admin = await prisma.admin.findUnique({ where: { email: normalized } });
  // Avoid account enumeration
  if (!admin) return { ok: true as const };

  const rawToken = generateResetToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.admin.update({
    where: { id: admin.id },
    data: { resetToken: rawToken, resetTokenExpiry: expires }
  });

  const resetUrl = `${getAppUrl()}/admin/reset-password?token=${encodeURIComponent(rawToken)}`;

  try {
    const transport = getTransport();
    await transport.sendMail({
      from: getMailFrom(),
      to: admin.email,
      subject: "Reset your Fresh Start admin password",
      text: `Reset your admin password (valid for 1 hour): ${resetUrl}`,
      html: buildResetEmailHtml({ resetUrl, expiresInHours: 1 }),
      attachments: [
        {
          filename: "logo.svg",
          path: "public/logo.svg",
          cid: "fsc-logo"
        }
      ]
    });
  } catch {
    // Don't leak delivery details to the caller
  }

  return { ok: true as const };
}

export async function resetPassword(token: string, newPassword: string) {
  const rawToken = String(token ?? "").trim();
  const password = String(newPassword ?? "");

  if (!rawToken) return { ok: false as const, error: "Reset token is missing." };
  if (password.length < 8) return { ok: false as const, error: "Password must be at least 8 characters." };

  const admin = await prisma.admin.findFirst({
    where: { resetToken: rawToken, resetTokenExpiry: { gt: new Date() } }
  });

  if (!admin) return { ok: false as const, error: "Reset link is invalid or expired." };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.update({
    where: { id: admin.id },
    data: {
      password: passwordHash,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  return { ok: true as const };
}

