import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { CoreCards } from '@/components/landing/CoreCards'
import { RealityCheck } from '@/components/landing/RealityCheck'
import { Simulator } from '@/components/landing/Simulator'
import { Comparison } from '@/components/landing/Comparison'
import { ThreeSteps } from '@/components/landing/ThreeSteps'
import { PrivacySummary } from '@/components/landing/PrivacySummary'
import { PricingTeaser } from '@/components/landing/PricingTeaser'
import { FAQ } from '@/components/landing/FAQ'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'

export const LandingPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero: "Any form. Any language. No worries." + 2 CTA + Robot + Browser badges + Trustline */}
      <Hero t={t} />

      {/* 3. Core Cards: Card A (Guide), Card B (11 Languages), Card C (Accessibility) */}
      <CoreCards t={t} />

      {/* 4. Reality Check: UN E-Gov Survey 2024 (99.5%, 52%, 57%, 95%) */}
      <RealityCheck t={t} />

      {/* 5. Interactive Simulator Sandbox */}
      <Simulator t={t} />

      {/* 6. Comparison: Without Telmy vs With Telmy */}
      <Comparison t={t} />

      {/* 7. Three Steps: Add Telmy -> Open form -> Follow guide */}
      <ThreeSteps t={t} />

      {/* 8. Privacy Summary: AES-256, Zero-Knowledge, No doc storage, Passwords private */}
      <PrivacySummary t={t} />

      {/* 9. Pricing Teaser: Start free, 5 forms monthly */}
      <PricingTeaser t={t} />

      {/* 10. Top FAQ Accordion */}
      <FAQ t={t} />

      {/* 11. Final CTA: Your next form can be easier */}
      <FinalCta t={t} />

      {/* 12. Dynamic Localized Footer */}
      <Footer t={t} />
    </div>
  )
}
