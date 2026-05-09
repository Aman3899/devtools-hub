import { TimestampConverterClient } from '@/features/timestamp-converter/components/timestamp-converter-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function TimestampConverterPage() {
  const t = useTranslations('tools.timestamp-converter');
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
      <TimestampConverterClient />
    </ToolLayout>
  );
}


