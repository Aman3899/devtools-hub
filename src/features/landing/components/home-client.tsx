'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Code, ShieldCheck, Repeat, FileCode, Palette, Terminal, 
  Zap, Shield, Globe, Cpu, ArrowRight, Star, Filter, X, Check
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { TOOLS, CATEGORIES } from '@/constants/tools';
import { ROUTES } from '@/constants/routes';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function HomeClient() {
  const t = useTranslations('common');
  const tTools = useTranslations('tools');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = TOOLS.filter(tool => {
    const title = tTools(`${tool.id}.title`).toLowerCase();
    const description = tTools(`${tool.id}.description`).toLowerCase();
    const matchesSearch = title.includes(search.toLowerCase()) || description.includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryCount = (cat: string) => {
    if (cat === 'all') return TOOLS.length;
    return TOOLS.filter(t => t.category === cat).length;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header / Search Area */}
      <div className="border-b bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 py-12 md:px-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {t('landing.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('landing.subtitle')}
              </p>
            </div>
            
            <div className="relative max-w-2xl w-full mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input 
                placeholder={t('landing.searchPlaceholder')} 
                className="pl-9 h-10 bg-background border-border focus-visible:ring-1 focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={t('landing.searchPlaceholder')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 md:px-8 flex-1">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Filters */}
          <aside className="w-full md:w-48 shrink-0 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {t('landing.categories')}
              </h2>
              <nav className="flex flex-col gap-1" aria-label="Tool Categories">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={selectedCategory === cat}
                    className={cn(
                      "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors text-left",
                      selectedCategory === cat 
                        ? "bg-secondary text-foreground font-medium" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <span>{cat === 'all' ? t('landing.allTools') : t(`categories.${cat}`)}</span>
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {categoryCount(cat)}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-6 border-t">
              <div className="p-3 rounded-md bg-muted/50 border border-border">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                    <Shield className="h-3 w-3" /> {t('landing.privacyNote')}
                  </span>
                  {t('landing.privacyDesc')}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content / Tool Grid */}
          <main className="flex-1">
            {filteredTools.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => (
                  <Link key={tool.id} href={`${ROUTES.TOOLS}/${tool.id}`} className="group">
                    <Card className="h-full border border-border hover:border-foreground/20 hover:bg-muted/30 transition-all cursor-pointer rounded-md shadow-none flex flex-col p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="p-2 rounded-md bg-muted border border-border group-hover:bg-background transition-colors">
                          <tool.icon className="h-4 w-4 text-foreground" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-foreground group-hover:underline underline-offset-4 decoration-primary/50">
                            {tTools(`${tool.id}.title`)}
                          </h3>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-normal mb-4 flex-1">
                        {tTools(`${tool.id}.description`)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5 rounded-sm bg-muted/50">
                          {t('landing.clientSide')}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/60 uppercase font-medium tracking-tight">
                          {tool.category}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-md bg-muted/20">
                <Terminal className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-medium text-foreground">{t('landing.noTools')}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('landing.noToolsDesc')}
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => { setSearch(''); setSelectedCategory('all'); }}
                  className="mt-2 text-primary h-auto p-0 text-xs"
                >
                  {t('landing.clearFilters')}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <footer className="border-t py-8 bg-muted/30 mt-auto">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{t('title')}</span>
            </div>
            <nav className="flex items-center gap-6 text-xs text-muted-foreground font-medium">
              <Link href={ROUTES.PRIVACY} className="hover:text-foreground transition-colors">{t('footerNav.privacy')}</Link>
              <Link href={ROUTES.GITHUB} className="hover:text-foreground transition-colors">{t('footerNav.github')}</Link>
              <Link href={ROUTES.CHANGELOG} className="hover:text-foreground transition-colors">{t('footerNav.changelog')}</Link>
              <span className="text-muted-foreground/40">
                © {new Date().getFullYear()}
              </span>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}

