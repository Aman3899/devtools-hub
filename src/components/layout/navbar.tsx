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
    <nav className="border-b border-muted-foreground/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter group cursor-pointer">
          <div className="bg-gradient-to-br from-primary to-purple-600 p-2.5 rounded-xl group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary/20">
            <Terminal className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "cursor-pointer rounded-xl hover:bg-primary/10 transition-colors")}>
              <Languages className="h-[1.1rem] w-[1.1rem]" />
              <span className="sr-only">Toggle language</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 border-muted-foreground/10 shadow-xl backdrop-blur-xl bg-background/95">
              <DropdownMenuItem onClick={() => toggleLocale('en')} className="rounded-lg cursor-pointer hover:bg-primary/10">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLocale('ur')} className="rounded-lg cursor-pointer font-urdu hover:bg-primary/10">
                اردو
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "cursor-pointer rounded-xl hover:bg-primary/10 transition-colors")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 border-muted-foreground/10 shadow-xl backdrop-blur-xl bg-background/95">
              <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-lg cursor-pointer hover:bg-primary/10">
                {t('theme.light')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-lg cursor-pointer hover:bg-primary/10">
                {t('theme.dark')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')} className="rounded-lg cursor-pointer hover:bg-primary/10">
                {t('theme.system')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}

