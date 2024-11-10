"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { useMe } from "@/lib/api/auth";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const me = useMe();
  const t = useTranslations("nav");

  const navigationItems = [
    { label: t("home"), href: "/" },
    {
      label: t("forms"),
      href: "/forms", 
      roles: ["hr", "manager", "admin"],
    },
    {
      label: t("createForm"),
      href: "/forms/create",
      roles: ["hr", "manager", "admin"],
    },
    { label: t("admin"), href: "/admin", roles: ["admin"] },
  ].filter((item) => {
    if (item.roles) {
      return me && item.roles.includes(me.role);
    }
    return true;
  });

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
      className={`fixed left-0 right-0 top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/60 shadow-sm backdrop-blur-xl"
          : "bg-white/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto w-full max-w-[1920px] px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex flex-shrink-0 items-center">
            <Link
              href="/"
              className="flex items-center text-base font-semibold text-gray-900 transition-colors hover:text-gray-600 sm:text-lg"
              aria-label="Home"
            >
              <Image
                src="/logo.webp"
                alt="KandidatAI"
                width={30}
                height={30}
                className="mr-2 h-6 w-6 rounded-lg sm:h-8 sm:w-8"
              />
              <span className="hidden xs:inline">{t("brand")}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden flex-1 items-center justify-center sm:flex sm:gap-4 md:gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === item.href ? "text-blue-600" : "text-gray-600"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden items-center gap-4 sm:flex">
            <LanguageSwitcher />

            {me ? (
              <span className="max-w-[200px] truncate text-sm font-medium text-gray-600">
                {me.email}
              </span>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Controls */}
          <div className="flex items-center gap-3 sm:hidden">
            <LanguageSwitcher />

            {me ? (
              <span className="max-w-[120px] truncate text-xs font-medium text-gray-600">
                {me.email}
              </span>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="text-xs">
                  {t("login")}
                </Button>
              </Link>
            )}

            <button
              type="button"
              className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
        className={`absolute w-full bg-white/90 shadow-lg backdrop-blur-xl transition-all duration-200 sm:hidden ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        id="mobile-menu"
      >
        <div className="space-y-2 px-4 py-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md p-2 text-sm font-medium transition-colors hover:text-gray-900 ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-600"
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
