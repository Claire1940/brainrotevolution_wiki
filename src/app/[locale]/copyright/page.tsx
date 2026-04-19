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
  const path = '/copyright'

  return {
    title: 'Copyright Notice - Brainrot Evolution Wiki',
    description:
      'Copyright and intellectual property information for Brainrot Evolution Wiki, including fair use and DMCA contact details.',
    keywords: ['copyright', 'DMCA', 'Brainrot Evolution Wiki copyright', 'fair use'],
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Brainrot Evolution Wiki',
      title: 'Copyright Notice - Brainrot Evolution Wiki',
      description: 'Copyright, fair use, and DMCA policy for Brainrot Evolution Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Copyright Notice - Brainrot Evolution Wiki',
      description: 'Copyright, fair use, and DMCA policy for Brainrot Evolution Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Copyright Notice</h1>
          <p className="text-slate-300 text-lg mb-2">Intellectual property rights and usage terms</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Website Content Ownership</h2>
            <p>
              © 2026 Brainrot Evolution Wiki. Original text, page structure, guide formatting, and editorial assets on
              this website are protected by applicable copyright law unless otherwise noted.
            </p>

            <h2>2. Game Assets and Trademarks</h2>
            <p>
              Brainrot Evolution Wiki is an unofficial fan-made website. Roblox, Brainrot Evolution, and related game
              assets, logos, and marks are the property of their respective owners.
            </p>

            <h2>3. Fair Use</h2>
            <p>
              We may reference screenshots, names, and game-related elements for informational and educational purposes.
              Our intent is to support players with commentary and guides, not to substitute or redistribute official
              products.
            </p>

            <h2>4. Reuse Restrictions</h2>
            <ul>
              <li>Do not copy full guides or data pages for commercial redistribution.</li>
              <li>Do not remove attribution or claim ownership of our original editorial content.</li>
              <li>Automated scraping of large portions of content is not allowed without written permission.</li>
            </ul>

            <h2>5. Permitted Attribution</h2>
            <p>
              You may quote short excerpts with clear attribution and a source link.
              Example: <em>Source: Brainrot Evolution Wiki (brainrotevolution.wiki)</em>
            </p>

            <h2>6. DMCA Notices</h2>
            <p>
              If you believe content on this site infringes your copyright, send a written notice including ownership
              details, the infringing URL, and your contact information.
            </p>
            <p>
              DMCA contact:
              {' '}
              <a href="mailto:dmca@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                dmca@brainrotevolution.wiki
              </a>
            </p>

            <h2>7. General Copyright Contact</h2>
            <p>
              For other copyright inquiries:
              {' '}
              <a href="mailto:copyright@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                copyright@brainrotevolution.wiki
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
