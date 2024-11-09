"use client";

import { useMe } from "@/lib/api/auth";
import { UserRole } from "@/lib/api/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const me = useMe();
  const t = useTranslations('nav');

  const navigationItems = [
    { label: t('home'), href: "/" },
    {
      label: t('forms'),
      href: "/forms",
      roles: [UserRole.hr, UserRole.manager, UserRole.admin],
    },
    {
      label: t('createForm'),
      href: "/forms/create",
      roles: [UserRole.hr, UserRole.manager, UserRole.admin],
    },
    { label: t('admin'), href: "/admin", roles: [UserRole.admin] },
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/60 shadow-sm backdrop-blur-xl"
          : "bg-white/40 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-14 justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-lg font-semibold text-gray-900 transition-colors hover:text-gray-600"
              aria-label="Home"
            >
              <Image
                src="/logo.webp"
                alt="KandidatAI"
                width={30}
                height={30}
                className="mr-2 h-8 w-8 rounded-lg"
              />
              {t('brand')}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  pathname === item.href ? "text-blue-600" : "text-gray-600"
                }`}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            <LanguageSwitcher />

            {/* Add login button or user email */}
            {me ? (
              <span className="text-sm font-medium text-gray-600">{me.email}</span>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  {t('login')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 sm:hidden">
            <LanguageSwitcher />

            {/* Add login button or user email for mobile */}
            {me ? (
              <span className="text-sm font-medium text-gray-600">{me.email}</span>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  {t('login')}
                </Button>
              </Link>
            )}

            <button
              type="button"
              className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
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
        <div className="space-y-3 px-4 py-3">
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
