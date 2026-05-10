import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { constructMetadata } from '@/lib/seo-utils';
import { Rocket, Sparkles, CheckCircle2 } from 'lucide-react';

import { StaticPageLayout } from '@/components/layout/static-page-layout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'changelog' });

  return constructMetadata({
    title: `${t('title')} | DevTools Hub`,
    description: t('description'),
  });
}

export default function ChangelogPage() {
  const t = useTranslations('changelog');

  const versions = [
    { key: 'v1_1', icon: <Sparkles className="h-5 w-5" /> },
    { key: 'v1', icon: <Rocket className="h-5 w-5" /> },
  ];

  return (
    <StaticPageLayout
      title={t('title')}
      description={t('description')}
      icon={<Rocket className="h-8 w-8" />}
    >
      <div className="relative space-y-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {versions.map((v) => (
          <div key={v.key} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon Circle */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              {v.icon}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:border-primary/20 transition-colors">
              <div className="flex items-center justify-between space-x-2 mb-2">
                <div className="font-bold text-foreground text-xl">{t(`${v.key}.title` as any)}</div>
                <time className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">{t(`${v.key}.version` as any)}</time>
              </div>
              <div className="text-xs text-muted-foreground font-medium mb-4">{t(`${v.key}.date` as any)}</div>
              <ul className="space-y-3">
                {t.raw(`${v.key}.items` as any).map((item: string, i: number) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </StaticPageLayout>
  );
}
