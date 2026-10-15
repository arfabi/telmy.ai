import React from 'react'
import { TranslationData } from '@/data/translations'
import { Lock, EyeOff, FileText, KeyRound } from 'lucide-react'

interface PrivacySummaryProps {
  t: TranslationData
}

export const PrivacySummary: React.FC<PrivacySummaryProps> = ({ t }) => {
  const cards = [
    {
      icon: Lock,
      title: t.priv1Title,
      desc: t.priv1Desc,
    },
    {
      icon: EyeOff,
      title: t.priv2Title,
      desc: t.priv2Desc,
    },
    {
      icon: FileText,
      title: t.priv3Title,
      desc: t.priv3Desc,
    },
    {
      icon: KeyRound,
      title: t.priv4Title,
      desc: t.priv4Desc,
    },
  ]

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.privacyTitle}
          </h2>
          <p className="mt-3 text-lg text-slate-400">
            {t.privacySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-blue-500/50 hover:bg-slate-800 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
