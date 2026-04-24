import { getAllReviews } from "@/actions/client-review-actions";
import { ClientsManagementClient } from "./ui/ClientsManagementClient";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const reviews = await getAllReviews();
  return <ClientsManagementClient initial={reviews} />;
}

