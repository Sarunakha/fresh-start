import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "./Container";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

const navLinkBase =
  "text-sm tracking-wide text-clinical-charcoal/80 hover:text-clinical-charcoal transition";

export function NavBar({ hideLogo }: { hideLogo?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const dialogTitleId = useId();

  useEffect(() => {
    // Close menu when navigating.
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Prevent background scrolling while the mobile drawer is open.
    const prev = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-clinical-white/85 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <motion.span
              layoutId="main-logo"
              className={hideLogo ? "opacity-0" : "opacity-100"}
            >
              <img
                src="/logo.svg"
                alt="Fresh Start Facility Solutions Sydney"
                className="h-[72px] w-auto max-w-[320px] object-contain"
              />
            </motion.span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "text-clinical-charcoal" : ""}`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "text-clinical-charcoal" : ""}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "text-clinical-charcoal" : ""}`
              }
            >
              Reviews
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `${navLinkBase} ${isActive ? "text-clinical-charcoal" : ""}`
              }
            >
              Services
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white/70 text-clinical-navy shadow-sm backdrop-blur hover:bg-white md:hidden"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/book">
            <Button>Get a Quote</Button>
          </Link>
        </div>
      </Container>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />

          <aside className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-clinical-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
              <div id={dialogTitleId} className="text-sm font-semibold tracking-wide text-clinical-navy">
                Menu
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-clinical-navy hover:bg-black/[0.03]"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-5 py-5">
              <div className="grid gap-2">
                {[
                  { to: "/", label: "Home", end: true },
                  { to: "/about", label: "About Us" },
                  { to: "/reviews", label: "Reviews" },
                  { to: "/services", label: "Services" }
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={(item as any).end}
                    className={({ isActive }) =>
                      [
                        "rounded-xl px-4 py-3 text-sm font-semibold transition",
                        isActive
                          ? "bg-clinical-lavender text-clinical-navy"
                          : "text-clinical-navy hover:bg-black/[0.03]"
                      ].join(" ")
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <Link to="/book" className="mt-5 block" onClick={() => setMobileOpen(false)}>
                <Button className="w-full">Get a Quote</Button>
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}
    </header>
  );
}

