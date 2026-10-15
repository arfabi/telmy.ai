import React from 'react'
import { TranslationData } from '@/data/translations'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'

interface PricingTeaserProps {
  t: TranslationData
}

export const PricingTeaser: React.FC<PricingTeaserProps> = ({ t }) => {
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fair & Transparent</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.pricingTeaserTitle}
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          {t.pricingTeaserDesc}
        </p>
        <div className="mt-8 flex justify-center">
          <a href="/pricing">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md shadow-blue-500/20">
              <span>{t.pricingTeaserBtn}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
