import React from 'react'
import { Link } from 'react-router-dom'
import { TranslationData } from '@/data/translations'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface PricingTeaserProps {
  t: TranslationData
}

export const PricingTeaser: React.FC<PricingTeaserProps> = ({ t }) => {
  const { lang } = useLanguage()

  return (
    <section className="py-20 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'id' ? 'Harga Ramah & Transparan' : 'Simple, Honest Pricing'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
          {t.pricingTeaserTitle || "Simple, honest pricing. Free to start."}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.pricingTeaserDesc || "5 forms every month at no cost, with all core features included. No credit card required."}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all group"
          >
            <span>{t.pricingTeaserBtn}</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
