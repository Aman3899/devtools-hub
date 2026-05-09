'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Code, ShieldCheck, Repeat, FileCode, Palette, Terminal, 
  Zap, Shield, Globe, Cpu, ArrowRight, Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from '@/i18n/routing';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const tools = [
  // Data & Security
  { id: 'json-formatter', icon: Code, color: 'text-blue-500', category: 'data' },
  { id: 'jwt-decoder', icon: ShieldCheck, color: 'text-purple-500', category: 'data' },
  { id: 'base64-encoder', icon: Repeat, color: 'text-orange-500', category: 'data' },
  { id: 'env-checker', icon: Terminal, color: 'text-emerald-500', category: 'data' },
  
  // Development
  { id: 'regex-tester', icon: Terminal, color: 'text-green-500', category: 'dev' },
  { id: 'timestamp-converter', icon: Terminal, color: 'text-yellow-500', category: 'dev' },
  { id: 'api-tester', icon: Terminal, color: 'text-red-500', category: 'dev' },
  { id: 'curl-generator', icon: Terminal, color: 'text-gray-500', category: 'dev' },
  { id: 'uuid-generator', icon: Terminal, color: 'text-cyan-500', category: 'dev' },
  { id: 'code-diff-checker', icon: Code, color: 'text-rose-500', category: 'dev' },
  
  // Design
  { id: 'color-palette-generator', icon: Palette, color: 'text-pink-500', category: 'design' },
  { id: 'image-to-base64', icon: Palette, color: 'text-teal-500', category: 'design' },
  { id: 'css-gradient-generator', icon: Palette, color: 'text-violet-500', category: 'design' },
  
  // Web
  { id: 'sql-formatter', icon: FileCode, color: 'text-indigo-500', category: 'web' },
  { id: 'html-previewer', icon: Code, color: 'text-sky-500', category: 'web' },
];

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredTools = tools.filter(tool => 
    tTools(`${tool.id}.title`).toLowerCase().includes(search.toLowerCase()) ||
    tTools(`${tool.id}.description`).toLowerCase().includes(search.toLowerCase())
  );

  const categories = ['data', 'dev', 'design', 'web'];

  return (
    <div className="flex-1 space-y-24 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-30 dark:opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] animate-pulse delay-700" />
          </div>
        </div>

        <div className="container px-4 mx-auto text-center space-y-10 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold tracking-wide uppercase"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>{t('version')}</span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-8xl font-black tracking-tighter text-foreground leading-[1.1] md:leading-[0.9]"
            >
              {t('hero.title').split(' ').map((word, i) => (
                <span key={i} className="inline-block mr-4 last:mr-0 last:text-primary">
                  {word}
                </span>
              ))}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              {t('hero.subtitle')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-2xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input 
                placeholder={t('hero.searchPlaceholder')} 
                className="pl-14 h-16 text-lg rounded-2xl border-white/10 dark:border-white/5 bg-background/60 backdrop-blur-2xl focus-visible:ring-2 focus-visible:ring-primary shadow-2xl transition-all placeholder:text-muted-foreground/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      {!search && (
        <section className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: 'clientSide', icon: Shield, color: 'bg-blue-500/10 text-blue-500' },
            { key: 'fast', icon: Zap, color: 'bg-amber-500/10 text-amber-500' },
            { key: 'free', icon: Globe, color: 'bg-emerald-500/10 text-emerald-500' }
          ].map((benefit, i) => (
            <motion.div
              key={benefit.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-[2rem] bg-card/40 border border-muted-foreground/5 space-y-4 hover:border-primary/20 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <benefit.icon className="h-24 w-24" />
              </div>
              <div className={`p-4 rounded-2xl w-fit ${benefit.color} border border-current/10`}>
                <benefit.icon className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">{t(`benefits.${benefit.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`benefits.${benefit.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </section>
      )}

      {/* Tools Section */}
      <section className="container px-4 mx-auto space-y-24">
        {!isLoaded ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="space-y-32">
            {categories.map((cat, catIdx) => {
              const catTools = filteredTools.filter(t => t.category === cat);
              if (catTools.length === 0) return null;
              
              return (
                <div key={cat} className="space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-muted-foreground/5 pb-8"
                  >
                    <div className="space-y-2">
                      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t(`categories.${cat}`)}</h2>
                      <p className="text-muted-foreground font-medium">{t('catDesc', { category: t(`categories.${cat}`) })}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary/60 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                      <span>{catTools.length} {t('tools')}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {catTools.map((tool) => (
                      <motion.div key={tool.id} variants={itemVariants}>
                        <Link href={`/tools/${tool.id}`}>
                          <Card className="h-full hover:bg-muted/30 border-muted-foreground/10 hover:border-primary/40 hover:shadow-[0_0_40px_-15px_rgba(var(--primary),0.1)] transition-all duration-500 cursor-pointer group rounded-[2rem] p-4 bg-card/40 backdrop-blur-md">
                            <CardHeader className="flex flex-row items-center gap-5 space-y-0 p-4">
                              <div className={`p-4 rounded-2xl bg-background border border-muted-foreground/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                                <tool.icon className={`h-7 w-7 ${tool.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
                                  {tTools(`${tool.id}.title`)}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 text-sm leading-snug">
                                  {tTools(`${tool.id}.description`)}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <div className="px-4 pb-4 mt-2 flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 group-hover:text-primary/40 transition-colors">{t('clientSideLabel')}</span>
                              <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                <ArrowRight className="h-4 w-4 text-primary" />
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {isLoaded && filteredTools.length === 0 && (
          <div className="text-center py-32 space-y-6">
            <div className="p-6 rounded-3xl bg-muted/50 w-fit mx-auto border border-muted-foreground/10">
              <Terminal className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{t('noMatches.title')}</p>
              <p className="text-muted-foreground">{t('noMatches.desc', { search })}</p>
            </div>
            <Button variant="outline" onClick={() => setSearch('')}>{t('noMatches.clear')}</Button>
          </div>
        )}
      </section>

      {/* How it Works */}
      {!search && (
        <section className="container px-4 mx-auto py-24 border-t border-muted-foreground/5">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t('howItWorks.title')}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: t('howItWorks.steps.s1.title'), desc: t('howItWorks.steps.s1.desc') },
              { step: '02', title: t('howItWorks.steps.s2.title'), desc: t('howItWorks.steps.s2.desc') },
              { step: '03', title: t('howItWorks.steps.s3.title'), desc: t('howItWorks.steps.s3.desc') },
              { step: '04', title: t('howItWorks.steps.s4.title'), desc: t('howItWorks.steps.s4.desc') }
            ].map((item, i) => (
              <div key={i} className="space-y-4 relative">
                <span className="text-6xl font-black text-muted/30 absolute -top-8 -left-4 -z-10">{item.step}</span>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About Us & Contact Us */}
      {!search && (
        <section className="container px-4 mx-auto py-24 border-t border-muted-foreground/5 grid gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t('aboutUs.title')}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('aboutUs.p1')}
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('aboutUs.p2')}
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t('contact.title')}</h2>
            <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden shadow-2xl shadow-primary/5">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('contact.emailLabel')}</Label>
                    <Input placeholder={t('contact.emailPlaceholder')} className="h-14 rounded-xl bg-muted/30 border-muted-foreground/10 px-4" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('contact.messageLabel')}</Label>
                    <Textarea placeholder={t('contact.messagePlaceholder')} className="min-h-[120px] p-4 resize-none rounded-xl bg-muted/30 border-muted-foreground/10" />
                  </div>
                  <Button className="w-full h-14 rounded-xl font-bold shadow-lg shadow-primary/20 text-lg">
                    {t('contact.send')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer Branding */}
      <footer className="container px-4 mx-auto border-t border-muted-foreground/5 py-20 text-center space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-3 font-black text-3xl tracking-tighter">
            <div className="bg-primary p-2 rounded-xl">
              <Terminal className="h-6 w-6 text-primary-foreground" />
            </div>
            <span>{t('title')}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">{t('footerNav.privacy')}</Link>
            <Link href="/" className="hover:text-primary transition-colors">{t('footerNav.github')}</Link>
            <Link href="/" className="hover:text-primary transition-colors">{t('footerNav.changelog')}</Link>
            <Link href="/" className="hover:text-primary transition-colors">{t('footerNav.support')}</Link>
          </nav>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            {t('footerNav.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
            <span>{t('serverless')}</span>
            <span>{t('secureLabel')}</span>
            <span>{t('openSource')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

