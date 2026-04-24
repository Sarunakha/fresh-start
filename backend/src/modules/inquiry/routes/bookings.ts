import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../../prisma";

export const bookingsRouter = Router();

const createBookingSchema = z.object({
  primaryContactName: z.string().min(1).max(120),
  email: z.string().email().max(254),
  serviceSuburb: z.string().min(1).max(120),
  serviceCategory: z.string().min(1).max(120),
  preferredArrivalDate: z.string().optional(), // ISO date string (yyyy-mm-dd)
  notes: z.string().max(2000).optional()
});

bookingsRouter.post("/", async (req, res) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload", issues: parsed.error.issues });
  }

  const created = await prisma.booking.create({
    data: {
      primaryContactName: parsed.data.primaryContactName,
      email: parsed.data.email,
      serviceSuburb: parsed.data.serviceSuburb,
      serviceCategory: parsed.data.serviceCategory,
      preferredArrivalDate: parsed.data.preferredArrivalDate
        ? new Date(parsed.data.preferredArrivalDate)
        : null,
      notes: parsed.data.notes ?? null,
      status: "NEW"
    }
  });

  res.status(201).json({ booking: created });
});

