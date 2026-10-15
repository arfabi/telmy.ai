import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Card } from '@/components/ui/Card'
import { FAQ_LIST_DATA, FaqItem } from '@/data/faqData'
import { ChevronDown, HelpCircle, Search, Sparkles, MessageSquare } from 'lucide-react'

export const FaqPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const langKey = currentLang in FAQ_LIST_DATA[0].q ? currentLang : 'en'

  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState<'all' | 'general' | 'tech' | 'privacy' | 'pricing'>('all')

  const titles: Record<string, { badge: string; title: string; subtitle: string; searchPlh: string; catAll: string; catGen: string; catTech: string; catPriv: string; catPrice: string; contactUs: string }> = {
    en: {
      badge: "Questions, Answered",
      title: "Frequently Asked Questions",
      subtitle: "Got questions about Telmy? Everything you need to know about privacy, supported browsers, pricing quotas, and features.",
      searchPlh: "Search questions (e.g., privacy, PDF, browser, free)...",
      catAll: "All Questions",
      catGen: "General",
      catTech: "Browsers & PDF",
      catPriv: "Privacy & Vault",
      catPrice: "Pricing & Quotas",
      contactUs: "Still have questions? Reach out to support at support@telmy.ai",
    },
    id: {
      badge: "Pertanyaan Terjawab",
      title: "Pertanyaan yang Sering Diajukan",
      subtitle: "Punya pertanyaan seputar Telmy? Semua hal tentang privasi data, browser yang didukung, kuota harga, dan cara kerja.",
      searchPlh: "Cari pertanyaan (misal: privasi, PDF, browser, gratis)...",
      catAll: "Semua Pertanyaan",
      catGen: "Umum",
      catTech: "Browser & PDF",
      catPriv: "Privasi & Brankas",
      catPrice: "Harga & Kuota",
      contactUs: "Masih butuh bantuan? Hubungi tim kami di support@telmy.ai",
    },
    ja: {
      badge: "疑問をすべて解消",
      title: "よくあるご質問 (FAQ)",
      subtitle: "Telmy に関する疑問にお答えします。プライバシー、対応ブラウザ、利用枠、機能について詳しく解説しています。",
      searchPlh: "質問を検索（例：プライバシー、PDF、ブラウザ、無料）...",
      catAll: "すべて",
      catGen: "全般",
      catTech: "ブラウザ & PDF",
      catPriv: "プライバシー & 保管庫",
      catPrice: "料金 & 利用枠",
      contactUs: "ご不明な点はお気軽に support@telmy.ai までお問い合わせください。",
    },
    ko: {
      badge: "궁금증을 시원하게 해결",
      title: "자주 묻는 질문 (FAQ)",
      subtitle: "Telmy에 대해 궁금한 점이 있으신가요? 개인정보 보호, 지원 브라우저, 요금 및 기능에 대한 모든 안내입니다.",
      searchPlh: "질문 검색 (예: 개인정보, PDF, 브라우저, 무료)...",
      catAll: "전체 질문",
      catGen: "일반",
      catTech: "브라우저 및 PDF",
      catPriv: "보안 및 보관함",
      catPrice: "요금 및 이용량",
      contactUs: "추가 문의 사항은 support@telmy.ai 로 문의해 주세요.",
    },
    zh: {
      badge: "答疑解惑 · 真实透明",
      title: "常见问题解答 (FAQ)",
      subtitle: "关于 Telmy 的一切疑问解答：隐私防护、支持浏览器、资费额度及核心特性详解。",
      searchPlh: "搜索问题（例如：隐私安全、PDF、浏览器、免费）...",
      catAll: "全部问题",
      catGen: "常规问题",
      catTech: "浏览器与 PDF",
      catPriv: "隐私与保险库",
      catPrice: "资费与额度",
      contactUs: "仍有疑问？欢迎随时发送邮件至 support@telmy.ai 与我们取得联系。",
    },
    'zh-TW': {
      badge: "答疑解惑 · 真實透明",
      title: "常見問題解答 (FAQ)",
      subtitle: "關於 Telmy 的一切疑問解答：隱私防護、支援瀏覽器、資費額度及核心特性詳解。",
      searchPlh: "搜尋問題（例如：隱私安全、PDF、瀏覽器、免費）...",
      catAll: "全部問題",
      catGen: "常規問題",
      catTech: "瀏覽器與 PDF",
      catPriv: "隱私與保險庫",
      catPrice: "資費與額度",
      contactUs: "仍有疑問？歡迎隨時發送郵件至 support@telmy.ai 與我們取得聯絡。",
    },
    vi: {
      badge: "Giải đáp mọi thắc mắc",
      title: "Câu Hỏi Thường Gặp (FAQ)",
      subtitle: "Giải đáp mọi thắc mắc về Telmy: quyền riêng tư, trình duyệt hỗ trợ, gói cước và tính năng.",
      searchPlh: "Tìm câu hỏi (vd: bảo mật, PDF, trình duyệt, miễn phí)...",
      catAll: "Tất cả câu hỏi",
      catGen: "Chung",
      catTech: "Trình duyệt & PDF",
      catPriv: "Bảo mật & Két dữ liệu",
      catPrice: "Giá cước & Hạn mức",
      contactUs: "Bạn vẫn cần hỗ trợ? Hãy gửi email tới support@telmy.ai",
    },
    th: {
      badge: "คำตอบที่ชัดเจนและโปร่งใส",
      title: "คำถามที่พบบ่อย (FAQ)",
      subtitle: "ตอบทุกข้อสงสัยเกี่ยวกับ Telmy: ความเป็นส่วนตัว เบราว์เซอร์ที่รองรับ แพ็กเกจราคา และการใช้งาน",
      searchPlh: "ค้นหาคำถาม (เช่น ความปลอดภัย, PDF, เบราว์เซอร์, ฟรี)...",
      catAll: "คำถามทั้งหมด",
      catGen: "ทั่วไป",
      catTech: "เบราว์เซอร์และ PDF",
      catPriv: "ความเป็นส่วนตัวและตู้นิรภัย",
      catPrice: "ราคาและโควตา",
      contactUs: "หากมีข้อสงสัยเพิ่มเติม สามารถติดต่อทีมงานได้ที่ support@telmy.ai",
    },
    hi: {
      badge: "सवालों के स्पष्ट जवाब",
      title: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      subtitle: "Telmy के बारे में सब कुछ: गोपनीयता, समर्थित ब्राउज़र, मूल्य निर्धारण और विशेषताएं।",
      searchPlh: "प्रश्न खोजें (उदा: गोपनीयता, पीडीएफ, ब्राउज़र, मुफ्त)...",
      catAll: "सभी प्रश्न",
      catGen: "सामान्य",
      catTech: "ब्राउज़र और पीडीएफ",
      catPriv: "गोपनीयता और वॉल्ट",
      catPrice: "मूल्य और कोटा",
      contactUs: "कोई प्रश्न है? support@telmy.ai पर संपर्क करें।",
    },
    fil: {
      badge: "Mga Sagot sa Tanong",
      title: "Mga Madalas Itanong (FAQ)",
      subtitle: "Mga sagot sa iyong mga katanungan ukol sa privacy, supported browsers, at quotas ng Telmy.",
      searchPlh: "Maghanap ng tanong...",
      catAll: "Lahat ng Tanong",
      catGen: "Pangkalahatan",
      catTech: "Browser at PDF",
      catPriv: "Privacy at Vault",
      catPrice: "Presyo at Quota",
      contactUs: "May katanungan pa? Mag-email sa support@telmy.ai",
    },
    ms: {
      badge: "Jawapan Terperinci",
      title: "Soalan Lazim (FAQ)",
      subtitle: "Segala maklumat mengenai privasi data, pelayar yang disokong, kuota harga, dan ciri Telmy.",
      searchPlh: "Cari soalan (cth: privasi, PDF, pelayar, percuma)...",
      catAll: "Semua Soalan",
      catGen: "Umum",
      catTech: "Pelayar & PDF",
      catPriv: "Privasi & Peti Kebal",
      catPrice: "Harga & Kuota",
      contactUs: "Perlukan bantuan lanjut? Hubungi kami di support@telmy.ai",
    },
  }

  const h = titles[langKey] || titles.en

  // Filter items
  const filteredFaqs = FAQ_LIST_DATA.filter((item: FaqItem) => {
    if (selectedCat !== 'all' && item.category !== selectedCat) return false

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      const question = (item.q[langKey] || item.q.en).toLowerCase()
      const answer = (item.a[langKey] || item.a.en).toLowerCase()
      return question.includes(q) || answer.includes(q)
    }

    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>{h.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {h.title}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {h.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={h.searchPlh}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 text-sm sm:text-base shadow-xs transition-all"
            />
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCat === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {h.catAll}
            </button>
            <button
              onClick={() => setSelectedCat('general')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCat === 'general'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {h.catGen}
            </button>
            <button
              onClick={() => setSelectedCat('tech')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCat === 'tech'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {h.catTech}
            </button>
            <button
              onClick={() => setSelectedCat('privacy')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCat === 'privacy'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {h.catPriv}
            </button>
            <button
              onClick={() => setSelectedCat('pricing')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCat === 'pricing'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {h.catPrice}
            </button>
          </div>
        </div>
      </section>

      {/* Accordion Questions */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const question = faq.q[langKey] || faq.q.en
            const answer = faq.a[langKey] || faq.a.en
            const isOpen = openIdx === idx

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center text-xs sm:text-sm text-slate-500 bg-slate-100/70 p-6 rounded-2xl border border-slate-200/60">
          <MessageSquare className="w-5 h-5 mx-auto text-blue-600 mb-2" />
          <span>{h.contactUs}</span>
        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
