import { getTranslations } from 'next-intl/server';
import { ToolLayout } from '@/components/layout/tool-layout';
import { constructMetadata, generateToolSchema, generateBreadcrumbSchema } from '@/lib/seo-utils';
import { siteConfig } from '@/config/site';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { TOOLS } from '@/constants/tools';
import Script from 'next/script';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const locales = ['en', 'ur'];
  const params: any[] = [];
  
  locales.forEach(locale => {
    TOOLS.forEach(tool => {
      params.push({ locale, toolId: tool.id });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; toolId: string }> }) {
  const { locale, toolId } = await params;
  const tool = TOOLS_REGISTRY[toolId];
  
  if (!tool) return {};

  const t = await getTranslations({ locale, namespace: `tools.${toolId}` });

  return constructMetadata({
    title: t('title'),
    description: t('description'),
    canonical: `${siteConfig.url}/${locale}/tools/${toolId}`,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; toolId: string }> }) {
  const { locale, toolId } = await params;
  const toolEntry = TOOLS_REGISTRY[toolId];

  if (!toolEntry) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: `tools.${toolId}` });
  const schema = generateToolSchema(toolId, t('title'), t('description'));
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', item: `${siteConfig.url}/${locale}` },
    { name: t('title'), item: `${siteConfig.url}/${locale}/tools/${toolId}` },
  ]);

  const ToolComponent = toolEntry.component;

  let article = undefined;
  try {
    const rawArticle = t.raw('article');
    if (typeof rawArticle === 'string' && rawArticle !== `tools.${toolId}.article`) {
      article = rawArticle;
    }
  } catch (e) {
    // missing article is fine
  }

  const hasArticle = !!article;

  return (
    <>
      <Script
        id={`${toolId}-schema`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Script
        id={`${toolId}-breadcrumb`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolLayout 
        title={t('title')} 
        description={t('description')}
        article={hasArticle ? <p>{t('article')}</p> : undefined}
        faqs={(() => {
          try {
            // Check if faqs exists and is an object
            const faqsRaw = t.raw('faqs');
            if (!faqsRaw || typeof faqsRaw !== 'object' || Array.isArray(faqsRaw)) {
              return undefined;
            }
            
            const faqs = [];
            for (let i = 0; ; i++) {
              const q = (faqsRaw as any)[`q${i}`];
              const a = (faqsRaw as any)[`a${i}`];
              if (q && a) {
                faqs.push({ question: q, answer: a });
              } else {
                break;
              }
            }
            return faqs.length > 0 ? faqs : undefined;
          } catch (e) {
            // next-intl throws if key is missing in dev
            return undefined;
          }
        })()}
      >
        <ToolComponent />
      </ToolLayout>
    </>
  );
}
