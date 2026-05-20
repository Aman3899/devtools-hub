'use client';

import { useLocale } from 'next-intl';

/**
 * Consistent language/locale detection hook.
 * Replaces the scattered `tCommon('hero.searchPlaceholder' as any) === 'Find a tool...'` pattern.
 */
export function useLanguage() {
  const locale = useLocale();

  return {
    locale,
    isEnglish: locale === 'en',
    isUrdu: locale === 'ur',
    dir: locale === 'ur' ? ('rtl' as const) : ('ltr' as const),
  };
}
