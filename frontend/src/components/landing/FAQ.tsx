import React, { useState } from 'react'
import { TranslationData } from '@/data/translations'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQProps {
  t: TranslationData
}

export const FAQ: React.FC<FAQProps> = ({ t }) => {
  // First two questions open by default per brief
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1])

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  const faqs = [
    {
      q: t.faq1Q || "Is Telmy a government website?",
      a: t.faq1A || "No. Telmy.ai is an independent AI assistant and is not affiliated with any government agency or embassy. Telmy explains and guides; you verify, decide, and submit.",
    },
    {
      q: t.faq2Q || "Can Telmy see my passport or ID?",
      a: t.faq2A || "No. Your passport, ID, and form responses stay on your local device. We do not store your documents on our servers.",
    },
    {
      q: t.faq3Q || "Which browsers and forms does it work on?",
      a: t.faq3A || "Telmy works on Chrome, Edge, Firefox, and Opera on desktop computers. It supports online forms across scholarships, visas, civil registration, and public service portals.",
    },
    {
      q: t.faq4Q || "Does it work on PDF forms?",
      a: t.faq4A || "Yes. Open any visa or official PDF form in Chrome, and Telmy detects fields, answers questions, and helps you prepare your answers.",
    },
    {
      q: t.faq5Q || "How much does it cost?",
      a: t.faq5A || "Telmy is free for up to 5 forms every month, including all core features. If you need more forms, upgraded plans will be available.",
    },
    {
      q: "What is Telmy?",
      a: "Telmy is a browser assistant that sits beside the form you are filling in. It explains difficult questions with real examples in your language, autofills saved details, and flags mistakes before you submit.",
    },
  ]

  return (
    <section id="faq" className="py-20 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.faqTitle || "Questions, answered"}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t.faqSubtitle || "Honest, transparent answers so you can submit official paperwork with peace of mind."}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx)
            return (
              <div
                key={idx}
                className="bg-slate-50/70 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
