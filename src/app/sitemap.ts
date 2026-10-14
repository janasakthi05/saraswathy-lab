import { MetadataRoute } from 'next';
import { servicesData } from '@/data/services';
import { laboratoriesData } from '@/data/laboratories';
import { locationsData } from '@/data/locations';
import { articlesData } from '@/data/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 1. Static base pages
  const staticPages = [
    '',
    '/privacy-policy',
    '/terms',
    '/medical-disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  // 2. Dynamic services
  const servicesPages = Object.keys(servicesData).map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 3. Dynamic laboratories
  const labsPages = Object.keys(laboratoriesData).map((slug) => ({
    url: `${baseUrl}/laboratories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 4. Dynamic locations
  const locationsPages = Object.keys(locationsData).map((slug) => ({
    url: `${baseUrl}/locations/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 5. Dynamic articles
  const articlesPages = Object.keys(articlesData).map((slug) => ({
    url: `${baseUrl}/health-resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicesPages,
    ...labsPages,
    ...locationsPages,
    ...articlesPages,
  ];
}
