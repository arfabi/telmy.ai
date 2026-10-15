import React, { useState } from 'react'
import { TranslationData } from '@/data/translations'
import { ChevronDown } from 'lucide-react'

interface FAQProps {
  t: TranslationData
}

export const FAQ: React.FC<FAQProps> = ({ t }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A }
  ]

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.faqSubtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openIdx === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
