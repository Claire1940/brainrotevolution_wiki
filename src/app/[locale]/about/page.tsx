import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'

interface Props {
  params: Promise<{ locale: string }>
}

const LAST_UPDATED = 'April 19, 2026'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainrotevolution.wiki'
  const path = '/about'

  return {
    title: 'About Brainrot Evolution Wiki',
    description:
      'Learn about Brainrot Evolution Wiki, a fan-made resource that tracks Roblox game updates, codes, secrets, and progression guides.',
    keywords: ['about Brainrot Evolution Wiki', 'Brainrot Evolution guides', 'Roblox wiki'],
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Brainrot Evolution Wiki',
      title: 'About Brainrot Evolution Wiki',
      description: 'Our mission and editorial approach for Brainrot Evolution players.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Brainrot Evolution Wiki',
      description: 'Our mission and editorial approach for Brainrot Evolution players.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Brainrot Evolution Wiki</h1>
          <p className="text-slate-300 text-lg mb-2">Community-driven resources for Brainrot Evolution players</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>Who We Are</h2>
            <p>
              Brainrot Evolution Wiki is an independent fan-made project focused on helping Roblox players navigate
              progression, updates, and high-value decisions in Brainrot Evolution.
            </p>

            <h2>What We Publish</h2>
            <ul>
              <li>Code tracking and redemption references</li>
              <li>Secret brainrots, pets, and world progression guides</li>
              <li>Weekly update summaries and change highlights</li>
              <li>Practical route planning for rebirth and efficient farming</li>
            </ul>

            <h2>Editorial Approach</h2>
            <p>
              We prioritize clear, fast-to-scan pages over filler text. When the live game changes, we update core pages
              first so players can adapt without searching across multiple sources.
            </p>

            <h2>Community and Official Platforms</h2>
            <p>
              We reference official channels such as Roblox game pages, Roblox community pages, Discord, X, and YouTube
              when useful for verification and update tracking.
            </p>

            <h2>Unofficial Disclaimer</h2>
            <p>
              Brainrot Evolution Wiki is unofficial and not affiliated with Roblox Corporation or the official developers
              of Brainrot Evolution.
            </p>

            <h2>Contact</h2>
            <p>
              General inquiries:
              {' '}
              <a href="mailto:contact@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                contact@brainrotevolution.wiki
              </a>
            </p>
            <p>
              Content corrections:
              {' '}
              <a href="mailto:support@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                support@brainrotevolution.wiki
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
