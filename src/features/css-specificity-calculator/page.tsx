import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CssSpecificityCalculatorClient } from './components/css-specificity-calculator-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'tools.css-specificity-calculator' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function SpecificityCalculatorPage() {
  const t = useTranslations('tools.css-specificity-calculator');

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <CssSpecificityCalculatorClient />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('about_title')}</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>{t('article')}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('faq_title')}</h2>
            <div className="grid gap-4">
              {[0, 1].map((i) => (
                <Card key={i} className="border border-border shadow-none bg-background">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{t(`faqs.q${i}`)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                    {t(`faqs.a${i}`)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
