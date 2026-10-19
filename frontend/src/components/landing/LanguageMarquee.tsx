import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { JAPAC_LANGUAGES, UPCOMING_LANGUAGES } from '@/data/languages'
import { useLanguage } from '@/context/LanguageContext'
import { Sparkles, ArrowRight, Pause, Play, Volume2 } from 'lucide-react'
import { LANGUAGE_MARQUEE_I18N } from '@/data/languageMarqueeData'

export const LanguageMarquee: React.FC = () => {
  const { lang } = useLanguage()
  const [isPaused, setIsPaused] = useState(false)

  const cur = LANGUAGE_MARQUEE_I18N[lang] || LANGUAGE_MARQUEE_I18N.en

  return (
    <section className="py-16 bg-white border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{cur.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {cur.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              {cur.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? cur.play : cur.pause}</span>
            </button>
            <Link
              to="/features#languages"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              <span>{cur.explore}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Marquee Row 1: Active 11 Languages (Voice + Text) */}
      <div className="relative w-full overflow-hidden mb-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex gap-3 w-max ${
            isPaused ? '' : 'animate-marquee hover:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '75s' }}
        >
          {/* Double list for smooth infinite looping */}
          {[...JAPAC_LANGUAGES, ...JAPAC_LANGUAGES].map((l, idx) => (
            <div
              key={`${l.code}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:border-blue-400 hover:bg-blue-50/50 transition-all shrink-0 group"
            >
              <div
                className="w-5 h-3.5 overflow-hidden rounded-xs shrink-0"
                dangerouslySetInnerHTML={{ __html: l.svg }}
              />
              <span className="text-sm font-bold text-slate-800">{l.nativeName}</span>
              <span className="text-xs text-slate-500 font-medium">({l.name})</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <Volume2 className="w-3 h-3 text-emerald-600" />
                Voice + Text
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2: Upcoming Languages with SOON badge (Reverse direction) */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex gap-3 w-max ${
            isPaused ? '' : 'animate-marquee-reverse hover:[animation-play-state:paused]'
          }`}
          style={{ animationDuration: '85s' }}
        >
          {[...UPCOMING_LANGUAGES, ...UPCOMING_LANGUAGES, ...UPCOMING_LANGUAGES].map((l, idx) => (
            <div
              key={`${l.code}-${idx}`}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-dashed border-slate-300 shadow-2xs hover:border-amber-400 transition-all shrink-0 group"
            >
              <span className="text-lg leading-none shrink-0">{l.flag}</span>
              <span className="text-sm font-semibold text-slate-700">{l.nativeName}</span>
              <span className="text-xs text-slate-400 font-medium">({l.name})</span>
              <span className="inline-flex items-center text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xs uppercase">
                SOON
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap Note below marquee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>{cur.note}</span>
        <Link to="/features" className="text-blue-600 font-bold hover:underline shrink-0">
          {cur.cta}
        </Link>
      </div>
    </section>
  )
}
