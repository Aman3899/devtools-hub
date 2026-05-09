import { RegexTesterClient } from '@/features/regex-tester/components/regex-tester-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function RegexTesterPage() {
  const t = useTranslations('tools.regex-tester');
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
      <RegexTesterClient />
    </ToolLayout>
  );
}


