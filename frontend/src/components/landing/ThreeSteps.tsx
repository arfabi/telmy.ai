import React from 'react'
import { TranslationData } from '@/data/translations'
import { DownloadCloud, Layout, CheckCircle2, ArrowRight } from 'lucide-react'

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
      color: 'from-blue-600 to-indigo-600',
      badge: 'Step 1: Install & Launch',
      preview: 'Open browser extension next to form',
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Layout,
      color: 'from-indigo-600 to-violet-600',
      badge: 'Step 2: Understand',
      preview: 'Click any confusing field for simple words',
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Step 3: Review & Submit',
      preview: 'Self-review answers before submission',
    },
  ]

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3 border border-blue-200/50">
            <span>Simple Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.stepsTitle}
          </h2>
          <p className="mt-3 text-slate-600 text-base max-w-xl mx-auto">
            From opening a complicated official form to submitting with complete peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 relative flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <span className="text-4xl font-black text-slate-200 group-hover:text-blue-100 transition-colors select-none font-mono">
                      {step.num}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wider">
                    {step.badge}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {step.desc}
                  </p>
                </div>

                {/* Mini Preview Box */}
                <div className="pt-4 border-t border-slate-100 bg-slate-50/70 -mx-8 -mb-8 p-4 px-8 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
                  <span className="truncate">{step.preview}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all shrink-0 ml-2" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
