import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.websiteAsset.findMany({
    select: { sectionKey: true, cloudinaryUrl: true, altText: true }
  });

  const assetsByKey = Object.fromEntries(
    rows.map((r) => [
      r.sectionKey,
      { cloudinaryUrl: r.cloudinaryUrl, altText: r.altText }
    ])
  );

  return Response.json({ assetsByKey });
}
