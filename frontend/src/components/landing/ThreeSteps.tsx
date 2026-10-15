import React from 'react'
import { TranslationData } from '@/data/translations'
import { DownloadCloud, Layout, CheckCircle2 } from 'lucide-react'

interface ThreeStepsProps {
  t: TranslationData
}

export const ThreeSteps: React.FC<ThreeStepsProps> = ({ t }) => {
  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: DownloadCloud,
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Layout,
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.stepsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 select-none">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.desc}
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
