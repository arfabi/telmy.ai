import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { Sparkles, CheckCircle2, Globe, Layers, ArrowRight } from 'lucide-react'

export const RealActionShowcase: React.FC = () => {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState<'gov' | 'web'>('gov')

  const texts: Record<
    string,
    {
      kicker: string
      title: string
      subtitle: string
      tabGov: string
      tabWeb: string
      activeLabel: string
      govTag: string
      govTitle: string
      govDesc: string
      govHighlights: string[]
      webTag: string
      webTitle: string
      webDesc: string
      webHighlights: string[]
      installBtn: string
    }
  > = {
    en: {
      kicker: "Real Browser Side Panel in Action",
      title: "See Telmy in Real Action",
      subtitle: "No mockups or concept art. This is the real Telmy.ai extension active in Google Chrome, guiding real applicants on live official websites.",
      tabGov: "Government Portal (Apostille / Visa / Scholarship / Immigration)",
      tabWeb: "Web Form (Jotform / Google Forms / Microsoft Forms)",
      activeLabel: "Chrome Side Panel: Active",
      govTag: "Official Public Service Portal",
      govTitle: "Government Portal (Apostille / Visa / Scholarship / Immigration)",
      govDesc: "See Telmy working in real-time alongside official portals like AHU Kemenkumham Apostille Legalization, Visa portals, and Immigration systems. Telmy opens right in the native Chrome Side Panel without covering your form.",
      govHighlights: [
        "Chrome Side Panel sits right beside official embassy & ministry forms",
        "Auto-detects passport number, full legal name, and address fields",
        "Validates mandatory requirements before clicking final submit"
      ],
      webTag: "Everyday & Corporate Forms",
      webTitle: "Web Form (Jotform / Google Forms / Microsoft Forms)",
      webDesc: "Works seamlessly on any standard online form, survey, booking enquiry, or university registration portal. Extract PDF details or 1-Click AutoFill complex questions effortlessly.",
      webHighlights: [
        "Supports Jotform, Google Forms, Typeform, and Microsoft Forms",
        "1-Click AutoFill populates 20+ fields in one second",
        "Built-in Accessibility Hub & High-Contrast reading assistance"
      ],
      installBtn: "Install Telmy Extension Free"
    },
    id: {
      kicker: "Panel Samping Browser Asli Sedang Aktif",
      title: "Lihat Telmy Bekerja di Dunia Nyata",
      subtitle: "Bukan sekadar mockup atau konsep desain. Ini adalah ekstensi Telmy.ai asli yang sedang berjalan di Google Chrome, memandu pengguna di situs web resmi secara langsung.",
      tabGov: "Portal Pemerintah (Apostille / Visa / Beasiswa / Imigrasi)",
      tabWeb: "Formulir Web (Jotform / Google Forms / Microsoft Forms)",
      activeLabel: "Panel Samping Chrome: Aktif",
      govTag: "Portal Layanan Publik Resmi",
      govTitle: "Portal Pemerintah (Apostille / Visa / Beasiswa / Imigrasi)",
      govDesc: "Lihat Telmy mendampingi Anda secara real-time pada portal resmi seperti Legalisasi Apostille AHU Kemenkumham, portal visa, dan sistem imigrasi. Telmy terbuka langsung di Chrome Side Panel tanpa menutupi formulir Anda.",
      govHighlights: [
        "Panel samping Chrome berdampingan langsung dengan formulir kementerian & kedutaan",
        "Otomatis mendeteksi nomor paspor, NIK, nama lengkap, dan kolom alamat",
        "Memvalidasi kelengkapan data wajib sebelum menekan tombol kirim akhir"
      ],
      webTag: "Formulir Harian & Pendaftaran Online",
      webTitle: "Formulir Web (Jotform / Google Forms / Microsoft Forms)",
      webDesc: "Berjalan mulus di formulir online standar, survei, reservasi, hingga portal pendaftaran universitas. Ekstrak data PDF atau gunakan 1-Klik AutoFill untuk mengisi formulir kompleks tanpa stres.",
      webHighlights: [
        "Mendukung Jotform, Google Forms, Typeform, dan Microsoft Forms",
        "1-Klik AutoFill mengisi 20+ kolom dalam satu detik",
        "Pusat Aksesibilitas terintegrasi & bantuan membaca kontras tinggi"
      ],
      installBtn: "Pasang Ekstensi Telmy Gratis"
    },
    ja: {
      kicker: "実際のブラウザサイドパネルの動作画面",
      title: "Telmy の実際の動作をご確認ください",
      subtitle: "デザインのモックアップではありません。Google Chrome で実際に稼働し、公的申請サイトで申請者をサポートしている本物の Telmy.ai 拡張機能です。",
      tabGov: "政府・公的機関ポータル（アポスティーユ / ビザ / 奨学金 / 入管）",
      tabWeb: "Webフォーム（Jotform / Googleフォーム / 各種申請）",
      activeLabel: "Chrome サイドパネル：稼働中",
      govTag: "公式行政サービスポータル",
      govTitle: "政府・公的機関ポータル（アポスティーユ / ビザ / 奨学金 / 入管）",
      govDesc: "法務省や公的アポスティーユ認証ポータル、ビザ申請サイトの横でリアルタイムに動作します。フォーム入力を遮ることなく、Chrome サイドパネルで並行して確認できます。",
      govHighlights: [
        "入力画面を隠さず、大使館・省庁フォームの真横にぴったり常駐",
        "パスポート番号、氏名、住所欄をAIが自動検知",
        "最終送信ボタンを押す前に必須記入漏れを厳格にチェック"
      ],
      webTag: "日常・ビジネスフォーム",
      webTitle: "Webフォーム（Jotform / Googleフォーム / 各種申請）",
      webDesc: "Jotform、Google フォーム、大学出願フォームなどあらゆるオンライン申請に対応。PDFからの情報抽出や1クリック自動入力が快適に行えます。",
      webHighlights: [
        "Jotform、Google Forms、Typeform 等に幅広く対応",
        "1クリック自動入力で20箇所以上の項目を瞬時に入力",
        "アクセシビリティハブ＆ハイコントラスト閲覧補助を標準搭載"
      ],
      installBtn: "Telmy 拡張機能を無料インストール"
    },
    ko: {
      kicker: "실제 브라우저 사이드 패널 구동 화면",
      title: "Telmy의 실제 작동 모습을 확인하세요",
      subtitle: "가상의 목업이 아닙니다. Google Chrome에서 실제 실행되어 공공 웹사이트에서 신청자를 돕고 있는 Telmy.ai 확장 프로그램의 실제 화면입니다.",
      tabGov: "정부 및 공공 포털 (아포스티유 / 비자 / 장학금 / 출입국)",
      tabWeb: "웹 서식 (Jotform / 구글 폼 / 온라인 신청)",
      activeLabel: "Chrome 사이드 패널: 작동 중",
      govTag: "공식 공공 행정 포털",
      govTitle: "정부 및 공공 포털 (아포스티유 / 비자 / 장학금 / 출입국)",
      govDesc: "대사관 비자 신청 및 공문서 아포스티유 인증 포털 옆에서 실시간으로 함께 작동합니다. 서식을 가리지 않고 Chrome 사이드 패널에서 안전하게 안내받으세요.",
      govHighlights: [
        "작성 화면을 덮지 않고 공식 행정 양식 바로 옆에 나란히 배치",
        "여권 번호, 영문 성명, 주소 항목을 AI가 즉시 감지",
        "최종 제출 버튼을 누르기 전 필수 누락 사항 사전 검증"
      ],
      webTag: "일상 및 비즈니스 신청 서식",
      webTitle: "웹 서식 (Jotform / 구글 폼 / 온라인 신청)",
      webDesc: "Jotform, Google Forms, 대학 입학 신청 등 모든 웹 폼을 완벽 지원합니다. PDF 서류 자동 추출 및 원클릭 자동완성을 손쉽게 경험하세요.",
      webHighlights: [
        "Jotform, Google Forms, Typeform 등 범용 지원",
        "원클릭 자동완성으로 20개 이상의 항목을 1초 만에 기입",
        "자체 내장된 접근성 허브 및 고대비 가독성 지원"
      ],
      installBtn: "Telmy 확장 프로그램 무료 설치"
    },
    zh: {
      kicker: "真实浏览器侧边栏运行展示",
      title: "亲身体验 Telmy 的实际运行效果",
      subtitle: "绝非虚构的原型设计。这是在 Google Chrome 中真实运行、在政府及公文官网上实时协助填报者的 Telmy.ai 浏览器扩展实景。",
      tabGov: "政府政务门户（海牙认证 / 签证 / 留学奖学金 / 移民局）",
      tabWeb: "常用网络表格（Jotform / Google 表单 / 在线登记）",
      activeLabel: "Chrome 侧边栏：运行中",
      govTag: "官方政务服务门户",
      govTitle: "政府政务门户（海牙认证 / 签证 / 留学奖学金 / 移民局）",
      govDesc: "在政府公文认证、签证办理与使领馆系统中实时并行工作。原生内嵌于 Chrome 侧边栏，全程无需遮挡或切换填写界面。",
      govHighlights: [
        "侧边栏紧贴使领馆官方表格，不遮挡原表单页面",
        "智能识别护照号、官方全名拼写与详细地址项",
        "在点击最终提交前严格审核必填项与格式规则"
      ],
      webTag: "日常登记与在线申报",
      webTitle: "常用网络表格（Jotform / Google 表单 / 在线登记）",
      webDesc: "全面支持 Jotform、Google 表单、高校申请等各类网页。一键自动提取 PDF 资料，瞬间搞定冗长复杂的问卷填报。",
      webHighlights: [
        "无缝支持 Jotform、Google 表单、Typeform 等平台",
        "一键自动填充，1 秒钟准确录入 20+ 项资料",
        "内置无障碍辅助中心，支持高对比度视力对齐辅助"
      ],
      installBtn: "免费安装 Telmy 扩展"
    },
    'zh-TW': {
      kicker: "真實瀏覽器側邊欄運作展示",
      title: "親身體驗 Telmy 的實際運作效果",
      subtitle: "絕非虛構的原型設計。這是在 Google Chrome 中真實運作、在各國公文官網上即時協助填報者的 Telmy.ai 擴充功能實景。",
      tabGov: "政府公文門戶（海牙認證 / 簽證 / 留學獎學金 / 移民署）",
      tabWeb: "常用網路表格（Jotform / Google 表單 / 線上登記）",
      activeLabel: "Chrome 側邊欄：運作中",
      govTag: "官方政務服務門戶",
      govTitle: "政府公文門戶（海牙認證 / 簽證 / 留學獎學金 / 移民署）",
      govDesc: "在政府公文認證、簽證辦理與使領館系統中即時並行工作。原生內嵌於 Chrome 側邊欄，全程無需遮蔽或切換填寫頁面。",
      govHighlights: [
        "側邊欄緊貼使領館官方表格，不遮蔽原表單頁面",
        "智慧辨識護照號碼、官方英文姓名拼音與地址欄位",
        "在點擊最終送出前嚴格審核必填項與格式規則"
      ],
      webTag: "日常登記與線上申報",
      webTitle: "常用網路表格（Jotform / Google 表單 / 線上登記）",
      webDesc: "全面支援 Jotform、Google 表單、各大學申請等各類網頁。一鍵自動擷取 PDF 資料，瞬間搞定冗長複雜的問卷填報。",
      webHighlights: [
        "無縫支援 Jotform、Google 表單、Typeform 等平台",
        "一鍵自動填寫，1 秒鐘準確鍵入 20+ 項個人資料",
        "內建無障礙輔助中心，支援高對比度視力輔助"
      ],
      installBtn: "免費安裝 Telmy 擴充功能"
    }
  }

  const cur = texts[lang] || texts.en

  const showcaseData = {
    gov: {
      tag: cur.govTag,
      title: cur.govTitle,
      desc: cur.govDesc,
      urlBar: 'https://elayanan.ahu.go.id/apostille/pendaftaran',
      imageSrc: '/assets/screenshot-ahu-apostille.png',
      alt: 'Telmy Side Panel on AHU Apostille government form',
      highlights: cur.govHighlights,
    },
    web: {
      tag: cur.webTag,
      title: cur.webTitle,
      desc: cur.webDesc,
      urlBar: 'https://form.jotform.com/201591624080045',
      imageSrc: '/assets/screenshot-web-form.png',
      alt: 'Telmy Side Panel on online registration form',
      highlights: cur.webHighlights,
    },
  }

  const current = showcaseData[activeTab]

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cur.kicker}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {cur.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {cur.subtitle}
          </p>

          {/* Interactive Tab Switcher */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setActiveTab('gov')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'gov'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102 ring-2 ring-blue-400/50'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-300" />
              <span>{cur.tabGov}</span>
            </button>

            <button
              onClick={() => setActiveTab('web')}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'web'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-102 ring-2 ring-blue-400/50'
                  : 'bg-slate-800/90 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-300" />
              <span>{cur.tabWeb}</span>
            </button>
          </div>
        </div>

        {/* Real Chrome Browser Frame Display */}
        <div className="bg-slate-800/95 border border-slate-700/80 rounded-3xl p-3 sm:p-5 shadow-2xl shadow-blue-950/50">
          {/* Chrome Top Bar Mockup */}
          <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-700/70 mb-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
            </div>

            {/* URL Address Bar */}
            <div className="flex-1 max-w-xl bg-slate-900 border border-slate-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="truncate">{current.urlBar}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>{cur.activeLabel}</span>
            </div>
          </div>

          {/* Screenshot Container */}
          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group relative">
            <img
              src={current.imageSrc}
              alt={current.alt}
              className="w-full h-auto object-cover object-top transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Bottom Context Details & Highlights */}
          <div className="mt-5 pt-4 border-t border-slate-700/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-2">
            <div className="md:col-span-8">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                {current.tag}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {current.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {current.desc}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {current.highlights.map((hl, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/90 border border-slate-700/80 text-slate-300 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <a
                href="/download"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all group"
              >
                <span>{cur.installBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
