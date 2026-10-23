import React from 'react'
import { TranslationData } from '@/data/translations'
import { HelpCircle, Globe2, Clock, AlertTriangle } from 'lucide-react'

interface ProblemSectionProps {
  t: TranslationData
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ t }) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-4">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>You know this feeling</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2357] tracking-tight leading-tight">
            {t.problemTitle || "One wrong answer can mean a rejected application."}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.problemSubtitle || "Filling out official paperwork shouldn't feel like a high-stakes guessing game."}
          </p>
        </div>

        {/* 3 Relatable Moment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center mb-5 font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.problemCard1Title || "The question makes no sense"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.problemCard1Desc || "'Place of issuance'? 'Apostille'? You're not sure what they actually want."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
              Ambiguous bureaucracy
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-blue-100/80 text-blue-700 flex items-center justify-center mb-5 font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.problemCard2Title || "It isn't in your language"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.problemCard2Desc || "You copy it into a translator, and the translation still doesn't make sense."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
              Language barrier
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center mb-5 font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.problemCard3Title || "No one to ask, and the deadline is tomorrow"}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t.problemCard3Desc || "You're stuck late at night, terrified of a rejection or a missed deadline."}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
              High emotional anxiety
            </div>
          </div>
        </div>

        {/* Bridge Line with UN Stat */}
        <div className="mt-12 text-center">
          <div className="inline-block px-5 py-3 rounded-xl bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium border border-slate-200/80 max-w-2xl">
            <span>
              {t.problemStatBridge || "Most government portals aren't built for this: in the UN's 2024 survey, 57% offered only one language."}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
