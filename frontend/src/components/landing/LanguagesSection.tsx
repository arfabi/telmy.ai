import React from 'react'
import { Link } from 'react-router-dom'
import { TranslationData } from '@/data/translations'
import { JAPAC_LANGUAGES } from '@/data/languages'
import { Globe2, MessageSquarePlus } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface LanguagesSectionProps {
  t: TranslationData
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ t }) => {
  const { lang, setLang } = useLanguage()

  return (
    <section id="languages" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Multilingual First</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.langSectionTitle || "In your language."}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            {t.langSectionSubtitle || "Understand official paperwork in the language you think and speak in."}
          </p>
        </div>

        {/* Static Grid of Active Languages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {JAPAC_LANGUAGES.map((l) => {
            const isActive = lang === l.code
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40'
                    : 'bg-white hover:bg-slate-50 text-slate-900 border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className="w-7 h-5 overflow-hidden rounded shadow-2xs shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-cover"
                    dangerouslySetInnerHTML={{ __html: l.svg }}
                  />
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Voice+Text
                  </span>
                </div>
                <div>
                  <div className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {l.nativeName}
                  </div>
                  <div className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {l.name}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Collapsed Coming Soon Single Line + Request Link */}
        <div className="mt-10 max-w-3xl mx-auto text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-slate-600 font-medium">
          <span>
            {t.langComingSoon || "Coming soon: Spanish, French, German, Arabic, Portuguese, and more."}
          </span>
          <span className="hidden sm:inline text-slate-300">·</span>
          <Link
            to="/features#languages"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{t.langRequest || "Request a language →"}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
