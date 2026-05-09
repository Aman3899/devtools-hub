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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tTools(`${tool.id}.title`).toLowerCase().includes(search.toLowerCase()) ||
      tTools(`${tool.id}.description`).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'data', 'dev', 'design', 'web'];
  
  const categoryCount = (cat: string) => {
    if (cat === 'all') return tools.length;
    return tools.filter(t => t.category === cat).length;
  };

  return (
    <div className="flex-1 overflow-x-hidden">
      {/* Professional Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-muted-foreground/10 pt-30 max-sm:pt-12 pb-24">
        {/* Subtle Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container px-6 mx-auto max-w-6xl">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <Badge className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
                <span className="relative flex h-1.5 w-1.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                {t('version')}
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                All-in-One Developer Hub
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button 
                size="lg" 
                className="h-11 px-6 text-base font-medium rounded-lg w-full sm:w-auto whitespace-nowrap cursor-pointer"
                onClick={() => document.getElementById('tools-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('exploreTools')}
                <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-11 px-6 text-base font-medium rounded-lg w-full sm:w-auto whitespace-nowrap cursor-pointer"
                onClick={() => document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('learnMore')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-8 border-t border-muted-foreground/10"
            >
              {[
                { label: 'Tools', value: '15', icon: Terminal },
                { label: 'Free', value: '100%', icon: Check },
                { label: 'Secure', value: 'Client', icon: Shield }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <stat.icon className="h-4 w-4 text-primary flex-shrink-0" />
                  </div>
                  <div className="text-lg md:text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium text-center">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container px-6 mx-auto py-20 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: 'clientSide', icon: Shield, color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20' },
            { key: 'fast', icon: Zap, color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20' },
            { key: 'free', icon: Globe, color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' }
          ].map((benefit, i) => (
            <motion.div
              key={benefit.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-6 rounded-2xl bg-card/50 border border-muted-foreground/10 space-y-3 hover:border-primary/30 hover:shadow-md transition-all duration-300 group overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity">
                <benefit.icon className="h-24 w-24" />
              </div>
              <div className={`p-3 rounded-xl w-fit ${benefit.color} border border-current/20`}>
                <benefit.icon className="h-5 w-5" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="font-bold text-lg">{t(`benefits.${benefit.key}.title`)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(`benefits.${benefit.key}.desc`)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tools Section with Search & Filters */}
      <section id="tools-section" className="container px-6 mx-auto py-20 space-y-10 max-w-6xl">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Explore Our Tools
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Choose from our collection of powerful, client-side developer utilities
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
              placeholder={t('searchPlaceholder')} 
              className="pl-11 pr-10 h-11 text-sm rounded-lg border-muted-foreground/20 bg-background/80 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-primary/50 transition-all w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors z-10 cursor-pointer"
                aria-label={t('clear')}
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground whitespace-nowrap">
              <Filter className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{t('filter')}:</span>
            </div>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full h-8 text-xs transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat 
                    ? 'shadow-sm' 
                    : 'hover:bg-primary/5 hover:border-primary/30'
                }`}
              >
                <span className="truncate">{cat === 'all' ? t('allTools') : t(`categories.${cat}`)}</span>
                <Badge 
                  variant="secondary" 
                  className="ml-1.5 rounded-full px-1.5 py-0 text-xs h-4 min-w-[1rem] flex items-center justify-center flex-shrink-0"
                >
                  {categoryCount(cat)}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {(search || selectedCategory !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium whitespace-nowrap">{t('active')}:</span>
              {search && (
                <Badge variant="secondary" className="rounded-full gap-1 h-6 text-xs max-w-[200px]">
                  <span className="truncate">{t('search')}: "{search}"</span>
                  <button onClick={() => setSearch('')} className="ml-0.5 hover:text-destructive flex-shrink-0 cursor-pointer" aria-label={t('clear')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="rounded-full gap-1 h-6 text-xs">
                  <span className="truncate">{t(`categories.${selectedCategory}`)}</span>
                  <button onClick={() => setSelectedCategory('all')} className="ml-0.5 hover:text-destructive flex-shrink-0 cursor-pointer" aria-label={t('clear')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                }}
                className="text-xs h-6 px-2 rounded-full whitespace-nowrap cursor-pointer"
              >
                {t('clearAll')}
              </Button>
            </div>
          )}

          {/* Results Count */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t('showing')} <span className="font-semibold text-foreground">{filteredTools.length}</span> {t('of')} <span className="font-semibold text-foreground">{tools.length}</span> {t('tools')}
            </p>
          </div>
        </div>
        {/* Tools Grid */}
        {!isLoaded ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTools.map((tool) => (
              <motion.div key={tool.id} variants={itemVariants}>
                <Link href={`/tools/${tool.id}`}>
                  <Card className="h-full hover:bg-muted/40 border-muted-foreground/10 hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer group rounded-2xl p-4 bg-card/50 backdrop-blur-sm hover:-translate-y-0.5">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-background to-muted/30 border border-muted-foreground/10 group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
                        <tool.icon className={`h-5 w-5 ${tool.color}`} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <CardTitle className="text-base font-bold tracking-tight mb-1 group-hover:text-primary transition-colors truncate">
                          {tTools(`${tool.id}.title`)}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs leading-snug break-words">
                          {tTools(`${tool.id}.description`)}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <div className="px-3 pb-3 mt-1 flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest h-5 px-2 whitespace-nowrap flex-shrink-0">
                        {t('clientSideLabel')}
                      </Badge>
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0 duration-300 flex-shrink-0">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 space-y-5">
            <div className="p-6 rounded-2xl bg-muted/30 w-fit mx-auto border border-muted-foreground/10">
              <Terminal className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold">{t('noMatches.title')}</p>
              <p className="text-muted-foreground text-sm">{t('noMatches.desc', { search })}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
              }}
              className="rounded-lg px-5 h-10 text-sm font-medium hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer"
            >
              {t('noMatches.clear')}
            </Button>
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="container px-6 mx-auto py-20 border-t border-muted-foreground/10 max-w-6xl">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{t('howItWorks.title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">{t('howItWorks.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: t('howItWorks.steps.s1.title'), desc: t('howItWorks.steps.s1.desc') },
            { step: '02', title: t('howItWorks.steps.s2.title'), desc: t('howItWorks.steps.s2.desc') },
            { step: '03', title: t('howItWorks.steps.s3.title'), desc: t('howItWorks.steps.s3.desc') },
            { step: '04', title: t('howItWorks.steps.s4.title'), desc: t('howItWorks.steps.s4.desc') }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3 relative p-5 rounded-xl bg-card/30 border border-muted-foreground/10 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-5xl font-black text-primary/20 absolute -top-3 -left-2 -z-10">{item.step}</span>
              <h4 className="font-bold text-base pt-3">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Us Section - Professional */}
      <section id="about-section" className="relative py-20 overflow-hidden border-t border-muted-foreground/10">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background -z-10" />
        
        <div className="container px-6 mx-auto max-w-6xl">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-3 mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                {t('aboutUs.title')}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base">
                Building tools that developers love, with privacy at the core
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Mission Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card/50 border border-muted-foreground/10 backdrop-blur-sm space-y-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('aboutUs.p1')}
                </p>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-card/50 border border-muted-foreground/10 backdrop-blur-sm space-y-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 w-fit">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t('aboutUs.p2')}
                </p>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Terminal, label: 'Tools Available', value: tools.length.toString() },
                { icon: Shield, label: 'Privacy First', value: '100%' },
                { icon: Zap, label: 'Client-Side', value: 'Always' },
                { icon: Globe, label: 'Open Source', value: 'Free' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-card/30 border border-muted-foreground/10 text-center space-y-2.5 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex justify-center">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section - Professional */}
      <section className="container px-6 mx-auto py-20 max-w-6xl">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3 mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('contact.title')}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Have questions or feedback? We'd love to hear from you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="rounded-2xl border-muted-foreground/10 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 md:p-8 space-y-5">
                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">
                        {t('contact.emailLabel')}
                      </Label>
                      <Input 
                        type="email"
                        placeholder={t('contact.emailPlaceholder')} 
                        className="h-10 rounded-lg bg-background/50 border-muted-foreground/20 px-3 text-sm focus-visible:ring-primary/50 transition-all" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-medium text-foreground">
                        {t('subject')}
                      </Label>
                      <Input 
                        placeholder={t('subjectPlaceholder')} 
                        className="h-10 rounded-lg bg-background/50 border-muted-foreground/20 px-3 text-sm focus-visible:ring-primary/50 transition-all" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-foreground">
                      {t('contact.messageLabel')}
                    </Label>
                    <Textarea 
                      placeholder={t('contact.messagePlaceholder')} 
                      className="min-h-[120px] p-3 resize-none rounded-lg bg-background/50 border-muted-foreground/20 text-sm focus-visible:ring-primary/50 transition-all" 
                    />
                  </div>
                  <Button className="w-full h-11 rounded-lg font-medium text-base transition-all group cursor-pointer">
                    {t('contact.send')}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="container px-4 mx-auto border-t border-muted-foreground/10 py-16 text-center space-y-8">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center gap-3 font-black text-3xl tracking-tighter">
            <div className="bg-gradient-to-br from-primary to-purple-600 p-2.5 rounded-xl shadow-lg shadow-primary/20">
              <Terminal className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{t('title')}</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-muted-foreground px-4">
            <Link href="/" className="hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">{t('footerNav.privacy')}</Link>
            <Link href="/" className="hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">{t('footerNav.github')}</Link>
            <Link href="/" className="hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">{t('footerNav.changelog')}</Link>
            <Link href="/" className="hover:text-primary transition-colors hover:underline underline-offset-4 cursor-pointer">{t('footerNav.support')}</Link>
          </nav>
        </div>
        <div className="space-y-3 px-4">
          <p className="text-sm text-muted-foreground font-medium">
            {t('footerNav.copyright', { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
            <span className="px-3 py-1 rounded-full bg-muted/30">{t('serverless')}</span>
            <span className="px-3 py-1 rounded-full bg-muted/30">{t('secureLabel')}</span>
            <span className="px-3 py-1 rounded-full bg-muted/30">{t('openSource')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

