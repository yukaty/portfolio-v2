import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { ThemeToggle } from "../ThemeToggle";

const navLinks = [
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-md-long",
        isScrolled
          ? "bg-bg-app/80 backdrop-blur-lg shadow-md-2 py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a
          href="#"
          className="text-4xl md:text-3xl font-display font-extrabold transition-all duration-md-medium group"
        >
          <span className="text-text-primary">Y</span>
          <span className="text-coral-500">T</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-text-secondary font-semibold hover:text-coral-500 transition-colors duration-md-short relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-coral-500 to-coral-600 transition-all duration-md-medium group-hover:w-full rounded-full" />
            </a>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            className="text-text-primary hover:text-coral-500 transition-colors duration-md-short p-2 rounded-lg hover:bg-bg-card/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-app/95 backdrop-blur-lg shadow-md-3 py-6 border-t border-border-primary animate-scale-in">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-text-secondary font-semibold hover:text-coral-500 transition-all duration-md-short text-lg px-6 py-2 rounded-lg hover:bg-bg-card/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

