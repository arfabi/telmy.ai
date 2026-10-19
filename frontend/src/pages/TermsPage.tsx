import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { FileText, AlertCircle } from 'lucide-react'
import { SEO } from '@/components/common/SEO'
import { TERMS_TRANSLATIONS } from '@/data/termsData'

export const TermsPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const data = TERMS_TRANSLATIONS[currentLang] || TERMS_TRANSLATIONS.en

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>{data.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {data.title}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {data.effectiveDate}
            </p>
          </div>

          {/* Important Scope Notice */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 mb-10 text-slate-800 text-sm leading-relaxed flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-base mb-1">
                {data.corePrincipleTitle}
              </h3>
              <p className="text-xs sm:text-sm text-amber-800">
                {data.corePrincipleDesc}
              </p>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-8">
            {data.sections.map((section, idx) => (
              <section key={idx}>
                <h2 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h2>
                {Array.isArray(section.body) ? (
                  <div className="space-y-2 text-sm sm:text-base">
                    {section.body.map((paragraph, pIdx) => (
                      <p key={pIdx} className={paragraph.startsWith('•') ? 'pl-4 text-slate-600' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>{section.body}</p>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
