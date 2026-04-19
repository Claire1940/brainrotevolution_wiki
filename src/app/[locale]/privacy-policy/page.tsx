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
  const path = '/privacy-policy'

  return {
    title: 'Privacy Policy - Brainrot Evolution Wiki',
    description:
      'Read how Brainrot Evolution Wiki collects, uses, and protects data when you browse guides, tools, and fan resources.',
    keywords: ['privacy policy', 'Brainrot Evolution Wiki privacy', 'data protection', 'cookie policy'],
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale,
      url: locale === 'en' ? `${siteUrl}${path}` : `${siteUrl}/${locale}${path}`,
      siteName: 'Brainrot Evolution Wiki',
      title: 'Privacy Policy - Brainrot Evolution Wiki',
      description: 'How Brainrot Evolution Wiki handles analytics, cookies, and user privacy.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Privacy Policy - Brainrot Evolution Wiki',
      description: 'How Brainrot Evolution Wiki handles analytics, cookies, and user privacy.',
      images: [`${siteUrl}/images/hero.webp`],
    },
    alternates: buildLanguageAlternates(path, locale as Locale, siteUrl),
  }
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 border-b border-border">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg mb-2">How we collect, use, and protect your information</p>
          <p className="text-slate-400 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-invert prose-slate max-w-none">
            <h2>1. Who We Are</h2>
            <p>
              Brainrot Evolution Wiki is an unofficial fan-made website that publishes gameplay guides, update summaries,
              and community resources for the Roblox game Brainrot Evolution.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
              <li>
                <strong>Technical data:</strong> IP address, browser type, operating system, referrer, and anonymous
                interaction events.
              </li>
              <li>
                <strong>Preference data:</strong> language and theme settings stored locally in your browser.
              </li>
              <li>
                <strong>Cookie data:</strong> essential cookies and analytics identifiers used to understand site usage.
              </li>
            </ul>

            <h2>3. How We Use Data</h2>
            <ul>
              <li>Operate and improve page performance, navigation, and search visibility.</li>
              <li>Understand which guides and tools are most useful to players.</li>
              <li>Detect abuse, bot traffic, and technical errors.</li>
            </ul>

            <h2>4. Analytics and Cookies</h2>
            <p>
              We may use analytics products such as Google Analytics and Microsoft Clarity to measure traffic trends and
              user behavior in aggregate form. We do not intentionally collect sensitive personal data through these tools.
            </p>

            <h2>5. Third-Party Links</h2>
            <p>
              Our pages link to third-party platforms including Roblox, Discord, X, and YouTube. Those websites have
              their own privacy policies and terms.
            </p>

            <h2>6. Children&apos;s Privacy</h2>
            <p>
              This site is intended for a general audience. We do not knowingly collect personal information from children
              under 13. If you believe a child provided personal data, contact us and we will review and remove it where
              applicable.
            </p>

            <h2>7. Data Retention and Security</h2>
            <p>
              We keep analytics and operational logs only as long as needed for security, diagnostics, and improvement.
              We use reasonable safeguards, but no system can guarantee absolute security.
            </p>

            <h2>8. Your Rights</h2>
            <p>
              Depending on your region, you may request access, correction, deletion, or restriction of data associated
              with you. You can also disable cookies through browser settings.
            </p>

            <h2>9. Policy Changes</h2>
            <p>
              We may update this policy when legal requirements or product behavior changes. The revised date at the top
              indicates the latest version.
            </p>

            <h2>10. Contact</h2>
            <p>
              For privacy requests, email:
              {' '}
              <a href="mailto:privacy@brainrotevolution.wiki" className="text-[hsl(var(--nav-theme-light))] hover:underline">
                privacy@brainrotevolution.wiki
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
