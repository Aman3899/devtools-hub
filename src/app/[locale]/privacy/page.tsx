import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { constructMetadata } from '@/lib/seo-utils';
import { Shield, Lock, EyeOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { StaticPageLayout } from '@/components/layout/static-page-layout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  
  return constructMetadata({
    title: `${t('title')} | DevTools Hub`,
    description: t('description'),
  });
}

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
    <StaticPageLayout
      title={t('title')}
      description={t('intro')}
      icon={<Shield className="h-8 w-8" />}
      lastUpdated={t('lastUpdated')}
    >
      <div className="grid gap-8">
        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-8 flex gap-6 items-start">
            <div className="p-3 rounded-xl bg-background shadow-sm shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t('section1.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section1.content')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-8 flex gap-6 items-start">
            <div className="p-3 rounded-xl bg-background shadow-sm shrink-0">
              <EyeOff className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t('section2.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section2.content')}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-8 flex gap-6 items-start">
            <div className="p-3 rounded-xl bg-background shadow-sm shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{t('section3.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">{t('section3.content')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaticPageLayout>
  );
}
