import { getTranslations } from 'next-intl/server';
import { JsonFormatterClient } from '@/features/json-formatter/components/json-formatter-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { constructMetadata, generateToolSchema, generateBreadcrumbSchema } from '@/lib/seo-utils';
import { siteConfig } from '@/config/site';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.json-formatter' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `${siteConfig.url}/${locale}/tools/json-formatter`,
  });
}

export default async function JsonFormatterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.json-formatter' });
  const schema = generateToolSchema('json-formatter', t('title'), t('description'));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: `${siteConfig.url}/${locale}` },
    { name: t('title'), item: `${siteConfig.url}/${locale}/tools/json-formatter` },
  ]);

  return (
    <>
      <Script
        id="json-formatter-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="json-formatter-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolLayout 
        title={t('title')} 
        description={t('description')}
        article={<p>{t('article')}</p>}
        faqs={[
          { question: t('faqs.q0'), answer: t('faqs.a0') },
          { question: t('faqs.q1'), answer: t('faqs.a1') }
        ]}
      >
        <JsonFormatterClient />
      </ToolLayout>
    </>
  );
}
