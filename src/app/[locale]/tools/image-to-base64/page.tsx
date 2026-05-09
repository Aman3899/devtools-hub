import { ImageToBase64Client } from '@/features/image-to-base64/components/image-to-base64-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function ImageToBase64Page() {
  const t = useTranslations('tools.image-to-base64');
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
      <ImageToBase64Client />
    </ToolLayout>
  );
}


