import React from 'react'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { useLanguage } from '@/context/LanguageContext'
import { Shield, CheckCircle2 } from 'lucide-react'
import { SEO } from '@/components/common/SEO'
import { PRIVACY_TRANSLATIONS } from '@/data/privacyData'

export const PrivacyPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const data = PRIVACY_TRANSLATIONS[currentLang] || PRIVACY_TRANSLATIONS.en

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 pb-8 border-b border-slate-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <Shield className="w-3.5 h-3.5" />
              <span>{data.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {data.title}
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              {data.lastUpdated}
            </p>
          </div>

          {/* Quick Summary Box */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 mb-10 text-slate-800 text-sm leading-relaxed">
            <h3 className="font-bold text-blue-900 text-base mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              {data.summaryTitle}
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-slate-700">
              {data.summaryPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
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
