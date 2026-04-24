import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../../prisma";

export const quoteRequestsRouter = Router();

const createQuoteSchema = z.object({
  spaceType: z.string().min(1).max(120),
  approximateSize: z.string().min(1).max(120),
  frequency: z.string().min(1).max(120),
  contactName: z.string().min(1).max(120),
  contactEmail: z.string().email().max(254),
  contactPhone: z.string().max(80).optional(),
  addOnKeys: z.array(z.string().min(1).max(80)).max(20).optional()
});

quoteRequestsRouter.post("/", async (req, res) => {
  const parsed = createQuoteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }

  const addOnKeys = Array.from(
    new Set((parsed.data.addOnKeys ?? []).map((k) => k.trim()).filter(Boolean))
  ).slice(0, 20);

  const addOns = addOnKeys.length
    ? await prisma.addOn.findMany({
        where: { key: { in: addOnKeys }, active: true },
        select: { id: true }
      })
    : [];

  const created = await prisma.quoteRequest.create({
    data: {
      spaceType: parsed.data.spaceType,
      approximateSize: parsed.data.approximateSize,
      frequency: parsed.data.frequency,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail.toLowerCase(),
      contactPhone: parsed.data.contactPhone?.trim() ? parsed.data.contactPhone.trim() : null,
      status: "New Lead",
      addOns: addOns.length ? { create: addOns.map((a) => ({ addOnId: a.id })) } : undefined
    },
    include: { addOns: { include: { addOn: true } } }
  });

  res.status(201).json({ quoteRequest: created });
});

