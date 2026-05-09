import { HomeClient } from '@/features/landing/components/home-client';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: `${t('title')} | Professional Developer Tools`,
    description: t('description'),
  };
}

export default function HomePage() {
  return <HomeClient />;
}

