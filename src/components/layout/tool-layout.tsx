'use client';

import { ArrowLeft, BookOpen, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/constants/routes';

import { ToolNavigation } from '@/components/tool-navigation';

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
  toolId?: string;
}

export function ToolLayout({ title, description, children, article, faqs, toolId }: ToolLayoutProps) {
  const t = useTranslations('common');
  
  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-10">
      <div className="flex flex-col gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="w-fit gap-2 h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{t('backToTools')}</span>
          </Button>
        </Link>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>
        </div>
      </div>

      <div className="min-h-[400px]">
        {toolId ? (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-9 space-y-6">
              {children}
            </div>
            <div className="lg:col-span-3 space-y-6">
              <ToolNavigation currentToolId={toolId} />
            </div>
          </div>
        ) : (
          children
        )}
      </div>

      {(article || faqs) && (
        <div className="grid gap-16 lg:grid-cols-12 border-t pt-16">
          {article && (
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                <BookOpen className="h-4 w-4" />
                <h2>{t('about')}</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground">
                {article}
              </div>
            </div>
          )}

          {faqs && faqs.length > 0 && (
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground/70">
                <HelpCircle className="h-4 w-4" />
                <h2>{t('faqsHeading')}</h2>
              </div>
              <Accordion className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-b"
                  >
                    <AccordionTrigger className="text-sm font-medium hover:no-underline py-3 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      )}

      <footer className="pt-16 border-t pb-8 flex justify-between items-center text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
        <span>{t('footerText', { year: new Date().getFullYear() })}</span>
        <div className="flex items-center gap-6">
          <Link href={ROUTES.PRIVACY} className="hover:text-foreground transition-colors">{t('footerNav.privacy')}</Link>
          <Link href={ROUTES.GITHUB} className="hover:text-foreground transition-colors">{t('footerNav.github')}</Link>
          <Link href={ROUTES.CHANGELOG} className="hover:text-foreground transition-colors">{t('footerNav.changelog')}</Link>
        </div>
      </footer>
    </div>
  );
}
