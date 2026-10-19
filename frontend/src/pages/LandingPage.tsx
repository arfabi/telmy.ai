import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { CoreCards } from '@/components/landing/CoreCards'
import { LanguageMarquee } from '@/components/landing/LanguageMarquee'
import { WhoFor } from '@/components/landing/WhoFor'
import { RealityCheck } from '@/components/landing/RealityCheck'
import { Simulator } from '@/components/landing/Simulator'
import { RealActionShowcase } from '@/components/landing/RealActionShowcase'
import { Comparison } from '@/components/landing/Comparison'
import { ThreeSteps } from '@/components/landing/ThreeSteps'
import { ScopeBoundary } from '@/components/landing/ScopeBoundary'
import { PrivacySummary } from '@/components/landing/PrivacySummary'
import { PricingTeaser } from '@/components/landing/PricingTeaser'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { SEO } from '@/components/common/SEO'

export const LandingPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Multilingual SEO & OpenGraph */}
      <SEO />

      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero: Headline + Subheadline + Dual CTA + Interactive Product Demo Preview */}
      <Hero t={t} />

      {/* 3. Core Cards: Understand Every Field, Forms in Your Language, Guidance When Forms Get Complicated */}
      <CoreCards t={t} />

      {/* 4. Global Language Marquee Ticker: 11 Active + European/Middle East SOON */}
      <LanguageMarquee />

      {/* 5. Who Is Telmy For: Scholarship, Visa/Travel, Everyday Forms (New v19) */}
      <WhoFor t={t} />

      {/* 6. Reality Check: UN E-Gov Survey */}
      <RealityCheck t={t} />

      {/* 7. Interactive Simulator Sandbox (Visa Application Sandbox) */}
      <Simulator t={t} />

      {/* 8. Real Browser Action Showcase: Official Government Portals & Web Forms */}
      <RealActionShowcase />

      {/* 9. Comparison: Without Telmy vs With Telmy */}
      <Comparison t={t} />

      {/* 8. Three Steps: Open Form -> Understand -> Fill & Review */}
      <ThreeSteps t={t} />

      {/* 9. Scope & Boundaries: What Telmy Helps With vs What It Doesn't Replace (New v19) */}
      <ScopeBoundary t={t} />

      {/* 10. Privacy Summary: AES-256, Zero-Knowledge, No doc storage */}
      <PrivacySummary t={t} />

      {/* 11. Pricing Teaser: Free 5 forms monthly */}
      <PricingTeaser t={t} />

      {/* 12. Top FAQ Accordion */}
      <FAQ t={t} />

      {/* 13. Final CTA: Your next form can be easier */}
      <FinalCta t={t} />

      {/* 14. Dynamic Localized Footer */}
      <Footer t={t} />
    </div>
  )
}
