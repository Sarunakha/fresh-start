import { getQuoteRequests } from "@/actions/quote-request-actions";
import { QuotesClient, type QuoteRow } from "./ui/QuotesClient";

export default async function AdminQuotesPage() {
  const rows = await getQuoteRequests();
  const initial: QuoteRow[] = rows.map((r) => ({
    id: r.id,
    spaceType: r.spaceType,
    approximateSize: r.approximateSize,
    frequency: r.frequency,
    contactName: r.contactName,
    contactEmail: r.contactEmail,
    contactPhone: r.contactPhone,
    status: r.status,
    addOns: r.addOns
      .slice()
      .sort((a, b) => (a.addOn.sortOrder ?? 0) - (b.addOn.sortOrder ?? 0))
      .map((x) => ({ id: x.addOn.id, name: x.addOn.name, key: x.addOn.key })),
    createdAt: r.createdAt.toISOString()
  }));

  return (
    <div className="min-w-0 w-full rounded-3xl border border-[#0A1922]/8 bg-[#F9FAFB] p-6 shadow-sm md:p-10">
      <header className="mb-8 border-b border-[#0A1922]/10 pb-6">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#0A1922]/50">INBOUND LEADS</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A1922]">Quote Requests</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#0A1922]/60">
          Review wizard submissions and move leads through your pipeline.
        </p>
      </header>

      <QuotesClient initial={initial} />
    </div>
  );
}
