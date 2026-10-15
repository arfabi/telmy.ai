import React from 'react'
import { TranslationData } from '@/data/translations'
import { Button } from '@/components/ui/Button'
import { DownloadCloud, Play } from 'lucide-react'

interface FinalCtaProps {
  t: TranslationData
}

export const FinalCta: React.FC<FinalCtaProps> = ({ t }) => {
  return (
    <section className="py-20 bg-blue-600 text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 opacity-90" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {t.finalCtaTitle}
        </h2>
        <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
          {t.finalCtaDesc}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/download"
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-700 hover:bg-slate-100 shadow-xl font-bold px-8 h-12"
            >
              <DownloadCloud className="w-5 h-5 text-blue-600 mr-2" />
              <span>{t.finalCtaBtn}</span>
            </Button>
          </a>
          <a
            href="#simulator"
            className="w-full sm:w-auto"
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-white border-white/50 hover:bg-white/10 font-bold px-8 h-12"
            >
              <Play className="w-4 h-4 mr-2" />
              <span>{t.finalDemoBtn}</span>
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
