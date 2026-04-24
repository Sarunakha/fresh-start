import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/layout/SiteLayout";
import { AboutPage } from "./modules/content/pages/AboutPage";
import { ReviewsPage } from "./modules/content/pages/ReviewsPage";
import { BookServicePage } from "./modules/inquiry/pages/BookServicePage";
import { QuoteWizardPage } from "./modules/inquiry/components/QuoteWizard";
import { ServicesPricingPage } from "./modules/pricing/pages/ServicesPricingPage";
import { HomePage } from "./modules/service/pages/HomePage";

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/clients" element={<Navigate to="/reviews" replace />} />
        <Route path="/services" element={<ServicesPricingPage />} />
        <Route path="/book" element={<BookServicePage />} />
        <Route path="/get-a-quote" element={<QuoteWizardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteLayout>
  );
}

