import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const common = (await import(`../../messages/${locale}/common.json`)).default;
  const text = (await import(`../../messages/${locale}/text.json`)).default;
  const data = (await import(`../../messages/${locale}/data.json`)).default;
  const dev = (await import(`../../messages/${locale}/dev.json`)).default;
  const design = (await import(`../../messages/${locale}/design.json`)).default;
  const web = (await import(`../../messages/${locale}/web.json`)).default;

  return {
    locale,
    messages: {
      common,
      privacy: common.privacy,
      github: common.github,
      changelog: common.changelog,
      tools: {
        ...text,
        ...data,
        ...dev,
        ...design,
        ...web
      }
    },
    timeZone: 'UTC',
    now: new Date()
  };
});

