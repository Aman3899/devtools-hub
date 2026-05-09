import { ApiTesterClient } from '@/features/api-tester/components/api-tester-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function ApiTesterPage() {
  const t = useTranslations('tools.api-tester');
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
      <ApiTesterClient />
    </ToolLayout>
  );
}


