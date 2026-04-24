import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE_NAME, createAdminSessionJwt } from "@/lib/auth";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  remember: z.boolean().optional().default(false)
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { email, password, remember } = parsed.data;

  const user = await prisma.admin.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const maxAgeSeconds = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 12;
  const token = await createAdminSessionJwt({ sub: user.id }, maxAgeSeconds);

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds
  });
  return res;
}

