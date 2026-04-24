import { QuoteWizard } from "@/components/QuoteWizard";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-[0.28em] text-[#0A1922]/45">GET A QUOTE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A1922] sm:text-4xl">
          Custom facility quote
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[#0A1922]/65">
          Answer a few quick questions so we can prepare an accurate proposal for your space.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl">
        <QuoteWizard />
      </div>
    </div>
  );
}
