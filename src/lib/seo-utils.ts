import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export function constructMetadata({
  title,
  description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
  canonical,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonical?: string;
} = {}): Metadata {
  const url = canonical || siteConfig.url;

  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
      description: description || siteConfig.description,
      images: [image],
      creator: '@devtoolshub',
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function generateToolSchema(toolId: string, title: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    description: description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    url: `${siteConfig.url}/tools/${toolId}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'DevTools Hub',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
