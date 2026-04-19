'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Eye,
  ExternalLink,
  MessageCircle,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

function ToolNavCard({
  card,
  index,
  href,
  sectionId,
}: {
  card: any
  index: number
  href: string
  sectionId: string
}) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault()
        scrollToSection(sectionId)
      }}
      className="scroll-reveal group p-6 rounded-xl border border-border
                 bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                 transition-all duration-300 cursor-pointer text-left
                 hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="w-12 h-12 rounded-lg mb-4
                      bg-[hsl(var(--nav-theme)/0.1)]
                      flex items-center justify-center
                      group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                      transition-colors">
        <DynamicIcon
          name={card.icon}
          className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
        />
      </div>
      <h3 className="font-semibold mb-2">{card.title}</h3>
      <p className="text-sm text-muted-foreground">{card.description}</p>
    </a>
  )
}

// Render section titles as plain text to avoid internal URL links on homepage modules.
function LinkedTitle({
  children,
  className,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  return <span className={className}>{children}</span>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
  featuredVideoId: string
  featuredVideoTitle: string
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
  featuredVideoId,
  featuredVideoTitle,
}: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://brainrotevolution.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Brainrot Evolution Wiki',
        description:
          "Track Brainrot Evolution codes, secrets, pets, worlds, rebirths, and updates in one fast Roblox wiki built for players who want cleaner progression help.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'Brainrot Evolution Wiki Hero Image',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Brainrot Evolution Wiki',
        alternateName: 'Brainrot Evolution',
        url: siteUrl,
        description:
          'Community-driven Brainrot Evolution resource hub with codes, secrets, pets, worlds, and weekly update coverage',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: 'Brainrot Evolution Wiki Hero Image',
        },
        sameAs: [
          'https://www.roblox.com/games/111989938562194/Brainrot-Evolution',
          'https://www.roblox.com/communities/35325835/brainrot-evolution',
          'https://discord.com/invite/eYeaS2R2JR',
          'https://x.com/xFrozenStudios',
          'https://www.youtube.com/channel/UCLqP1JHpk9RRvdKTEHGcqSA',
        ],
      },
      {
        '@type': 'VideoGame',
        name: 'Brainrot Evolution',
        gamePlatform: ['Roblox'],
        applicationCategory: 'Game',
        genre: ['Simulation', 'Adventure', 'Progression', 'Meme'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 50,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://www.roblox.com/games/111989938562194/Brainrot-Evolution',
        },
      },
    ],
  }

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [deckExpanded, setDeckExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="https://discord.com/invite/eYeaS2R2JR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href="https://www.roblox.com/games/111989938562194/Brainrot-Evolution"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId={featuredVideoId}
              title={featuredVideoTitle}
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ToolNavCard card={t.tools.cards[0]} index={0} href="#brainrot-evolution-codes" sectionId="brainrot-evolution-codes" />
            <ToolNavCard card={t.tools.cards[1]} index={1} href="#brainrot-evolution-beginner-guide" sectionId="brainrot-evolution-beginner-guide" />
            <ToolNavCard card={t.tools.cards[2]} index={2} href="#brainrot-evolution-rebirth-guide" sectionId="brainrot-evolution-rebirth-guide" />
            <ToolNavCard card={t.tools.cards[3]} index={3} href="#brainrot-evolution-all-brainrots" sectionId="brainrot-evolution-all-brainrots" />
            <ToolNavCard card={t.tools.cards[4]} index={4} href="#brainrot-evolution-trading-values" sectionId="brainrot-evolution-trading-values" />
            <ToolNavCard card={t.tools.cards[5]} index={5} href="#brainrot-evolution-secrets-guide" sectionId="brainrot-evolution-secrets-guide" />
            <ToolNavCard card={t.tools.cards[6]} index={6} href="#brainrot-evolution-secret-tier-list" sectionId="brainrot-evolution-secret-tier-list" />
            <ToolNavCard card={t.tools.cards[7]} index={7} href="#brainrot-evolution-pets-guide" sectionId="brainrot-evolution-pets-guide" />
            <ToolNavCard card={t.tools.cards[8]} index={8} href="#brainrot-evolution-world-guide" sectionId="brainrot-evolution-world-guide" />
            <ToolNavCard card={t.tools.cards[9]} index={9} href="#brainrot-evolution-relics-guide" sectionId="brainrot-evolution-relics-guide" />
            <ToolNavCard card={t.tools.cards[10]} index={10} href="#brainrot-evolution-trinkets-guide" sectionId="brainrot-evolution-trinkets-guide" />
            <ToolNavCard card={t.tools.cards[11]} index={11} href="#brainrot-evolution-items-guide" sectionId="brainrot-evolution-items-guide" />
            <ToolNavCard card={t.tools.cards[12]} index={12} href="#brainrot-evolution-trading-guide" sectionId="brainrot-evolution-trading-guide" />
            <ToolNavCard card={t.tools.cards[13]} index={13} href="#brainrot-evolution-update-log" sectionId="brainrot-evolution-update-log" />
            <ToolNavCard card={t.tools.cards[14]} index={14} href="#brainrot-evolution-discord-trello" sectionId="brainrot-evolution-discord-trello" />
            <ToolNavCard card={t.tools.cards[15]} index={15} href="#brainrot-evolution-boss-event-guide" sectionId="brainrot-evolution-boss-event-guide" />
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Brainrot Evolution Codes */}
      <section id="brainrot-evolution-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksBeginnerGuide.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksBeginnerGuide']} locale={locale}>
                {t.modules.lucidBlocksBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksBeginnerGuide.subtitle}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {t.modules.lucidBlocksBeginnerGuide.items.map((codeItem: any, index: number) => (
              <article
                key={index}
                className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                      codeItem.status === 'active'
                        ? 'bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]'
                        : 'bg-white/5 border-border text-muted-foreground'
                    }`}
                  >
                    {codeItem.status === 'active' ? 'ACTIVE' : 'EXPIRED'}
                  </span>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{codeItem.code}</h3>
                <p className="text-sm text-muted-foreground">{codeItem.reward}</p>
              </article>
            ))}
          </div>

          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">How to Redeem Brainrot Evolution Codes</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.modules.lucidBlocksBeginnerGuide.intro}
            </p>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Brainrot Evolution Beginner Guide */}
      <section id="brainrot-evolution-beginner-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksApotheosisCrafting.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksApotheosisCrafting']} locale={locale}>{t.modules.lucidBlocksApotheosisCrafting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksApotheosisCrafting.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksApotheosisCrafting.intro}
          </p>
          <div className="scroll-reveal space-y-4">
            {t.modules.lucidBlocksApotheosisCrafting.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.35)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-xl">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksApotheosisCrafting::items::${index}`]} locale={locale}>
                      {item.title}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">{item.body}</p>
                <ul className="space-y-2">
                  {item.tips.map((tip: string, tipIndex: number) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Brainrot Evolution Rebirth Guide */}
      <section id="brainrot-evolution-rebirth-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksToolsAndWeapons.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksToolsAndWeapons']} locale={locale}>{t.modules.lucidBlocksToolsAndWeapons.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksToolsAndWeapons.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksToolsAndWeapons.intro}
          </p>
          <div className="scroll-reveal space-y-5">
            {t.modules.lucidBlocksToolsAndWeapons.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.35)] text-sm font-bold text-[hsl(var(--nav-theme-light))]">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-xl">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksToolsAndWeapons::items::${index}`]} locale={locale}>
                      {item.title}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                {item.bullets && (
                  <ul className="space-y-2 mb-4">
                    {item.bullets.map((bullet: string, bulletIndex: number) => (
                      <li key={bulletIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {item.milestones && (
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                        <tr>
                          <th className="text-left p-3 font-semibold">Rebirth</th>
                          <th className="text-left p-3 font-semibold">Brainrot</th>
                          <th className="text-left p-3 font-semibold">World</th>
                          <th className="text-left p-3 font-semibold">Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.milestones.map((milestone: any, milestoneIndex: number) => (
                          <tr key={milestoneIndex} className="border-t border-border hover:bg-white/5 transition-colors">
                            <td className="p-3 font-medium">{milestone.rebirth}</td>
                            <td className="p-3 text-muted-foreground">{milestone.brainrot}</td>
                            <td className="p-3 text-muted-foreground">{milestone.world}</td>
                            <td className="p-3 text-[hsl(var(--nav-theme-light))] font-semibold">{milestone.level}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Brainrot Evolution All Brainrots */}
      <section id="brainrot-evolution-all-brainrots" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksStorageAndInventory.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksStorageAndInventory']} locale={locale}>{t.modules.lucidBlocksStorageAndInventory.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-4xl mx-auto">{t.modules.lucidBlocksStorageAndInventory.subtitle}</p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksStorageAndInventory.intro}
          </p>
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="text-left p-3 font-semibold">World</th>
                  <th className="text-left p-3 font-semibold">Level</th>
                  <th className="text-left p-3 font-semibold">Brainrot</th>
                  <th className="text-left p-3 font-semibold">Health</th>
                  <th className="text-left p-3 font-semibold">Damage</th>
                  <th className="text-left p-3 font-semibold">Tag</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksStorageAndInventory.items.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 font-medium">{row.world}</td>
                    <td className="p-3 text-[hsl(var(--nav-theme-light))] font-semibold">{row.level}</td>
                    <td className="p-3 text-muted-foreground">{row.brainrot}</td>
                    <td className="p-3 text-muted-foreground">{row.health}</td>
                    <td className="p-3 text-muted-foreground">{row.damage}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {row.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 5: Trading Values */}
      <section id="brainrot-evolution-trading-values" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksQualiaAndBaseBuilding.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksQualiaAndBaseBuilding']} locale={locale}>
                {t.modules.lucidBlocksQualiaAndBaseBuilding.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksQualiaAndBaseBuilding.subtitle}
            </p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.intro}
          </p>
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border mb-8">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="text-left p-3 font-semibold">Rank</th>
                  <th className="text-left p-3 font-semibold">Asset</th>
                  <th className="text-left p-3 font-semibold">Category</th>
                  <th className="text-left p-3 font-semibold">Current Value</th>
                  <th className="text-left p-3 font-semibold">Demand</th>
                  <th className="text-left p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksQualiaAndBaseBuilding.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t border-border hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-[hsl(var(--nav-theme-light))]">{item.rank}</td>
                    <td className="p-3 font-medium">{item.asset}</td>
                    <td className="p-3 text-muted-foreground">{item.category}</td>
                    <td className="p-3 text-[hsl(var(--nav-theme-light))] font-semibold">{item.current_value}</td>
                    <td className="p-3 text-muted-foreground">{item.demand}</td>
                    <td className="p-3 text-muted-foreground">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scroll-reveal md:hidden grid grid-cols-1 gap-3">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]">
                    #{item.rank}
                  </span>
                  <span className="text-sm font-semibold text-[hsl(var(--nav-theme-light))]">
                    {item.current_value}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{item.asset}</h3>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Secrets Guide */}
      <section id="brainrot-evolution-secrets-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksWorldRegions.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksWorldRegions']} locale={locale}>
                {t.modules.lucidBlocksWorldRegions.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksWorldRegions.subtitle}
            </p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksWorldRegions.intro}
          </p>
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border mb-8">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="text-left p-3 font-semibold">Secret</th>
                  <th className="text-left p-3 font-semibold">Unlock Type</th>
                  <th className="text-left p-3 font-semibold">Unlock Route</th>
                  <th className="text-left p-3 font-semibold">Health</th>
                  <th className="text-left p-3 font-semibold">Damage</th>
                  <th className="text-left p-3 font-semibold">Bonus</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksWorldRegions.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t border-border hover:bg-white/5 transition-colors">
                    <td className="p-3 font-medium">{item.secret}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {item.unlock_type}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{item.unlock_route}</td>
                    <td className="p-3 text-muted-foreground">{item.health}</td>
                    <td className="p-3 text-muted-foreground">{item.damage}</td>
                    <td className="p-3 text-[hsl(var(--nav-theme-light))] font-semibold">{item.bonus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scroll-reveal md:hidden grid grid-cols-1 gap-3">
            {t.modules.lucidBlocksWorldRegions.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-semibold">{item.secret}</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{item.unlock_route}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.unlock_type}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.health}</span>
                  <span className="text-xs text-muted-foreground">{item.damage}</span>
                  <span className="text-xs font-semibold text-[hsl(var(--nav-theme-light))]">{item.bonus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Secret Tier List */}
      <section id="brainrot-evolution-secret-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksCreaturesAndEnemies.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksCreaturesAndEnemies']} locale={locale}>
                {t.modules.lucidBlocksCreaturesAndEnemies.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-4xl mx-auto">
              {t.modules.lucidBlocksCreaturesAndEnemies.subtitle}
            </p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksCreaturesAndEnemies.intro}
          </p>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {t.modules.lucidBlocksCreaturesAndEnemies.items.map((group: any, index: number) => {
              const TierIcon =
                group.tier === 'S'
                  ? Star
                  : group.tier === 'A'
                    ? TrendingUp
                    : group.tier === 'B'
                      ? Check
                      : AlertTriangle

              return (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[hsl(var(--nav-theme)/0.16)] border border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]">
                      {group.tier}-Tier
                    </span>
                    <TierIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{group.focus}</p>
                  <div className="space-y-3">
                    {group.entries.map((entry: any, entryIndex: number) => (
                      <div key={entryIndex} className="p-3 bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.22)] rounded-lg">
                        <p className="font-semibold text-sm">{entry.name}</p>
                        <p className="text-xs text-[hsl(var(--nav-theme-light))] mt-1">{entry.highlight}</p>
                        <p className="text-xs text-muted-foreground mt-1">{entry.why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 8: Pets Guide */}
      <section id="brainrot-evolution-pets-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-4 bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)]">
              {t.modules.lucidBlocksMobilityGear.eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksMobilityGear']} locale={locale}>
                {t.modules.lucidBlocksMobilityGear.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-4xl mx-auto">
              {t.modules.lucidBlocksMobilityGear.subtitle}
            </p>
          </div>
          <p className="scroll-reveal text-muted-foreground text-sm md:text-base max-w-4xl mx-auto mb-8 text-center">
            {t.modules.lucidBlocksMobilityGear.intro}
          </p>
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border mb-8">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.12)]">
                <tr>
                  <th className="text-left p-3 font-semibold">World</th>
                  <th className="text-left p-3 font-semibold">Egg</th>
                  <th className="text-left p-3 font-semibold">Price</th>
                  <th className="text-left p-3 font-semibold">Top Pet</th>
                  <th className="text-left p-3 font-semibold">Top Rate</th>
                  <th className="text-left p-3 font-semibold">Top Damage</th>
                  <th className="text-left p-3 font-semibold">Jump vs Previous</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lucidBlocksMobilityGear.items.map((item: any, index: number) => (
                  <tr key={index} className="border-t border-border hover:bg-white/5 transition-colors">
                    <td className="p-3 font-medium">{item.world}</td>
                    <td className="p-3">{item.egg}</td>
                    <td className="p-3 text-muted-foreground">{item.price}</td>
                    <td className="p-3 text-muted-foreground">{item.top_pet}</td>
                    <td className="p-3 text-muted-foreground">{item.top_rate}</td>
                    <td className="p-3 text-[hsl(var(--nav-theme-light))] font-semibold">{item.top_damage}</td>
                    <td className="p-3 text-muted-foreground">{item.jump_vs_previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="scroll-reveal md:hidden grid grid-cols-1 gap-3 mb-8">
            {t.modules.lucidBlocksMobilityGear.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {item.egg}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{item.world}</h3>
                <p className="text-xs text-muted-foreground mb-2">{item.price} · {item.top_rate}</p>
                <p className="text-sm text-muted-foreground">
                  Top Pet: <span className="text-foreground">{item.top_pet}</span>
                </p>
                <p className="text-sm text-[hsl(var(--nav-theme-light))] font-semibold mt-1">
                  Damage: {item.top_damage} ({item.jump_vs_previous})
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: World Guide */}
      <section id="brainrot-evolution-world-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksFarmingAndGrowth']} locale={locale}>{t.modules.lucidBlocksFarmingAndGrowth.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksFarmingAndGrowth.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksFarmingAndGrowth.sections.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::sections::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksFarmingAndGrowth.growthMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Relics Guide */}
      <section id="brainrot-evolution-relics-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksBestEarlyUnlocks']} locale={locale}>{t.modules.lucidBlocksBestEarlyUnlocks.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksBestEarlyUnlocks.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksBestEarlyUnlocks.priorities.map((p: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className={`text-xs px-2 py-1 rounded-full border ${p.priority === "Essential" ? "bg-[hsl(var(--nav-theme)/0.16)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]" : p.priority === "Very High" ? "bg-[hsl(var(--nav-theme)/0.14)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}>{p.priority}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBestEarlyUnlocks::priorities::${index}`]} locale={locale}>
                    {p.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Trinkets Guide */}
      <section id="brainrot-evolution-trinkets-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksAchievementTracker']} locale={locale}>{t.modules.lucidBlocksAchievementTracker.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksAchievementTracker.intro}</p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.lucidBlocksAchievementTracker.groups.map((group: any, gi: number) => (
              <div key={gi} className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksAchievementTracker::groups::${gi}`]} locale={locale}>
                      {group.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.achievements.map((a: any, ai: number) => (
                    <div key={ai} className="p-3 bg-white/5 border border-border rounded-lg">
                      <p className="font-semibold text-sm text-[hsl(var(--nav-theme-light))]">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Items Guide */}
      <section id="brainrot-evolution-items-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSingleplayerAndPlatformFAQ']} locale={locale}>{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {faqExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Trading Guide */}
      <section id="brainrot-evolution-trading-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <TrendingUp className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSteamDeckAndController']} locale={locale}>{t.modules.lucidBlocksSteamDeckAndController.title}</LinkedTitle></h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSteamDeckAndController.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.lucidBlocksSteamDeckAndController.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setDeckExpanded(deckExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${deckExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {deckExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Update Log */}
      <section id="brainrot-evolution-update-log" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSettingsAndAccessibility']} locale={locale}>{t.modules.lucidBlocksSettingsAndAccessibility.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSettingsAndAccessibility.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksSettingsAndAccessibility.settings.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSettingsAndAccessibility::settings::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Discord and Trello */}
      <section id="brainrot-evolution-discord-trello" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksUpdatesAndPatchNotes']} locale={locale}>{t.modules.lucidBlocksUpdatesAndPatchNotes.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksUpdatesAndPatchNotes.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.lucidBlocksUpdatesAndPatchNotes.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.type}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-1">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksUpdatesAndPatchNotes::entries::${index}`]} locale={locale}>
                      {entry.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Boss Event Guide */}
      <section id="brainrot-evolution-boss-event-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCrashFixAndTroubleshooting']} locale={locale}>{t.modules.lucidBlocksCrashFixAndTroubleshooting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCrashFixAndTroubleshooting.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4 mb-8">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCrashFixAndTroubleshooting::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.35)] rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">Need live boss event alerts?</h3>
                <p className="text-sm text-muted-foreground mb-3">Follow official Brainrot Evolution channels for event windows and patch timing:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://discord.com/invite/eYeaS2R2JR" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    <MessageCircle className="w-4 h-4" /> Discord <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://www.roblox.com/communities/35325835/brainrot-evolution" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    Roblox Group <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/eYeaS2R2JR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/xFrozenStudios"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCLqP1JHpk9RRvdKTEHGcqSA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/111989938562194/Brainrot-Evolution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="text-muted-foreground">{t.footer.about}</span>
                </li>
                <li>
                  <span className="text-muted-foreground">{t.footer.privacy}</span>
                </li>
                <li>
                  <span className="text-muted-foreground">{t.footer.terms}</span>
                </li>
                <li>
                  <span className="text-muted-foreground">{t.footer.copyrightNotice}</span>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
