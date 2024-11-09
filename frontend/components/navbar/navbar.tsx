"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Forms", href: "/forms" },
    { label: "Create Form", href: "/forms/create" },
    { label: "Admin", href: "/admin" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      handleMenuToggle();
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/60 backdrop-blur-xl shadow-sm" 
          : "bg-white/40 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between h-14">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/"
              className="text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors"
              aria-label="Home"
            >
              Brand
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-900
                  ${pathname === item.href ? "text-blue-600" : "text-gray-600"}`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={handleMenuToggle}
              onKeyDown={handleKeyDown}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute w-full bg-white/90 backdrop-blur-xl shadow-lg transition-all duration-200
          ${isMobileMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        id="mobile-menu"
      >
        <div className="px-4 py-3 space-y-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block text-sm font-medium transition-colors hover:text-gray-900 p-2 rounded-md
                ${pathname === item.href 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:bg-gray-50"
                }`}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
