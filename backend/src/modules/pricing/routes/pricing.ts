import { Router } from "express";
import { prisma } from "../../../prisma";

export const pricingRouter = Router();

pricingRouter.get("/", async (_req, res) => {
  const categories = await prisma.pricingCategory.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" }
  });

  const addOns = await prisma.addOn.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" }
  });

  res.json({ categories, addOns });
});

