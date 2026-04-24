import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { Container } from "./Container";
import { motion } from "framer-motion";

const navLinkBase =
  "text-sm tracking-wide text-clinical-charcoal/80 hover:text-clinical-charcoal transition";

export function NavBar({ hideLogo }: { hideLogo?: boolean }) {
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
          <Link to="/book">
            <Button>Get a Quote</Button>
          </Link>
        </div>
      </Container>
    </header>
  );
}

