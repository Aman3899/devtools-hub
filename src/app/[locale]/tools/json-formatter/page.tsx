import { useTranslations } from 'next-intl';
import { JsonFormatterClient } from '@/features/json-formatter/components/json-formatter-client';
import { ToolLayout } from '@/components/layout/tool-layout';

export default function JsonFormatterPage() {
  const t = useTranslations('tools.json-formatter');
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
      <JsonFormatterClient />
    </ToolLayout>
  );
}
