import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { CoreCards } from '@/components/landing/CoreCards'
import { Simulator } from '@/components/landing/Simulator'
import { ThreeSteps } from '@/components/landing/ThreeSteps'
import { PrivacySummary } from '@/components/landing/PrivacySummary'
import { AudienceScope } from '@/components/landing/AudienceScope'
import { LanguagesSection } from '@/components/landing/LanguagesSection'
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

      {/* Navigation */}
      <Navbar />

      {/* Section 1: Hero (Visitor question: What is this, and is it for me?) */}
      <Hero t={t} />

      {/* Section 2: The Problem (Visitor question: Why would I need it?) */}
      <ProblemSection t={t} />

      {/* Section 3: Meet Telmy - The Three Jobs (Visitor question: What does it actually do?) */}
      <CoreCards t={t} />

      {/* Section 4: See it in action - Demo & Native Simulator (Visitor question: Show me.) */}
      <Simulator t={t} />

      {/* Section 5: Three Simple Steps (Visitor question: Is it hard to start?) */}
      <ThreeSteps t={t} />

      {/* Section 6: Safety - Your documents stay yours (Visitor question: Is my data safe?) */}
      <PrivacySummary t={t} />

      {/* Section 7: Who it's for & Boundaries (Visitor question: Does it fit my situation?) */}
      <AudienceScope t={t} />

      {/* Section 8: In your language - Static Language Grid (Visitor question: Is my language supported?) */}
      <LanguagesSection t={t} />

      {/* Section 9: Pricing Teaser & Reordered FAQ (Visitor question: What does it cost? & What if I have doubts?) */}
      <PricingTeaser t={t} />
      <FAQ t={t} />

      {/* Section 10: Final CTA (Visitor question: OK, how do I start?) */}
      <FinalCta t={t} />

      {/* Footer & Non-Government Disclaimer */}
      <Footer t={t} />
    </div>
  )
}
