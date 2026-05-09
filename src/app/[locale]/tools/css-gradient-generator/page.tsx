import { CssGradientGeneratorClient } from '@/features/css-gradient-generator/components/css-gradient-generator-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function CssGradientGeneratorPage() {
  const t = useTranslations('tools.css-gradient-generator');
  return (
    <ToolLayout 
      title={t('title')} 
      description={t('description')}
      article={<p>{t('article')}</p>}
      faqs={[
        { question: t('faqs.q0'), answer: t('faqs.a0') },
        { question: t('faqs.q1'), answer: t('faqs.a1') }
      ]}
    >
      <CssGradientGeneratorClient />
    </ToolLayout>
  );
}


