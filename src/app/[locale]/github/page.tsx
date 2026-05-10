import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { constructMetadata } from '@/lib/seo-utils';
import { Star, GitBranch, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

import { StaticPageLayout } from '@/components/layout/static-page-layout';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'github' });

  return constructMetadata({
    title: `${t('title')} | DevTools Hub`,
    description: t('description'),
  });
}

export default function GithubPage() {
  const t = useTranslations('github');

  return (
    <StaticPageLayout
      title={t('title')}
      description={t('intro')}
      icon={<GithubIcon className="h-8 w-8" />}
    >
      <div className="space-y-12">
        <div className="flex justify-center">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="gap-2 rounded-full px-8">
              <GithubIcon className="h-5 w-5" />
              {t('cta')}
            </Button>
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border/50 shadow-none bg-muted/20">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-primary">
                <Code2 className="h-5 w-5" />
                <h2 className="font-semibold">{t('contribute.title')}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('contribute.content')}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-none bg-muted/20">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-primary">
                <GitBranch className="h-5 w-5" />
                <h2 className="font-semibold">{t('license.title')}</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('license.content')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 border border-primary/10 text-center space-y-4">
          <div className="flex justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-tighter">{t('openSource')}</span>
            </div>
            <div className="flex items-center gap-2">
              <GithubIcon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-tighter">{t('communityBuilt')}</span>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
