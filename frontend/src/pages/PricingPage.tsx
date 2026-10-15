import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PRICING_TIERS_DATA } from '@/data/pricingData'
import { Check, Sparkles, Shield, Zap } from 'lucide-react'

export const PricingPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const [currency, setCurrency] = useState<'usd' | 'idr'>('idr')
  const langKey = currentLang in PRICING_TIERS_DATA[0].name ? currentLang : 'en'

  const pageHeadings: Record<string, { title: string; subtitle: string; popularBadge: string; formUnit: string }> = {
    en: {
      title: "Simple, Honest Plans for Every Form",
      subtitle: "Synchronized with Telmy cloud quotas. Start free with 5 forms every month. Upgrade only when you need more capacity.",
      popularBadge: "Best Value",
      formUnit: "per form",
    },
    id: {
      title: "Pilihan Paket Sederhana & Terbuka untuk Setiap Formulir",
      subtitle: "Tersinkronisasi dengan kuota cloud Telmy. Mulai gratis dengan 5 formulir setiap bulan. Tingkatkan hanya saat butuh kuota lebih.",
      popularBadge: "Paling Populer",
      formUnit: "per form",
    },
    ja: {
      title: "すべてのフォームのための、シンプルで安心な料金プラン",
      subtitle: "Telmy クラウドクォータと完全同期。毎月5件まで永久無料。必要なときだけアップグレードできます。",
      popularBadge: "一番人気",
      formUnit: "1件あたり",
    },
    ko: {
      title: "모든 양식 작성을 위한 정직하고 심플한 요금제",
      subtitle: "Telmy 클라우드 정량제 동기화. 매월 5개 양식까지 완전 무료. 더 많은 지원이 필요할 때만 업그레이드하세요.",
      popularBadge: "최고 인기",
      formUnit: "건당",
    },
    zh: {
      title: "为各类表单申报量身定制的诚实质朴方案",
      subtitle: "与 Telmy 云端额度实时同步。每月免费畅享 5 份表单。仅在需要更多用量时再升级。",
      popularBadge: "最受欢迎",
      formUnit: "每份表单",
    },
    'zh-TW': {
      title: "為各類表單申報量身打造的誠實質樸方案",
      subtitle: "與 Telmy 雲端額度即時同步。每月免費暢享 5 份表單。僅在需要更多用量時再升級。",
      popularBadge: "最受歡迎",
      formUnit: "每份表單",
    },
    vi: {
      title: "Gói Dịch Vụ Đơn Giản, Minh Bạch Cho Mọi Biểu Mẫu",
      subtitle: "Đồng bộ với hạn mức cloud Telmy. Bắt đầu miễn phí 5 biểu mẫu mỗi tháng.",
      popularBadge: "Phổ biến nhất",
      formUnit: "mỗi biểu mẫu",
    },
    th: {
      title: "แผนราคาที่เรียบง่ายและโปร่งใสสำหรับทุกแบบฟอร์ม",
      subtitle: "เชื่อมโยงกับโควตาคลาวด์ของ Telmy เริ่มต้นฟรี 5 แบบฟอร์มต่อเดือน",
      popularBadge: "ยอดนิยมที่สุด",
      formUnit: "ต่อฟอร์ม",
    },
    hi: {
      title: "हर फॉर्म के लिए सरल और ईमानदार योजनाएं",
      subtitle: "क्लाउड कोटा के साथ समन्वयित। हर महीने 5 फॉर्म मुफ्त।",
      popularBadge: "सबसे लोकप्रिय",
      formUnit: "प्रति फॉर्म",
    },
    fil: {
      title: "Simple at Tapat na Plano Para sa Bawat Form",
      subtitle: "Naka-sync sa cloud quota ng Telmy. Libreng 5 forms bawat buwan.",
      popularBadge: "Pinakasikat",
      formUnit: "bawat form",
    },
    ms: {
      title: "Pelan Mudah dan Telus untuk Setiap Borang",
      subtitle: "Diselaraskan dengan kuota awan Telmy. Mula percuma dengan 5 borang setiap bulan.",
      popularBadge: "Paling Popular",
      formUnit: "setiap borang",
    },
  }

  const h = pageHeadings[langKey] || pageHeadings.en

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Official Backend Sync</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {h.title}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {h.subtitle}
          </p>

          {/* Currency Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-slate-100 border border-slate-200">
            <button
              onClick={() => setCurrency('idr')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currency === 'idr' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rupiah Indonesia (IDR)
            </button>
            <button
              onClick={() => setCurrency('usd')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                currency === 'usd' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              US Dollar (USD)
            </button>
          </div>
        </div>
      </section>

      {/* 3 Tier Grid: Free, Standard, Pro */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS_DATA.map((tier) => {
            const name = tier.name[langKey] || tier.name.en
            const quota = tier.formsQuota[langKey] || tier.formsQuota.en
            const period = tier.period[langKey] || tier.period.en
            const desc = tier.description[langKey] || tier.description.en
            const rate = tier.rateText[langKey] || tier.rateText.en
            const feats = tier.features[langKey] || tier.features.en
            const cta = tier.ctaBtn[langKey] || tier.ctaBtn.en

            const displayPrice = currency === 'usd' ? tier.displayPriceUsd : tier.displayPriceIdr

            return (
              <Card
                key={tier.id}
                className={`p-7 rounded-3xl flex flex-col justify-between transition-all relative overflow-hidden ${
                  tier.isPopular
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-white border border-slate-200 shadow-xs'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                    {h.popularBadge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">
                      {name}
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        tier.isPopular
                          ? 'bg-blue-50 text-blue-700 font-extrabold'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {quota}
                    </span>
                  </div>

                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {displayPrice}
                    </span>
                    <span className="text-slate-500 text-xs sm:text-sm font-medium">
                      / {period}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-blue-600 mb-5">
                    {rate}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    {desc}
                  </p>

                  <div className="border-t border-slate-100 pt-6">
                    <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                      {feats.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 leading-snug">
                          <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <a href="/download">
                    <Button
                      className={`w-full font-bold h-12 rounded-xl text-sm ${
                        tier.isPopular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <span>{cta}</span>
                    </Button>
                  </a>
                </div>
              </Card>
            )
          })}
        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
