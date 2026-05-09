import { Base64EncoderClient } from '@/features/base64-encoder/components/base64-encoder-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function Base64EncoderPage() {
  const t = useTranslations('tools.base64-encoder');
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
      <Base64EncoderClient />
    </ToolLayout>
  );
}


