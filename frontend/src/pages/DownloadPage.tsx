import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '@/context/LanguageContext'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  DownloadCloud, 
  CheckCircle2, 
  Pin, 
  Sparkles, 
  FolderArchive, 
  Cpu, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertTriangle 
} from 'lucide-react'
import { SEO } from '@/components/common/SEO'

export const DownloadPage: React.FC = () => {
  const { currentLang, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'chrome' | 'edge' | 'firefox' | 'opera'>('chrome')
  const [copiedUrl, setCopiedUrl] = useState(false)

  const handleCopyUrl = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

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
      en: "Free for Chrome, Edge, Firefox, and Opera. Choose direct ZIP package or developer unpacked loading.",
      id: "Tersedia gratis untuk Chrome, Edge, Firefox, dan Opera. Unduh paket ZIP langsung atau muat mode pengembang (unpacked).",
      ja: "Chrome、Edge、Firefox、Opera で無料利用可能。ZIPパッケージの直接ダウンロードまたは開発者モードでの読み込みに対応。",
      ko: "Chrome, Edge, Firefox, Opera 완전 무료 지원. ZIP 패키지 다운로드 또는 개발자 모드 로드 지원.",
      zh: "完全免费支持 Chrome、Edge、Firefox 及 Opera。支持直接下载 ZIP 压缩包或开发者模式加载。",
      'zh-TW': "完全免費支援 Chrome、Edge、Firefox 及 Opera。支援直接下載 ZIP 壓縮包或開發者模式載入。",
      vi: "Miễn phí cho Chrome, Edge, Firefox và Opera. Tải gói ZIP trực tiếp hoặc cài qua chế độ nhà phát triển.",
      th: "ฟรีสำหรับ Chrome, Edge, Firefox และ Opera ดาวน์โหลดไฟล์ ZIP ได้ทันทีหรือโหลดผ่านโหมดนักพัฒนา",
      hi: "Chrome, Edge, Firefox और Opera के लिए निःशुल्क। सीधे ZIP डाउनलोड करें या डेवलपर मोड में लोड करें।",
      fil: "Libre para sa Chrome, Edge, Firefox, at Opera. I-download ang ZIP package o i-load sa developer mode.",
      ms: "Percuma untuk Chrome, Edge, Firefox, dan Opera. Muat turun pakej ZIP terus atau mod pembangun.",
    },
    instantBadge: {
      en: "Instant ZIP & Unpacked Ready",
      id: "Paket ZIP & Unpacked Siap Pakai",
      ja: "ZIP / 開発者モード即時対応",
      ko: "ZIP 즉시 다운로드 & 언팩 지원",
      zh: "支持 ZIP 直装与开发者模式",
      'zh-TW': "支援 ZIP 直裝與開發者模式",
      vi: "Sẵn sàng file ZIP & Unpacked",
      th: "พร้อมดาวน์โหลดไฟล์ ZIP และ Unpacked",
      hi: "ZIP और अनपैक तैयार",
      fil: "Handa na ang ZIP at Unpacked",
      ms: "Pakej ZIP & Unpacked Sedia Digunakan",
    },
    officialStoreBadge: {
      en: "Hackathon Evaluation & Direct Package · Manifest V3 Certified",
      id: "Evaluasi Hackathon & Paket Langsung · Bersertifikat Manifest V3",
      ja: "審査用ダイレクトパッケージ · Manifest V3 認定",
      ko: "심사용 다이렉트 패키지 · Manifest V3 인증",
      zh: "评审官方直装包 · 符合 Manifest V3 安全标准",
      'zh-TW': "評審官方直裝包 · 符合 Manifest V3 安全標準",
      vi: "Gói tải trực tiếp cho giám khảo · Chứng nhận Manifest V3",
      th: "แพ็กเกจตรงสำหรับการประเมิน · รับรอง Manifest V3",
      hi: "प्रत्यक्ष मूल्यांकन पैकेज · Manifest V3 प्रमाणित",
      fil: "Direktang ZIP Package · Manifest V3 Certified",
      ms: "Pakej Terus Penilaian · Disahkan Manifest V3",
    },
    downloadZipBtn: {
      en: "Download Telmy (.ZIP Package)",
      id: "Unduh Telmy (.ZIP Paket Ekstensi)",
      ja: "Telmy をダウンロード (.ZIP)",
      ko: "Telmy 다운로드 (.ZIP)",
      zh: "下载 Telmy 扩展包 (.ZIP)",
      'zh-TW': "下載 Telmy 擴充包 (.ZIP)",
      vi: "Tải xuống Telmy (.ZIP)",
      th: "ดาวน์โหลด Telmy (.ZIP)",
      hi: "Telmy डाउनलोड करें (.ZIP)",
      fil: "I-download ang Telmy (.ZIP)",
      ms: "Muat Turun Telmy (.ZIP)",
    },
    webStoreBtn: {
      en: "Chrome Web Store (V2 Roadmap)",
      id: "Chrome Web Store (Roadmap V2)",
      ja: "Chrome ウェブストア（V2ロードマップ）",
      ko: "Chrome 웹 스토어 (V2 로드맵)",
      zh: "Chrome 应用商店（V2 规划）",
      'zh-TW': "Chrome 線上應用程式商店（V2 規劃）",
      vi: "Chrome Web Store (Kế hoạch V2)",
      th: "Chrome Web Store (แผนงาน V2)",
      hi: "Chrome वेब स्टोर (V2 योजना)",
      fil: "Chrome Web Store (V2 Roadmap)",
      ms: "Chrome Web Store (Pelan Tindakan V2)",
    },
    juryNoteTitle: {
      en: "For Judges & Evaluators (Zero Barrier Testing)",
      id: "Panduan Khusus Juri & Evaluator (Bebas Hambatan)",
      ja: "審査員・レビュアーの皆様へ（ログイン不要・簡単テスト）",
      ko: "심사위원 안내 (무설정 즉시 테스트 가능)",
      zh: "评审专家指南（零门槛直接体验）",
      'zh-TW': "評審專家指南（零門檻直接體驗）",
      vi: "Dành cho Ban giám khảo (Trải nghiệm nhanh không rào cản)",
      th: "สำหรับคณะกรรมการ (ทดสอบได้ทันทีโดยไม่มีอุปสรรค)",
      hi: "मूल्यांकनकर्ताओं के लिए (त्वरित परीक्षण गाइड)",
      fil: "Para sa mga Hurado at Evaluator (Mabilisang Pagsubok)",
      ms: "Untuk Para Hakim & Penilai (Ujian Pantas Tanpa Halangan)",
    },
    juryNoteDesc: {
      en: "The extension comes pre-configured with 5 free AI quota credits per session. No registration required to test page scanning and guidance on test portals! For full Smart Vault sync, click 'Connect' with any Google account.",
      id: "Ekstensi sudah dilengkapi kuota bawaan 5 formulir AI gratis. Anda bisa langsung mencoba fitur pemindaian formulir & panduan suara tanpa wajib login! Untuk fitur brankas lokal tersinkronisasi, cukup klik 'Connect' dengan akun Google apa pun.",
      ja: "本拡張機能には初期状態で 5 回分の無料 AI クレジットが付与されています。テスト用フォームでの読み取り・解説機能はログイン不要で即座にお試しいただけます。",
      ko: "본 확장 프로그램에는 기본 5회 무료 AI 크레딧이 탑재되어 있습니다. 별도의 회원가입 없이도 폼 분석 및 음성 안내를 즉시 테스트하실 수 있습니다.",
      zh: "插件内置 5 次免费 AI 辅导额度。评审测试任意表单扫描与语音讲解无需强制登录！如需体验多端保险库同步，可在侧边栏点击一键连接 Google 账号。",
      'zh-TW': "外掛內建 5 次免費 AI 輔導額度。評審測試任意表單掃描與語音解說無需強制登入！如需體驗多端保險庫同步，可在側邊欄點擊一鍵連接 Google 帳戶。",
      vi: "Tiện ích đã được cấu hình sẵn 5 lượt AI miễn phí. Giám khảo có thể dùng thử quét biểu mẫu ngay mà không bắt buộc đăng nhập!",
      th: "ส่วนขยายมาพร้อมโควตาฟรี 5 ครั้ง ไม่จำเป็นต้องลงทะเบียนเพื่อทดสอบการสแกนและคำแนะนำเบื้องต้น",
      hi: "एक्सटेंशन में पहले से 5 मुफ्त एआई क्रेडिट शामिल हैं। परीक्षण के लिए लॉगिन अनिवार्य नहीं है!",
      fil: "Ang extension ay may kasamang 5 libreng AI credit. Maaari agad subukan nang hindi kinakailangang mag-login!",
      ms: "Sambungan dilengkapi kuota 5 borang AI percuma. Boleh terus uji tanpa halangan log masuk!",
    },
    step1Title: {
      en: "Step 1: Download & Extract ZIP",
      id: "Langkah 1: Unduh & Ekstrak File ZIP",
      ja: "ステップ 1：ZIP ファイルをダウンロードして解凍",
      ko: "1단계: ZIP 파일 다운로드 및 압축 풀기",
      zh: "第 1 步：下载并解压 ZIP 压缩包",
      'zh-TW': "第 1 步：下載並解壓縮 ZIP 壓縮檔",
      vi: "Bước 1: Tải về và giải nén file ZIP",
      th: "ขั้นตอนที่ 1: ดาวน์โหลดและแตกไฟล์ ZIP",
      hi: "चरण 1: ZIP फ़ाइल डाउनलोड करें और अनज़िप करें",
      fil: "Hakbang 1: I-download at I-extract ang ZIP",
      ms: "Langkah 1: Muat Turun & Ekstrak Fail ZIP",
    },
    step1Desc: {
      en: "Click the 'Download Telmy (.ZIP)' button above. After download completes, right click the zip file and choose 'Extract All' to a local folder.",
      id: "Klik tombol 'Unduh Telmy (.ZIP)' di atas. Setelah selesai terunduh, klik kanan file zip dan pilih 'Extract All' (Ekstrak ke folder lokal Anda).",
      ja: "上の「Telmy をダウンロード (.ZIP)」ボタンをクリックします。ダウンロード完了後、zip ファイルを右クリックして「すべて展開」を選択してください。",
      ko: "위의 'Telmy 다운로드 (.ZIP)' 버튼을 클릭합니다. 다운로드 완료 후 압축을 풀어 로컬 폴더에 저장합니다.",
      zh: "点击上方“下载 Telmy 扩展包 (.ZIP)”按钮。下载完成后，右键压缩包并选择“全部解压缩”到本地任意文件夹。",
      'zh-TW': "點擊上方「下載 Telmy 擴充包 (.ZIP)」按鈕。下載完成後，右鍵壓縮檔並選擇「全部解壓縮」到本機資料夾。",
      vi: "Bấm nút 'Tải xuống Telmy (.ZIP)' ở trên. Sau khi tải xong, nhấp chuột phải vào file zip và giải nén ra một thư mục.",
      th: "คลิกปุ่ม 'ดาวน์โหลด Telmy (.ZIP)' ด้านบน เมื่อเสร็จแล้วให้คลิกขวาแล้วแตกไฟล์ทั้งหมดลงในโฟลเดอร์",
      hi: "ऊपर दिए गए 'Telmy डाउनलोड करें' बटन पर क्लिक करें और फ़ाइल को अनज़िप करें।",
      fil: "I-click ang 'I-download ang Telmy (.ZIP)' button at i-extract sa iyong computer.",
      ms: "Klik butang 'Muat Turun Telmy (.ZIP)' di atas dan ekstrak fail zip tersebut ke folder komputer anda.",
    },
    step2Title: {
      en: "Step 2: Enable Developer Mode & Load Unpacked",
      id: "Langkah 2: Aktifkan Developer Mode & Muat Ekstensi",
      ja: "ステップ 2：デベロッパーモードを有効化して解凍済みを読み込む",
      ko: "2단계: 개발자 모드 활성화 후 '압축해제된 확장 프로그램 로드'",
      zh: "第 2 步：开启开发者模式并“加载已解压的扩展程序”",
      'zh-TW': "第 2 步：開啟開發人員模式並「載入未壓縮的擴充功能」",
      vi: "Bước 2: Bật Chế độ nhà phát triển & Tải tiện ích đã giải nén",
      th: "ขั้นตอนที่ 2: เปิดโหมดนักพัฒนา และเลือก 'โหลดส่วนขยายที่คลายการบีบอัดแล้ว'",
      hi: "चरण 2: डेवलपर मोड सक्षम करें और अनपैक्ड लोड करें",
      fil: "Hakbang 2: I-on ang Developer Mode at I-load ang Unpacked",
      ms: "Langkah 2: Hidupkan Mod Pembangun & Muat Sambungan Tidak Dimampatkan",
    },
    step2Desc: {
      en: "Open your browser's extension manager. Turn ON 'Developer mode' toggle in top-right. Click 'Load unpacked' and select the unzipped extension folder.",
      id: "Buka halaman ekstensi browser Anda. Aktifkan sakelar 'Developer mode' di pojok kanan atas. Klik tombol 'Load unpacked' lalu pilih folder hasil ekstrak tadi.",
      ja: "ブラウザの拡張機能管理画面を開きます。右上の「デベロッパーモード」をオンにして、「パッケージ化されていない拡張機能を読み込む」から解凍したフォルダを選択します。",
      ko: "브라우저 확장 프로그램 관리 페이지로 이동합니다. 우측 상단의 '개발자 모드'를 켜고, '압축해제된 확장 프로그램을 로드합니다'를 눌러 해제한 폴더를 선택합니다.",
      zh: "打开浏览器插件管理页。开启右上角的“开发者模式”开关，点击“加载已解压的扩展程序”按钮并选择刚才解压出来的文件夹。",
      'zh-TW': "開啟瀏覽器擴充功能管理頁。開啟右上角「開發人員模式」，點擊「載入未壓縮的擴充功能」並選取解壓縮出來的資料夾。",
      vi: "Mở trang quản lý tiện ích trình duyệt. Bật công tắc 'Chế độ nhà phát triển' ở góc trên bên phải. Nhấn 'Tải tiện ích đã giải nén' và chọn thư mục vừa giải nén.",
      th: "เปิดหน้าจัดการส่วนขยาย เปิด 'โหมดนักพัฒนา' ที่มุมขวาบน แล้วกด 'โหลดส่วนขยายที่คลายการบีบอัดแล้ว' พร้อมเลือกโฟลเดอร์ที่แตกไว้",
      hi: "ब्राउज़र एक्सटेंशन पेज खोलें, 'डेवलपर मोड' चालू करें और 'लोड अनपैक्ड' पर क्लिक करके फ़ोल्डर चुनें।",
      fil: "Buksan ang extension manager, i-on ang 'Developer mode', at i-click ang 'Load unpacked' upang piliin ang folder.",
      ms: "Buka halaman pengurusan sambungan, hidupkan 'Developer mode', klik 'Load unpacked' dan pilih folder yang diekstrak tadi.",
    },
    step3Title: {
      en: "Step 3: Pin Extension & Test on Any Form",
      id: "Langkah 3: Sematkan Maskot Telmy & Coba di Formulir",
      ja: "ステップ 3：Telmy をピン留めして任意のフォームで試す",
      ko: "3단계: 툴바에 고정하고 원하는 폼에서 테스트",
      zh: "第 3 步：固定 Telmy 拼图图标并开始测试",
      'zh-TW': "第 3 步：固定 Telmy 圖示並開始體驗表單",
      vi: "Bước 3: Ghim biểu tượng Telmy & Kiểm tra trên biểu mẫu",
      th: "ขั้นตอนที่ 3: ปักหมุด Telmy และทดสอบกับแบบฟอร์มใดก็ได้",
      hi: "चरण 3: Telmy को पिन करें और किसी भी फॉर्म पर आज़माएं",
      fil: "Hakbang 3: I-pin ang Telmy Icon at Subukan sa Form",
      ms: "Langkah 3: Sematkan Ikon Telmy & Uji pada Sebarang Borang",
    },
    step3Desc: {
      en: "Click the Extensions puzzle icon and Pin Telmy.ai. Then open any web form (e.g. passport or visa portal) or open our Interactive Simulator to watch the AI Sidepanel in action!",
      id: "Klik ikon puzzle Ekstensi di bilah atas lalu Pin Telmy.ai. Sekarang buka formulir web apa pun atau buka Simulator Interaktif Telmy untuk melihat AI Sidepanel memandu form!",
      ja: "拡張機能のパズルアイコンをクリックして Telmy.ai をピン留めします。任意の申請フォームまたはシミュレーターを開くと、AI サイドパネルが自動起動します。",
      ko: "퍼즐 아이콘을 눌러 Telmy.ai를 고정합니다. 이제 비자/여권 신청 등 실제 웹 양식이나 시뮬레이터를 열어 AI 어시스턴트를 테스트해보세요!",
      zh: "点击浏览器地址栏旁的拼图图标并固定 Telmy.ai。随后打开任意线上办事表格或使用我们的交互式模拟器，即可体验智能侧边栏！",
      'zh-TW': "點擊網址列旁的拼圖圖示並固定 Telmy.ai。隨後開啟任意線上申請表單或互動式模擬器，立即體驗智慧側邊欄！",
      vi: "Ghim Telmy.ai trên thanh công cụ. Mở bất kỳ trang biểu mẫu nào hoặc Trình giả lập của chúng tôi để trải nghiệm AI!",
      th: "ปักหมุด Telmy.ai บนแถบเครื่องมือ แล้วเปิดแบบฟอร์มเพื่อเริ่มสัมผัสการช่วยเหลือของ AI ได้ทันที",
      hi: "Telmy.ai को पिन करें और किसी भी फॉर्म या सिम्युलेटर पर इसका परीक्षण करें।",
      fil: "I-pin ang Telmy.ai sa toolbar at buksan ang anumang web form upang subukan ang AI.",
      ms: "Sematkan Telmy.ai dan buka mana-mana borang web atau simulator untuk mencuba AI.",
    },
  }

  const getStr = (key: string) => {
    return strings[key]?.[currentLang] || strings[key]?.en || ''
  }

  const getExtensionUrl = () => {
    switch (activeTab) {
      case 'edge':
        return 'edge://extensions'
      case 'firefox':
        return 'about:debugging#/runtime/this-firefox'
      case 'opera':
        return 'opera://extensions'
      default:
        return 'chrome://extensions'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <SEO />
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

          {/* Browser Selection Tabs */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-2xl mx-auto">
            {([
              { id: 'chrome', name: 'Google Chrome', icon: '/chrome.png' },
              { id: 'edge', name: 'Microsoft Edge', icon: '/edge.png' },
              { id: 'firefox', name: 'Mozilla Firefox', icon: '/firefox.png' },
              { id: 'opera', name: 'Opera Browser', icon: '/opera.webp' },
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
                  {b.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1 space-y-8">
        
        {/* Judge / Frictionless Notice */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <span>{getStr('juryNoteTitle')}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-extrabold uppercase">
                Zero Barrier
              </span>
            </h4>
            <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
              {getStr('juryNoteDesc')}
            </p>
          </div>
        </div>

        {/* Primary Action Card: Direct ZIP Download + Web Store roadmap */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 border border-blue-200 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white border border-blue-100 flex items-center justify-center font-bold shadow-md shadow-blue-500/10 p-2.5 shrink-0">
                <FolderArchive className="w-9 h-9 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Telmy Extension for {activeTab.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{getStr('officialStoreBadge')}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <a
                href={activeTab === 'firefox' ? "/telmy-firefox.zip" : "/telmy-extension.zip"}
                download={activeTab === 'firefox' ? "telmy-firefox.zip" : "telmy-chrome-edge.zip"}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                  <DownloadCloud className="w-5 h-5" />
                  <span>{getStr('downloadZipBtn')} ({activeTab === 'firefox' ? 'Firefox' : 'Chromium/Chrome/Edge'})</span>
                </Button>
              </a>

              <a
                href={activeTab === 'firefox' ? "https://addons.mozilla.org" : "https://chromewebstore.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto font-semibold border-slate-300 hover:bg-slate-100 text-slate-700 text-xs py-3">
                  <span>{activeTab === 'firefox' ? 'Firefox Add-ons (Roadmap V2)' : getStr('webStoreBtn')}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-60" />
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* 3 Step Visual Installation Walkthrough */}
        <Card className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              3-Step Installation Guide (Unpacked Method)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these quick steps to load Telmy directly into any Chromium or Firefox browser.
            </p>
          </div>

          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <span className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
              1
            </span>
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">
                {getStr('step1Title')}
              </h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {getStr('step1Desc')}
              </p>
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 font-mono flex items-center gap-2">
                <FolderArchive className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Downloaded file: <strong className="text-slate-800">telmy-extension.zip</strong> (~1.5 MB)</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <span className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
              2
            </span>
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">
                {getStr('step2Title')}
              </h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {getStr('step2Desc')}
              </p>

              {/* Quick URL copy helper */}
              <div className="mt-3.5 p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Browser address:</span>
                  <span className="text-blue-400 font-bold">{getExtensionUrl()}</span>
                </div>
                <button
                  onClick={() => handleCopyUrl(getExtensionUrl())}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied!' : 'Copy URL'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <span className="w-9 h-9 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
              3
            </span>
            <div className="flex-1">
              <h4 className="text-base font-bold text-slate-900">
                {getStr('step3Title')}
              </h4>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                {getStr('step3Desc')}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link to="/#simulator">
                  <Button size="sm" variant="outline" className="text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50">
                    Open Form Simulator Demo →
                  </Button>
                </Link>
                <Link to="/connect">
                  <Button size="sm" variant="ghost" className="text-xs font-semibold text-slate-600 hover:text-slate-900">
                    Test Extension Pairing Page
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

      </main>

      <Footer t={t} />
    </div>
  )
}
