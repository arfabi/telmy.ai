import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import { useLanguage } from '@/context/LanguageContext'
import {
  BookOpenCheck,
  Zap,
  ShieldAlert,
  CheckCircle2,
  Maximize2,
  X,
  Volume2,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'

import { CORE_CARDS_I18N } from '@/data/coreCardsData'

interface CoreCardsProps {
  t: TranslationData
}

type PillarKey = 'understand' | 'complete' | 'check'

interface PillarModalData {
  title: string
  subtitle: string
  badge: string
  color: string
  badgeColor: string
  icon: React.ElementType
  gifSrc: string
  steps: { title: string; desc: string }[]
  securityNote: string
}

export const CoreCards: React.FC<CoreCardsProps> = ({ t }) => {
  const { lang } = useLanguage()
  const [activeModal, setActiveModal] = useState<PillarKey | null>(null)

  const cur = CORE_CARDS_I18N[lang] || CORE_CARDS_I18N.en

  const PILLAR_DETAILS: Record<PillarKey, PillarModalData> = {
    understand: {
      title: cur.p1ModalTitle,
      subtitle: cur.p1ModalSub,
      badge: cur.p1ModalBadge,
      color: 'from-blue-600 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: BookOpenCheck,
      gifSrc: '/assets/demo-understand.gif',
      steps: cur.p1Steps,
      securityNote: cur.p1Security,
    },
    complete: {
      title: cur.p2ModalTitle,
      subtitle: cur.p2ModalSub,
      badge: cur.p2ModalBadge,
      color: 'from-indigo-600 to-violet-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Zap,
      gifSrc: '/assets/demo-autofill.gif',
      steps: cur.p2Steps,
      securityNote: cur.p2Security,
    },
    check: {
      title: cur.p3ModalTitle,
      subtitle: cur.p3ModalSub,
      badge: cur.p3ModalBadge,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: ShieldAlert,
      gifSrc: '/assets/demo-accessibility.gif',
      steps: cur.p3Steps,
      securityNote: cur.p3Security,
    },
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null)
    }
    if (activeModal) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeModal])

  const modalData = activeModal ? PILLAR_DETAILS[activeModal] : null

  return (
    <section className="py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <span>{cur.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {cur.mainTitle}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {cur.mainSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Understand */}
          <Card
            onClick={() => setActiveModal('understand')}
            className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl group cursor-pointer relative"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <BookOpenCheck className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{cur.clickExpand}</span>
                </span>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                {cur.p1Badge}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {cur.p1Title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {cur.p1Desc}
              </p>

              {/* Teaser GIF Preview */}
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 relative group/img">
                <img
                  src="/assets/demo-understand.gif"
                  alt="Telmy explains field in native language"
                  className="w-full h-44 object-cover object-top group-hover/img:scale-105 transition-transform duration-500 opacity-90 group-hover/img:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" /> {cur.clickFullDemo}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {cur.p1Footer}
              </span>
              <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </Card>

          {/* Pillar 2: Complete */}
          <Card
            onClick={() => setActiveModal('complete')}
            className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl group cursor-pointer relative"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Zap className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{cur.clickExpand}</span>
                </span>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                {cur.p2Badge}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cur.p2Title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {cur.p2Desc}
              </p>

              {/* Teaser GIF Preview */}
              <div className="mt-5 rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 relative group/img">
                <img
                  src="/assets/demo-autofill.gif"
                  alt="Vault and 1-Click AutoFill"
                  className="w-full h-44 object-cover object-top group-hover/img:scale-105 transition-transform duration-500 opacity-90 group-hover/img:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> {cur.clickFullDemo}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {cur.p2Footer}
              </span>
              <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </Card>

          {/* Pillar 3: Check */}
          <Card
            onClick={() => setActiveModal('check')}
            className="p-8 h-full flex flex-col justify-between border-slate-200/90 bg-gradient-to-b from-white to-slate-50/60 shadow-xs hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl group cursor-pointer relative"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold opacity-90 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>{cur.clickExpand}</span>
                </span>
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                {cur.p3Badge}
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                {cur.p3Title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {cur.p3Desc}
              </p>

              {/* Traffic Light Mockup Pill */}
              <div className="mt-5 p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-50" />
                  <span className="font-semibold">{cur.tl1}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 ring-4 ring-amber-50" />
                  <span className="font-semibold">{cur.tl2}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 ring-4 ring-rose-50" />
                  <span className="font-semibold">{cur.tl3}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {cur.p3Footer}
              </span>
              <span className="text-emerald-600 font-bold group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </Card>
        </div>

        {/* Explore All Features Link Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-bold tracking-tight">
              {cur.bannerTitle}
            </h4>
            <p className="mt-1 text-sm text-slate-400">
              {cur.bannerDesc}
            </p>
          </div>
          <a
            href="/features"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-102 shrink-0 group"
          >
            <span>{cur.bannerBtn}</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </a>
        </div>
      </div>

      {/* Expanded Lightbox Modal Dialog */}
      {modalData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 text-slate-900 p-6 sm:p-8 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border ${modalData.badgeColor}`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{modalData.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {modalData.title}
                </h3>
                <p className="mt-1 text-sm sm:text-base text-slate-600">
                  {modalData.subtitle}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Full Width GIF on top + Steps & Details Below */}
            <div className="flex flex-col gap-8">
              {/* Big High-Res GIF Display (Full Width) */}
              <div className="w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-xl p-1">
                <img
                  src={modalData.gifSrc}
                  alt={modalData.title}
                  className="w-full h-auto rounded-xl object-contain"
                />
                <div className="p-3 text-center bg-slate-900 text-slate-300 text-xs sm:text-sm flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{cur.modalRecording}</span>
                </div>
              </div>

              {/* Bottom Steps Breakdown (How it works in your browser) */}
              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                    {cur.modalHowTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {modalData.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-200 transition-colors flex flex-col justify-start"
                      >
                        <h5 className="font-bold text-slate-900 text-sm mb-1.5">
                          {st.title}
                        </h5>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Privacy Guarantee Note + CTA Button */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-3 flex-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">{cur.modalPrivTitle}</span>
                      <span className="text-emerald-800 leading-relaxed">{modalData.securityNote}</span>
                    </div>
                  </div>

                  <div className="shrink-0 w-full md:w-auto">
                    <a href="/download" className="block w-full">
                      <button className="w-full md:w-auto py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <span>{cur.modalCta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
