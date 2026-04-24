import { prisma } from "@/lib/prisma";
import { ImageContentDashboard } from "./ui/ImageContentDashboard";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const rows = await prisma.websiteAsset.findMany({
    orderBy: { sectionKey: "asc" }
  });
  return <ImageContentDashboard initial={rows} />;
}

