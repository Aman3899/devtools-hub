import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { TailwindLookupClient } from './components/tailwind-class-lookup-client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'tools.tailwind-class-lookup' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function TailwindLookupPage() {
  const t = useTranslations('tools.tailwind-class-lookup');

  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <TailwindLookupClient />

      <div className="grid gap-8 lg:grid-cols-12 max-w-5xl mx-auto">
        <div className="lg:col-span-12 space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('about_title')}</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>{t('article')}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">{t('faq_title')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
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
