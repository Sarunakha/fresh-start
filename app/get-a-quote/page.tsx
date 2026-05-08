import { Container } from "@/components/layout/Container";
import { QuoteWizard } from "@/components/QuoteWizard";

export const dynamic = "force-dynamic";

export default function GetAQuotePage() {
  return (
    <div className="min-h-screen bg-clinical-lavender py-16">
      <Container>
        <div className="text-xs font-semibold tracking-[0.28em] text-clinical-charcoal/60">
          GET A QUOTE
        </div>
        <h1 className="mt-4 text-5xl text-clinical-navy">Request a Custom Quote</h1>
        <p className="mt-4 max-w-2xl text-sm text-clinical-charcoal/70">
          Answer a few quick questions and our team will follow up with a tailored quote.
        </p>

        <div className="mt-10">
          <QuoteWizard />
        </div>
      </Container>
    </div>
  );
}

