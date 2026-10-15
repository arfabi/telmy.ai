import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { TranslationData } from '@/data/translations'
import { MessageSquareText, Globe, Accessibility, ArrowRight } from 'lucide-react'

interface CoreCardsProps {
  t: TranslationData
}

export const CoreCards: React.FC<CoreCardsProps> = ({ t }) => {
  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: Guide Every Field */}
          <Link to="/features#assistant" className="group block">
            <Card hoverGlow className="p-7 h-full flex flex-col justify-between border-slate-200/90 bg-slate-50/50 group-hover:bg-blue-50/30 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {t.cardATitle}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {t.cardADesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span>{t.cardALink}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card B: 11 Languages */}
          <Link to="/features#languages" className="group block">
            <Card hoverGlow className="p-7 h-full flex flex-col justify-between border-slate-200/90 bg-slate-50/50 group-hover:bg-blue-50/30 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {t.cardBTitle}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {t.cardBDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                <span>{t.cardBLink}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>

          {/* Card C: Accessibility Built In */}
          <Link to="/features#a11y" className="group block">
            <Card hoverGlow className="p-7 h-full flex flex-col justify-between border-slate-200/90 bg-slate-50/50 group-hover:bg-blue-50/30 transition-all">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-5 shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <Accessibility className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {t.cardCTitle}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {t.cardCDesc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-purple-600">
                <span>{t.cardCLink}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}
