"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/routing";
import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

const languages = {
  en: "English",
  ru: "Русский",
} as const;

const LANG_STORAGE_KEY = 'preferred-language';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<string>(() => {
    // Try to get from localStorage during initialization
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Set initial language from localStorage if exists
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    if (savedLang && savedLang !== currentLocale) {
      switchLanguage(savedLang);
    }
  }, []); // Run once on mount

  const switchLanguage = (locale: string) => {
    // Save to localStorage
    localStorage.setItem(LANG_STORAGE_KEY, locale);
    setCurrentLocale(locale);
    router.push(pathname, { locale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([locale, label]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLanguage(locale)}
            className={currentLocale === locale ? "bg-accent" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 