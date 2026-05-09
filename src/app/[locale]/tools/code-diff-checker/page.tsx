import { CodeDiffCheckerClient } from '@/features/code-diff-checker/components/code-diff-checker-client';
import { ToolLayout } from '@/components/layout/tool-layout';
import { useTranslations } from 'next-intl';

export default function CodeDiffCheckerPage() {
  const t = useTranslations('tools.code-diff-checker');
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
      <CodeDiffCheckerClient />
    </ToolLayout>
  );
}


