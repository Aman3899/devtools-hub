'use client';

import { Terminal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden bg-background">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="z-10 w-full max-w-lg px-6 text-center space-y-10"
      >
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-muted border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            404 Error
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {t('notFound.title')}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {t('notFound.desc')}
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link href="/">
            <Button className="w-full h-10 font-semibold gap-2 shadow-sm">
              <Terminal className="h-4 w-4" />
              {t('notFound.return')}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <Button variant="outline" onClick={() => window.history.back()} className="h-10 text-xs font-medium border-border/60 hover:bg-muted/50 transition-colors">
            {t('notFound.goBack')}
          </Button>
        </div>

        <div className="pt-8 border-t border-border/40">
          <p className="text-[10px] text-muted-foreground/60 uppercase font-medium tracking-tight">
            {t.rich('notFound.lost', {
              link: (chunks) => (
                <Link href="/" className="text-foreground font-bold hover:underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
