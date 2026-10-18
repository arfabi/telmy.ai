import React, { useState } from 'react'
import { TranslationData } from '@/data/translations'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQProps {
  t?: TranslationData
}

export const FAQ: React.FC<FAQProps> = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const faqs = [
    {
      q: "What is Telmy.ai?",
      a: "Telmy.ai is an intelligent browser extension and companion that explains complex official form questions in plain language, fills answers from your uploaded documents, and performs pre-submission error checking."
    },
    {
      q: "Which browsers does it work on?",
      a: "Telmy works natively on Google Chrome, Microsoft Edge, Opera, and Mozilla Firefox (Manifest V3 Side Panel & Gecko Sidebar). Safari support is planned on our future roadmap."
    },
    {
      q: "Which websites does it work on?",
      a: "Telmy works on virtually all web forms, including complex single-page apps, iframes, multi-step public portals, visa applications, and scholarship forms. You can test it immediately on our live Simulator."
    },
    {
      q: "Does it work on PDF forms?",
      a: "Yes! Telmy supports local PDF forms via our 'Upload & Analyze Document' tool. It converts PDF form fields into an interactive sidebar workspace."
    },
    {
      q: "Can Telmy be wrong?",
      a: "Yes. While backed by high-precision Gemini reasoning, AI can occasionally make mistakes or misinterpret ambiguous regional phrasing. You should always review every autofilled answer and follow the official instructions before submitting."
    },
    {
      q: "Is Telmy a government agency or website?",
      a: "No. Telmy.ai is an independent digital accessibility tool and is not affiliated with any government agency. You always make the final decision and submit on the official portal yourself."
    },
    {
      q: "Can the Telmy team see my ID or passport?",
      a: "No. Uploaded ID cards and passport photos are read in temporary client memory and immediately discarded (zero retention). Your saved vault profile is encrypted client-side on your device using AES-256-GCM before storage."
    },
    {
      q: "Is my data sent to Google?",
      a: "To explain a form, Telmy sends the field labels, descriptions, and contextual screenshot (when requested) to Google Gemini for reasoning. All personal identification details (PII) are masked before transmission."
    },
    {
      q: "Does Telmy submit forms for me?",
      a: "Never. Telmy guides, translates, and autofills your fields, but human-in-the-loop control is preserved at all times. You review, confirm, and hit the official submit button yourself."
    },
    {
      q: "How much does it cost?",
      a: "Telmy is free to start with 5 full form consultations every month. All 14 accessibility hub tools are completely free on every plan with no credit card required."
    }
  ]

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Got Questions? We’ve Got Clear Answers.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to know about how Telmy protects your privacy and guides your paperwork.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
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
