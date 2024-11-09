import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get preferred language from cookie if exists
  const preferredLanguage = request.cookies.get('preferred-language')?.value;
  
  // Get language from accept-language header as fallback
  const browserLanguage = request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en';
  
  // Use preferred language from cookie if available, otherwise use browser language
  const defaultLocale = preferredLanguage || ((['ru', 'en'].includes(browserLanguage)) ? browserLanguage : 'en');

  // Handle root path redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Handle other paths that don't start with locale
  const pathnameHasLocale = routing.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  // Store the selected language in a cookie when switching languages
  const response = await intlMiddleware(request);
  const currentLocale = pathname.split('/')[1];
  
  if (['en', 'ru'].includes(currentLocale)) {
    response.cookies.set('preferred-language', currentLocale, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax'
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
