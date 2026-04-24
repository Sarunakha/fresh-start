import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user (single)
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@freshstart.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash }
  });

  // Categories
  const categories = [
    { key: "general_residential", name: "General Residential", sortOrder: 1 },
    { key: "deep_cleaning", name: "Deep Cleaning", sortOrder: 2 },
    { key: "end_of_lease", name: "End of Lease", sortOrder: 3 },
    { key: "commercial", name: "Commercial", sortOrder: 4 }
  ];

  for (const c of categories) {
    await prisma.pricingCategory.upsert({
      where: { key: c.key },
      update: { name: c.name, sortOrder: c.sortOrder },
      create: c
    });
  }

  const cat = await prisma.pricingCategory.findMany();
  const byKey = new Map(cat.map((c) => [c.key, c.id] as const));

  // Items (priceRange stored as text exactly per requirements)
  const items: Array<{
    categoryKey: string;
    key: string;
    name: string;
    description?: string;
    priceRange: string;
    sortOrder: number;
  }> = [
    // General Residential
    {
      categoryKey: "general_residential",
      key: "1_bedroom",
      name: "1 Bedroom",
      description: "Studio / Apartment",
      priceRange: "$100–$120",
      sortOrder: 1
    },
    {
      categoryKey: "general_residential",
      key: "2_bedroom",
      name: "2 Bedroom",
      description: "Family residence",
      priceRange: "$120–$160",
      sortOrder: 2
    },
    {
      categoryKey: "general_residential",
      key: "3_bedroom",
      name: "3 Bedroom",
      description: "Larger family home",
      priceRange: "$160–$220",
      sortOrder: 3
    },
    {
      categoryKey: "general_residential",
      key: "hourly",
      name: "Hourly",
      priceRange: "$40–$55/hr",
      sortOrder: 4
    },

    // Deep Cleaning
    {
      categoryKey: "deep_cleaning",
      key: "1_2_bedroom",
      name: "1–2 Bedroom",
      priceRange: "$250–$350",
      sortOrder: 1
    },
    {
      categoryKey: "deep_cleaning",
      key: "3plus_bedroom",
      name: "3+ Bedroom",
      priceRange: "$300–$500+",
      sortOrder: 2
    },

    // End of Lease
    {
      categoryKey: "end_of_lease",
      key: "1_bedroom",
      name: "1 Bedroom",
      priceRange: "$250–$350",
      sortOrder: 1
    },
    {
      categoryKey: "end_of_lease",
      key: "2_bedroom",
      name: "2 Bedroom",
      priceRange: "$300–$450",
      sortOrder: 2
    },
    {
      categoryKey: "end_of_lease",
      key: "3_bedroom",
      name: "3 Bedroom",
      priceRange: "$400–$600",
      sortOrder: 3
    },

    // Commercial
    {
      categoryKey: "commercial",
      key: "small_office",
      name: "Small Office",
      priceRange: "$80–$150",
      sortOrder: 1
    },
    {
      categoryKey: "commercial",
      key: "medium_office",
      name: "Medium Office",
      priceRange: "$150–$300",
      sortOrder: 2
    },
    {
      categoryKey: "commercial",
      key: "hourly",
      name: "Hourly",
      priceRange: "$40–$60/hr",
      sortOrder: 3
    }
  ];

  for (const i of items) {
    const categoryId = byKey.get(i.categoryKey);
    if (!categoryId) continue;
    await prisma.pricingItem.upsert({
      where: { categoryId_key: { categoryId, key: i.key } },
      update: {
        name: i.name,
        description: i.description ?? null,
        priceRange: i.priceRange,
        sortOrder: i.sortOrder
      },
      create: {
        categoryId,
        key: i.key,
        name: i.name,
        description: i.description ?? null,
        priceRange: i.priceRange,
        sortOrder: i.sortOrder
      }
    });
  }

  // Add-ons
  const addOns = [
    {
      key: "carpet_steam",
      name: "Carpet Steam",
      priceRange: "$50–$150",
      sortOrder: 1
    },
    {
      key: "oven_restoration",
      name: "Oven Cleaning",
      priceRange: "$40–$80",
      sortOrder: 2
    },
    {
      key: "window_cleaning",
      name: "Window Cleaning",
      priceRange: "Contact for Assessment",
      sortOrder: 3
    },
    {
      key: "fridge_cleaning",
      name: "Fridge Cleaning",
      priceRange: "Contact for Assessment",
      sortOrder: 4
    }
  ];

  for (const a of addOns) {
    await prisma.addOn.upsert({
      where: { key: a.key },
      update: {
        name: a.name,
        priceRange: a.priceRange,
        sortOrder: a.sortOrder,
        active: true
      },
      create: { ...a, active: true }
    });
  }

  // Portfolio example entries (optional seed)
  const portfolio: Array<{
    title: string;
    description?: string;
    category: string;
    beforeImage: string;
    afterImage: string;
    matchScore?: number;
    isFeatured?: boolean;
  }> = [
    {
      title: "Bondi Penthouse Suite",
      description: "Deep clean and sanitization with clinical-grade finish.",
      category: "RESIDENTIAL",
      beforeImage: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      afterImage: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
      matchScore: 98,
      isFeatured: true
    }
  ];

  for (const p of portfolio) {
    const existing = await prisma.portfolioEntry.findFirst({
      where: { title: p.title }
    });

    if (existing) {
      await prisma.portfolioEntry.update({
        where: { id: existing.id },
        data: {
          description: p.description ?? null,
          category: p.category,
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          matchScore: p.matchScore ?? null,
          isFeatured: p.isFeatured ?? false
        }
      });
    } else {
      await prisma.portfolioEntry.create({
        data: {
          title: p.title,
          description: p.description ?? null,
          category: p.category,
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          matchScore: p.matchScore ?? null,
          isFeatured: p.isFeatured ?? false
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

