import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DownloadCloud, CheckCircle2, Pin, Play, Sparkles } from 'lucide-react'

export const DownloadPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'chrome' | 'edge' | 'firefox' | 'opera'>('chrome')

  const strings: Record<string, Record<string, string>> = {
    title: {
      en: "Install Telmy.ai in 60 Seconds",
      id: "Pasang Telmy.ai dalam 60 Detik",
      ja: "60秒で Telmy.ai をインストール",
      ko: "60초 만에 Telmy.ai 설치하기",
      zh: "60 秒内快速安装 Telmy.ai",
      'zh-TW': "60 秒內快速安裝 Telmy.ai",
      vi: "Cài đặt Telmy.ai trong 60 giây",
      th: "ติดตั้ง Telmy.ai ใน 60 วินาที",
      hi: "60 सेकंड में Telmy.ai इंस्टॉल करें",
      fil: "I-install ang Telmy.ai sa Loob ng 60 Segundo",
      ms: "Pasang Telmy.ai dalam 60 Saat",
    },
    subtitle: {
      en: "Free for Chrome, Edge, Firefox, and Opera. Pick your browser to get started.",
      id: "Tersedia gratis untuk Chrome, Edge, Firefox, dan Opera. Pilih peramban Anda untuk memulai.",
      ja: "Chrome、Edge、Firefox、Opera で無料利用可能。お使いのブラウザを選択してください。",
      ko: "Chrome, Edge, Firefox, Opera 완전 무료 지원. 사용 중인 브라우저를 선택하세요.",
      zh: "完全免费支持 Chrome、Edge、Firefox 及 Opera。请选择您日常使用的浏览器。",
      'zh-TW': "完全免費支援 Chrome、Edge、Firefox 及 Opera。請選擇您日常使用的瀏覽器。",
      vi: "Miễn phí cho Chrome, Edge, Firefox và Opera. Chọn trình duyệt của bạn để bắt đầu.",
      th: "ฟรีสำหรับ Chrome, Edge, Firefox และ Opera เลือกเบราว์เซอร์ของคุณเพื่อเริ่มต้น",
      hi: "Chrome, Edge, Firefox और Opera के लिए निःशुल्क। शुरू करने के लिए अपना ब्राउज़र चुनें।",
      fil: "Libre para sa Chrome, Edge, Firefox, at Opera. Piliin ang iyong browser.",
      ms: "Percuma untuk Chrome, Edge, Firefox, dan Opera. Pilih pelayar anda untuk bermula.",
    },
    instantBadge: {
      en: "Instant Installation",
      id: "Pemasangan Instan",
      ja: "かんたん即時インストール",
      ko: "간편 즉시 설치",
      zh: "极速秒级安装",
      'zh-TW': "極速秒級安裝",
      vi: "Cài đặt tức thì",
      th: "ติดตั้งได้ทันที",
      hi: "त्वरित इंस्टॉलेशन",
      fil: "Mabilisang Pag-install",
      ms: "Pemasangan Segera",
    },
    officialStoreBadge: {
      en: "Official extension store · Manifest V3 certified",
      id: "Toko ekstensi resmi · Bersertifikat Manifest V3",
      ja: "公式拡張機能ストア · Manifest V3 認定",
      ko: "공식 확장 프로그램 스토어 · Manifest V3 인증 완료",
      zh: "官方插件商店 · 认证通过 Manifest V3 安全标准",
      'zh-TW': "官方外掛商店 · 認證通過 Manifest V3 安全標準",
      vi: "Cửa hàng tiện ích chính thức · Chứng nhận Manifest V3",
      th: "สโตร์อย่างเป็นทางการ · รับรองมาตรฐาน Manifest V3",
      hi: "आधिकारिक एक्सटेंशन स्टोर · Manifest V3 प्रमाणित",
      fil: "Opisyal na extension store · Manifest V3 certified",
      ms: "Kedai sambungan rasmi · Disahkan Manifest V3",
    },
    downloadBtn: {
      en: "Add to Browser (Free)",
      id: "Tambahkan ke Browser (Gratis)",
      ja: "ブラウザに追加（無料）",
      ko: "브라우저에 추가 (무료)",
      zh: "添加至浏览器（免费）",
      'zh-TW': "加到瀏覽器（免費）",
      vi: "Thêm vào trình duyệt (Miễn phí)",
      th: "เพิ่มลงในเบราว์เซอร์ (ฟรี)",
      hi: "ब्राउज़र में जोड़ें (मुफ्त)",
      fil: "Idagdag sa Browser (Libre)",
      ms: "Tambah ke Pelayar (Percuma)",
    },
    step1Title: {
      en: "Step 1: Install from Web Store",
      id: "Langkah 1: Pasang dari Web Store",
      ja: "ステップ 1：ウェブストアからインストール",
      ko: "1단계: 웹 스토어에서 추가",
      zh: "第 1 步：从官方商店添加",
      'zh-TW': "第 1 步：從官方商店新增",
      vi: "Bước 1: Cài đặt từ cửa hàng tiện ích",
      th: "ขั้นตอนที่ 1: ติดตั้งจากเว็บสโตร์",
      hi: "चरण 1: वेब स्टोर से इंस्टॉल करें",
      fil: "Hakbang 1: I-install mula sa Web Store",
      ms: "Langkah 1: Pasang dari Kedai Web",
    },
    step1Desc: {
      en: "Click the blue button above to open the official extension store page and click Add to Chrome / Get.",
      id: "Klik tombol biru di atas untuk membuka laman resmi ekstensi dan tekan Tambahkan ke Chrome / Dapatkan.",
      ja: "上の青いボタンをクリックして公式拡張機能ストアを開き、「Chrome に追加」または「入手」を押します。",
      ko: "위의 파란색 버튼을 눌러 공식 스토어로 이동한 후 'Chrome에 추가' 또는 '다운로드'를 클릭합니다.",
      zh: "点击上方蓝色按钮前往官方插件商店页面，点击“添加至 Chrome”或“获取”。",
      'zh-TW': "點擊上方藍色按鈕前往官方外掛商店頁面，點擊「加到 Chrome」或「取得」。",
      vi: "Bấm nút màu xanh ở trên để mở kho tiện ích và nhấn Thêm vào Chrome.",
      th: "คลิกปุ่มสีน้ำเงินด้านบนเพื่อเปิดหน้าสโตร์อย่างเป็นทางการ แล้วกด 'เพิ่มลงใน Chrome'",
      hi: "आधिकारिक स्टोर खोलने के लिए ऊपर दिए गए नीले बटन पर क्लिक करें।",
      fil: "I-click ang asul na button sa itaas at piliin ang 'Add to Chrome'.",
      ms: "Klik butang biru di atas untuk membuka kedai rasmi dan pilih Tambah ke Chrome.",
    },
    step2Title: {
      en: "Step 2: Pin the Telmy Mascot",
      id: "Langkah 2: Sematkan Maskot Telmy",
      ja: "ステップ 2：Telmy アイコンをピン留め",
      ko: "2단계: Telmy 아이콘 툴바에 고정",
      zh: "第 2 步：固定 Telmy 拼图图标",
      'zh-TW': "第 2 步：固定 Telmy 拼圖圖示",
      vi: "Bước 2: Ghim biểu tượng Telmy",
      th: "ขั้นตอนที่ 2: ปักหมุดไอคอน Telmy",
      hi: "चरण 2: Telmy आइकन को पिन करें",
      fil: "Hakbang 2: I-pin ang Telmy Icon",
      ms: "Langkah 2: Sematkan Ikon Telmy",
    },
    step2Desc: {
      en: "Click the Extensions puzzle icon in your browser toolbar, then click the Pin icon next to Telmy.ai.",
      id: "Klik ikon potongan puzzle Ekstensi di bilah alat browser, lalu klik ikon Pin di samping Telmy.ai.",
      ja: "ブラウザ上部のパズルピースアイコンをクリックし、Telmy.ai の横にあるピンを押します。",
      ko: "브라우저 툴바의 퍼즐 조각 아이콘을 클릭한 뒤, Telmy.ai 옆의 핀 아이콘을 누릅니다.",
      zh: "点击浏览器地址栏旁的扩展拼图图标，随后点击 Telmy.ai 旁边的图钉按钮。",
      'zh-TW': "點擊瀏覽器網址列旁的擴充功能拼圖圖示，隨後點擊 Telmy.ai 旁邊的圖釘按鈕。",
      vi: "Bấm vào biểu tượng mảnh ghép tiện ích trên thanh công cụ và ghim Telmy.ai.",
      th: "คลิกไอคอนจิ๊กซอว์บนแถบเครื่องมือของเบราว์เซอร์ แล้วกดปักหมุดข้าง Telmy.ai",
      hi: "टूलबार में पज़ल आइकन पर क्लिक करें और Telmy.ai को पिन करें।",
      fil: "I-click ang puzzle icon sa toolbar at i-pin ang Telmy.ai.",
      ms: "Klik ikon teka-teki pada bar alat pelayar dan sematkan Telmy.ai.",
    },
    step3Title: {
      en: "Step 3: Open Any Web or PDF Form",
      id: "Langkah 3: Buka Formulir Web atau PDF Mana Pun",
      ja: "ステップ 3：任意のフォームまたは PDF を開く",
      ko: "3단계: 웹 또는 PDF 양식 열기",
      zh: "第 3 步：打开任意网页或 PDF 表单",
      'zh-TW': "第 3 步：開啟任意網頁或 PDF 表單",
      vi: "Bước 3: Mở bất kỳ biểu mẫu web hoặc PDF nào",
      th: "ขั้นตอนที่ 3: เปิดแบบฟอร์มบนเว็บหรือ PDF",
      hi: "चरण 3: कोई भी वेब या पीडीएफ फॉर्म खोलें",
      fil: "Hakbang 3: Buksan ang Anumang Form o PDF",
      ms: "Langkah 3: Buka Mana-mana Borang Web atau PDF",
    },
    step3Desc: {
      en: "Telmy's intelligent sidepanel will automatically wake up to guide, explain, and autofill with 100% confidence.",
      id: "Panel samping cerdas Telmy akan otomatis aktif untuk memandu, menjelaskan, dan mengisi form dengan penuh percaya diri.",
      ja: "Telmy のインテリジェントサイドパネルが自動起動し、安心かつ正確に入力をアシストします。",
      ko: "Telmy의 지능형 사이드 패널이 자동으로 활성화되어 자신감 있게 양식을 작성하도록 돕습니다.",
      zh: "Telmy 智能侧边栏将自动响应并提供讲解、校验与一键填单支持。",
      'zh-TW': "Telmy 智慧側邊欄將自動響應並提供解說、校驗與一鍵填單支援。",
      vi: "Bảng điều khiển thông minh của Telmy sẽ tự động kích hoạt để hướng dẫn và tự điền an toàn.",
      th: "แผงด้านข้างอัจฉริยะของ Telmy จะเปิดใช้งานโดยอัตโนมัติเพื่อช่วยเหลือคุณอย่างมั่นใจ",
      hi: "Telmy का स्मार्ट साइडपैनल अपने आप सक्रिय होकर आपका मार्गदर्शन करेगा।",
      fil: "Awtomatikong magbubukas ang side panel ng Telmy para gabayan ka nang buong kumpiyansa.",
      ms: "Panel sisi pintar Telmy akan aktif secara automatik untuk membimbing anda dengan yakin.",
    },
  }

  const getStr = (key: string) => {
    return strings[key]?.[currentLang] || strings[key]?.en || ''
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>{getStr('instantBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {getStr('title')}
          </h1>
          <p className="mt-4 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {getStr('subtitle')}
          </p>

          {/* Browser Selection Tabs — Horizontal Client Grid Style */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl mx-auto">
            {([
              { id: 'chrome', name: 'Google Chrome', icon: '/chrome.png' },
              { id: 'edge', name: 'Microsoft Edge', icon: '/edge.png' },
              { id: 'firefox', name: 'Mozilla Firefox', icon: '/firefox.png' },
              { id: 'opera', name: 'Opera Browser', icon: '/opera.png' },
            ] as const).map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveTab(b.id)}
                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                  activeTab === b.id
                    ? 'bg-white border-blue-600 shadow-lg shadow-blue-500/15 ring-2 ring-blue-600/20 scale-[1.02]'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs hover:shadow-xs'
                }`}
              >
                <img
                  src={b.icon}
                  alt={b.name}
                  className="w-10 h-10 object-contain drop-shadow-xs"
                />
                <span className={`text-xs font-bold capitalize ${
                  activeTab === b.id ? 'text-blue-600' : 'text-slate-700'
                }`}>
                  {b.id}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Instruction Steps */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        <div className="space-y-6">
          
          {/* Main Action Banner */}
          <Card className="p-8 bg-blue-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 flex items-center justify-center font-bold shadow-md shadow-blue-500/10 p-2.5">
                <img
                  src={`/${activeTab}.png`}
                  alt={activeTab}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 capitalize">
                  Telmy for {activeTab}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {getStr('officialStoreBadge')}
                </p>
              </div>
            </div>
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-md shadow-blue-500/20">
                <span>{getStr('downloadBtn')}</span>
              </Button>
            </a>
          </Card>

          {/* 3 Step Walkthrough Cards */}
          <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {getStr('step1Title')}
                </h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {getStr('step1Desc')}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {getStr('step2Title')}
                </h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {getStr('step2Desc')}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Step 3 */}
            <div className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-slate-900">
                  {getStr('step3Title')}
                </h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {getStr('step3Desc')}
                </p>
              </div>
            </div>
          </Card>

        </div>
      </main>

      <Footer t={t} />
    </div>
  )
}
