'use client';

import { useTranslations } from 'next-intl';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Moon, Sun, Languages, Terminal } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function Navbar() {
  const t = useTranslations('common');
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = (locale: 'en' | 'ur') => {
    router.replace(pathname, { locale });
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight cursor-pointer">
          <div className="bg-primary p-1.5 rounded-md">
            <Terminal className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-foreground">
            {t('title')}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 cursor-pointer")}>
              <Languages className="h-4 w-4" />
              <span className="sr-only">Toggle language</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => toggleLocale('en')} className="cursor-pointer">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLocale('ur')} className="cursor-pointer font-urdu text-right">
                اردو
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 cursor-pointer")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                {t('theme.light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                {t('theme.dark')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                {t('theme.system')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

