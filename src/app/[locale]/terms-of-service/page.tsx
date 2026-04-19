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
  const path = '/terms-of-service'

  return {
    title: 'Terms of Service - Brainrot Evolution Wiki',
    description:
      'Read the Terms of Service for Brainrot Evolution Wiki, including acceptable use, disclaimers, and contact information.',
    keywords: ['terms of service', 'Brainrot Evolution Wiki terms', 'user agreement', 'legal terms'],
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Brainrot Evolution Wiki',
      title: 'Terms of Service - Brainrot Evolution Wiki',
      description: 'Terms and conditions for using Brainrot Evolution Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Terms of Service - Brainrot Evolution Wiki',
      description: 'Terms and conditions for using Brainrot Evolution Wiki.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-lg mb-2">Terms and conditions for using Brainrot Evolution Wiki</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By using Brainrot Evolution Wiki, you agree to these Terms of Service. If you do not agree, please stop
              using the site.
            </p>

            <h2>2. Service Description</h2>
            <p>
              Brainrot Evolution Wiki is an unofficial fan-made information site for the Roblox game Brainrot Evolution.
              We provide guides, updates, references, and curated external links.
            </p>

            <h2>3. Acceptable Use</h2>
            <ul>
              <li>Use the website lawfully and do not attempt to disrupt site operation.</li>
              <li>Do not scrape or republish our content for commercial use without permission.</li>
              <li>Do not upload malware, abusive content, or illegal materials through any public channel we provide.</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
              Original content on this website belongs to Brainrot Evolution Wiki unless otherwise stated. Game names,
              logos, and platform marks belong to their respective owners.
            </p>

            <h2>5. Unofficial Status</h2>
            <p>
              Brainrot Evolution Wiki is not affiliated with, endorsed by, or sponsored by Roblox Corporation or the
              official Brainrot Evolution developers.
            </p>

            <h2>6. Accuracy and Updates</h2>
            <p>
              We work to keep guides accurate, but game updates can make information outdated. Content is provided "as is"
              without guarantees of completeness or fitness for any specific purpose.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Brainrot Evolution Wiki and its contributors are not liable for any
              indirect, incidental, or consequential damages from site use.
            </p>

            <h2>8. External Platforms</h2>
            <p>
              Links to Roblox, Discord, X, YouTube, and other third-party services are provided for convenience. We are
              not responsible for third-party content or policies.
            </p>

            <h2>9. Changes to Terms</h2>
            <p>
              We may revise these terms at any time. Continued use after revisions means you accept the updated terms.
            </p>

            <h2>10. Contact</h2>
            <p>
              For legal inquiries, email:
              {' '}
              <a href="mailto:legal@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                legal@brainrotevolution.wiki
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
