import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { TOOLS } from '@/constants/tools';
import { routing } from '@/i18n/routing';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;
  const baseUrl = siteConfig.url;

  const routes = [
    '',
    ...TOOLS.map((tool) => `/tools/${tool.id}`),
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      const url = `${baseUrl}/${locale}${route}`;
      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
