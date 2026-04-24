import { getServices } from "@/actions/service-actions";
import { getAddOnsAdmin } from "@/actions/addon-actions";
import { ServicesManagementClient } from "./ui/ServicesManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await getServices(true);
  const addOns = await getAddOnsAdmin();
  return <ServicesManagementClient initial={services} initialAddOns={addOns} />;
}

