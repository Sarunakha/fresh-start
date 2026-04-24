import { getServices } from "@/actions/service-actions";
import { ServicesPricingClient } from "./ui/ServicesPricingClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices(false);
  const packages = services
    .filter((s) => String((s as any).type ?? "PACKAGE") === "PACKAGE")
    .map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      priceRange: s.priceRange,
      showPrice: s.showPrice,
      features: s.features ?? [],
      isPopular: Boolean((s as any).isPopular ?? false)
    }));
  const addons = services
    .filter((s) => String((s as any).type ?? "PACKAGE") === "ADDON")
    .map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      priceRange: s.priceRange,
      showPrice: s.showPrice,
      features: s.features ?? [],
      isPopular: Boolean((s as any).isPopular ?? false)
    }));

  return (
    <ServicesPricingClient packages={packages} addons={addons} />
  );
}

