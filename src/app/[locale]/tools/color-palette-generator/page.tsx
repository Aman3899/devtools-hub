import { getTranslations } from 'next-intl/server';
import { ColorPaletteGeneratorClient } from '@/features/color-palette-generator/components/color-palette-generator-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { constructMetadata, generateToolSchema, generateBreadcrumbSchema } from '@/lib/seo-utils';
import { siteConfig } from '@/config/site';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.color-palette-generator' });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `${siteConfig.url}/${locale}/tools/color-palette-generator`,
  });
}

export default async function ColorPaletteGeneratorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tools.color-palette-generator' });
  const schema = generateToolSchema('color-palette-generator', t('title'), t('description'));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: `${siteConfig.url}/${locale}` },
    { name: t('title'), item: `${siteConfig.url}/${locale}/tools/color-palette-generator` },
  ]);

  return (
    <>
      <Script
        id="color-palette-generator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id="color-palette-generator-breadcrumb"
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
        <ColorPaletteGeneratorClient />
      </ToolLayout>
    </>
  );
}
