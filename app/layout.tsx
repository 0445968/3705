import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

import { inter, geistMono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    default: 'Crafterkite | Creative Operations OS',
    template: '%s | Crafterkite',
  },
  description:
    'Crafterkite is a premium multi-tenant Creative Operations OS designed to streamline your creative workflow.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <Providers>
              {children}
              <Toaster />
            </Providers>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
