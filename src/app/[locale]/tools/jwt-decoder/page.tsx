import { JwtDecoderClient } from '@/features/jwt-decoder/components/jwt-decoder-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function JwtDecoderPage() {
  const t = useTranslations('tools.jwt-decoder');
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
      <JwtDecoderClient />
    </ToolLayout>
  );
}


