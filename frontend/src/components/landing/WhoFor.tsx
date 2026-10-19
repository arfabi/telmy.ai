import React from 'react'
import { Card } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import { GraduationCap, Plane, FileText, CheckCircle2 } from 'lucide-react'

interface WhoForProps {
  t: TranslationData
}

export const WhoFor: React.FC<WhoForProps> = ({ t }) => {
  const cards = [
    {
      title: t.whoForCard1Title,
      desc: t.whoForCard1Desc,
      icon: GraduationCap,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Scholarships & Grants',
      tag: 'Education',
      examples: ['MEXT', 'LPDP', 'DAAD', 'Chevening', 'University Admissions'],
    },
    {
      title: t.whoForCard2Title,
      desc: t.whoForCard2Desc,
      icon: Plane,
      color: 'from-indigo-600 to-violet-600',
      badge: 'Visa & Travel Forms',
      tag: 'Global Mobility',
      examples: ['Visa Application', 'Stay Permit Renewal', 'Apostille Legalization', 'Passport Extension'],
    },
    {
      title: t.whoForCard3Title,
      desc: t.whoForCard3Desc,
      icon: FileText,
      color: 'from-sky-600 to-blue-600',
      badge: 'Official Online Forms',
      tag: 'Public Services & Web',
      examples: ['Google Forms', 'Jotform', 'Typeform', 'Civil Registration', 'Tax & Banking Portals'],
    },
  ]

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/70 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-4 border border-blue-200/50">
            <span>Use Cases</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.whoForTitle}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {t.whoForSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <Card
                key={idx}
                hoverGlow
                className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-white shadow-xs hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 rounded-2xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {card.desc}
                  </p>

                  {/* Concrete form tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {card.examples.map((ex, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{card.badge}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Closing Tagline Callout */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-500 italic">
            "{t.whoForClosing}"
          </p>
        </div>
      </div>
    </section>
  )
}
