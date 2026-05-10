import { getTranslations } from 'next-intl/server';
import { Base64EncoderClient } from '@/features/base64-encoder/components/base64-encoder-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { constructMetadata, generateToolSchema, generateBreadcrumbSchema } from '@/lib/seo-utils';
import { siteConfig } from '@/config/site';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.base64-encoder' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `${siteConfig.url}/${locale}/tools/base64-encoder`,
  });
}

export default async function Base64EncoderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.base64-encoder' });
  const schema = generateToolSchema('base64-encoder', t('title'), t('description'));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: `${siteConfig.url}/${locale}` },
    { name: t('title'), item: `${siteConfig.url}/${locale}/tools/base64-encoder` },
  ]);

  return (
    <>
      <Script
        id="base64-encoder-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="base64-encoder-breadcrumb"
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
        <Base64EncoderClient />
      </ToolLayout>
    </>
  );
}
