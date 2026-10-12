import { SITE_URL } from '@/lib/brand';
import { PROJECTS } from '@/lib/data';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const pages: MetadataRoute.Sitemap = [
        { url: SITE_URL, priority: 1 },
        { url: `${SITE_URL}/projects`, priority: 0.8 },
        { url: `${SITE_URL}/mobile-applications`, priority: 0.8 },
        { url: `${SITE_URL}/ai-projects`, priority: 0.8 },
    ].map((page) => ({
        ...page,
        lastModified: now,
        changeFrequency: 'monthly' as const,
    }));

    const projects: MetadataRoute.Sitemap = PROJECTS.filter(
        (project) => !project.hidden,
    ).map((project) => ({
        url: `${SITE_URL}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
    }));

    return [...pages, ...projects];
}
