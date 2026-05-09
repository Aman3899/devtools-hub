'use client';

import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';

interface FAQ {
  question: string;
  answer: string;
}

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  article?: React.ReactNode;
  faqs?: FAQ[];
}

export function ToolLayout({ title, description, children, article, faqs }: ToolLayoutProps) {
  const t = useTranslations('common');
  
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-4"
      >
        <Link href="/">
          <Button variant="ghost" size="sm" className="w-fit gap-2 rounded-xl hover:bg-primary/5">
            <ArrowLeft className="h-4 w-4" />
            {t('backToTools')}
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">{title}</h1>
          <p className="text-muted-foreground font-medium">{description}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.div>

      {(article || faqs) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-12 mt-16 lg:grid-cols-[1fr_400px] border-t border-muted-foreground/10 pt-16"
        >
          {article && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2>{t('about')}</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-p:leading-relaxed prose-p:text-muted-foreground">
                {article}
              </div>
            </div>
          )}

          {faqs && faqs.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h2>{t('faqsHeading')}</h2>
              </div>
              <Accordion className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-muted-foreground/10 rounded-2xl bg-card/50 px-4 backdrop-blur-sm data-open:bg-card/80 transition-colors"
                  >
                    <AccordionTrigger className="text-sm font-bold hover:no-underline hover:text-primary transition-colors text-left py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </motion.div>
      )}

      {/* Concise Footer for Tool Pages */}
      <footer className="mt-20 border-t border-muted-foreground/5 py-8 text-center text-sm text-muted-foreground font-medium">
        {t('footerText', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
