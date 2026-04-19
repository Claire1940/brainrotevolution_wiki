import type { Metadata } from 'next'
import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Locale } from '@/i18n/routing'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const SITE_NAME = 'Brainrot Evolution Wiki'
const SITE_DESCRIPTION =
  'Track Brainrot Evolution codes, secrets, pets, worlds, rebirths, and weekly updates in one fast Roblox wiki built for cleaner progression routes.'
const FEATURED_VIDEO_ID = 'QVktq23WYUE'
const FEATURED_VIDEO_TITLE = 'ALL NEW LEAKS in Brainrot Evolution Update 22'
const FEATURED_VIDEO_URL = `https://www.youtube.com/watch?v=${FEATURED_VIDEO_ID}`
const SITE_KEYWORDS = [
  'Brainrot Evolution',
  'Roblox',
  'codes',
  'secrets',
  'pets',
  'worlds',
  'rebirths',
  'trading values',
  'updates',
]

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainrotevolution.wiki'
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const pageUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`

  return {
    title: 'Brainrot Evolution Wiki - Codes, Secrets & Pets',
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      url: pageUrl,
      siteName: SITE_NAME,
      title: 'Brainrot Evolution Wiki - Codes, Secrets & Pets',
      description: SITE_DESCRIPTION,
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'Brainrot Evolution Wiki Hero Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Brainrot Evolution Wiki - Codes, Secrets & Pets',
      description: SITE_DESCRIPTION,
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainrotevolution.wiki'
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()
  const logoImage = new URL('/android-chrome-512x512.png', siteUrl).toString()

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: locale === 'en' ? siteUrl : `${siteUrl}/${locale}`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        image: heroImage,
      },
      {
        '@type': 'VideoObject',
        name: FEATURED_VIDEO_TITLE,
        embedUrl: `https://www.youtube.com/embed/${FEATURED_VIDEO_ID}`,
        contentUrl: FEATURED_VIDEO_URL,
        thumbnailUrl: heroImage,
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: logoImage,
        },
        image: {
          '@type': 'ImageObject',
          url: heroImage,
        },
      },
    ],
  }

  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient
        latestArticles={latestArticles}
        moduleLinkMap={moduleLinkMap}
        locale={locale}
        featuredVideoId={FEATURED_VIDEO_ID}
        featuredVideoTitle={FEATURED_VIDEO_TITLE}
      />
    </>
  )
}
