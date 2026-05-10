'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { ROUTES } from '@/constants/routes';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StaticPageLayoutProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  lastUpdated?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function StaticPageLayout({
  title,
  description,
  icon,
  children,
  className,
  lastUpdated,
}: StaticPageLayoutProps) {
  const t = useTranslations('common');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("max-w-4xl mx-auto px-4 py-16 space-y-12", className)}
    >
      <motion.div variants={itemVariants}>
        <Link 
          href={ROUTES.HOME} 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t('navigation.back' as any) || 'Back to Home'}
        </Link>
      </motion.div>

      <div className="space-y-4 text-center">
        {icon && (
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2"
          >
            {icon}
          </motion.div>
        )}
        <motion.h1 
          variants={itemVariants}
          className="text-4xl font-bold tracking-tight text-foreground"
        >
          {title}
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="w-full">
        {children}
      </motion.div>

      {lastUpdated && (
        <motion.div 
          variants={itemVariants}
          className="pt-8 border-t text-center text-sm text-muted-foreground"
        >
          <p>{lastUpdated}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
