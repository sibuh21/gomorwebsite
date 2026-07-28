"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/images/gomor.png";
import { usePathname } from "next/navigation";

interface SubCategory {
  id: string;
  label: string;
  href: string;
}

interface NavCategory {
  id: string;
  label: string;
  href: string;
  subCategories?: SubCategory[];
}

const projectCategories: NavCategory[] = [
  {
    id: "all",
    label: "All",
    href: "/",
  },
  {
    id: "architecture",
    label: "Architecture",
    href: "/?category=ARCHITECTURAL",
    subCategories: [
      { id: "all-arch", label: "View all", href: "/?category=ARCHITECTURAL" },
    ],
  },
  {
    id: "interiors",
    label: "Interiors",
    href: "/?category=INTERIOR",
    subCategories: [
      { id: "all-int", label: "View all", href: "/?category=INTERIOR" },
    ],
  },
  {
    id: "landscape",
    label: "Landscape",
    href: "/?category=LANDSCAPE",
    subCategories: [
      { id: "all-land", label: "View all", href: "/?category=LANDSCAPE" },
    ],
  },
];

const mainNavLinks = [
  { label: "Projects", href: "/", hasDropdown: true },
  { label: "About", href: "/about" },
  { label: "People", href: "/people" },
  { label: "Careers", href: "/career" },
];

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navHidden, setNavHidden] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setNavHidden(true);
    } else {
      setNavHidden(false);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`nav-wrapper ${navHidden && !mobileMenuOpen ? "nav-hidden" : ""}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <Image src={logo} alt="Gomor Architects" width={28} height={28} />
            <span className="nav-logo-text">Gomor</span>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            {mainNavLinks.map((link) => (
              <li key={link.label} className="nav-link-item">
                {link.hasDropdown ? (
                  <>
                    <Link
                      href={link.href}
                      className={`nav-link ${pathname === link.href ? "active" : ""}`}
                    >
                      {link.label}
                    </Link>
                    <div className="nav-dropdown">
                      {projectCategories.map((cat) => (
                        <div key={cat.id} className="nav-dropdown-section">
                          <Link href={cat.href} className="nav-dropdown-title">
                            {cat.label}
                          </Link>
                          {cat.subCategories?.map((sub) => (
                            <Link
                              key={sub.id}
                              href={sub.href}
                              className="nav-dropdown-link view-all"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className={`nav-link ${pathname === link.href ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-section">
          <Link href="/" className="mobile-nav-title">
            Projects
          </Link>
          {projectCategories.map((cat) => (
            <Link key={cat.id} href={cat.href} className="mobile-nav-sublink">
              {cat.label}
            </Link>
          ))}
        </div>
        <div className="mobile-nav-section">
          <Link href="/about" className="mobile-nav-title">
            About
          </Link>
        </div>
        <div className="mobile-nav-section">
          <Link href="/people" className="mobile-nav-title">
            People
          </Link>
        </div>
        <div className="mobile-nav-section">
          <Link href="/career" className="mobile-nav-title">
            Careers
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavBar;