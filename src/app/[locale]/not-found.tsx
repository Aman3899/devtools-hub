'use client';

import { Terminal } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('common');
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-muted/30 rounded-[2rem] flex items-center justify-center border border-muted-foreground/10 shadow-inner">
            <Terminal className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-8xl font-black tracking-tighter text-foreground">404</h1>
          <h2 className="text-2xl font-bold tracking-tight text-foreground/80">{t('notFound.title')}</h2>
          <p className="text-muted-foreground font-medium">
            {t('notFound.desc')}
          </p>
        </div>

        <Link href="/" className="inline-block">
          <Button className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
            {t('notFound.return')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
