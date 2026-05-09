'use client';

import QueryProvider from './query-provider';
import ReduxProvider from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { NextIntlClientProvider } from 'next-intl';

interface RootProviderProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export default function RootProvider({
  children,
  locale,
  messages,
}: RootProviderProps) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
