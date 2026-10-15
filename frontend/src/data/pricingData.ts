export interface PricingTierItem {
  id: 'free' | 'standard' | 'pro'
  name: Record<string, string>
  priceIdr: number
  priceUsd: number
  displayPriceIdr: string
  displayPriceUsd: string
  formsQuota: Record<string, string>
  period: Record<string, string>
  rateText: Record<string, string>
  description: Record<string, string>
  isPopular?: boolean
  features: Record<string, string[]>
  ctaBtn: Record<string, string>
}

export const PRICING_TIERS_DATA: PricingTierItem[] = [
  {
    id: 'free',
    name: {
      en: "Free Tier",
      id: "Free Tier",
      ja: "フリープラン",
      ko: "무료 플랜",
      zh: "免费版",
      'zh-TW': "免費版",
      vi: "Gói Miễn Phí",
      th: "แพ็กเกจฟรี",
      hi: "निःशुल्क टियर",
      fil: "Libreng Plano",
      ms: "Pelan Percuma",
    },
    priceIdr: 0,
    priceUsd: 0,
    displayPriceIdr: "Rp 0",
    displayPriceUsd: "$0",
    formsQuota: {
      en: "5 forms / month",
      id: "5 formulir / bulan",
      ja: "毎月 5件まで",
      ko: "월 5개 양식",
      zh: "每月 5 份表单",
      'zh-TW': "每月 5 份表單",
      vi: "5 biểu mẫu / tháng",
      th: "5 แบบฟอร์ม / เดือน",
      hi: "5 फॉर्म / महीना",
      fil: "5 forms / buwan",
      ms: "5 borang / bulan",
    },
    period: {
      en: "forever",
      id: "selamanya",
      ja: "永久無料",
      ko: "평생",
      zh: "永久有效",
      'zh-TW': "永久有效",
      vi: "mãi mãi",
      th: "ตลอดชีพ",
      hi: "आजीवन",
      fil: "magpakailanman",
      ms: "selamanya",
    },
    rateText: {
      en: "Free forever",
      id: "Rp 0 / formulir",
      ja: "完全無料",
      ko: "완전 무료",
      zh: "完全免费",
      'zh-TW': "完全免費",
      vi: "Miễn phí hoàn toàn",
      th: "ฟรีตลอดชีพ",
      hi: "पूरी तरह से निःशुल्क",
      fil: "Libre magpakailanman",
      ms: "Percuma sepenuhnya",
    },
    description: {
      en: "Ideal for casual users who occasionally need help with simple forms or public services.",
      id: "Cocok untuk pengguna kasual yang sesekali mengisi formulir atau dokumen sederhana.",
      ja: "日常の電子申請や公的サービスで手軽に案内を体験したい方に最適です。",
      ko: "가끔씩 간단한 공공 서류나 민원을 작성하는 개인 사용자에게 적합합니다.",
      zh: "适合偶尔需要填写简单公共服务表格的个人用户。",
      'zh-TW': "適合偶爾需要填寫簡單公共服務表格的個人使用者。",
      vi: "Thích hợp cho người dùng thỉnh thoảng điền biểu mẫu công hoặc giấy tờ đơn giản.",
      th: "เหมาะสำหรับผู้ใช้ทั่วไปที่ต้องการความช่วยเหลือในการกรอกแบบฟอร์มง่ายๆ",
      hi: "उन उपयोगकर्ताओं के लिए उपयुक्त जिन्हें कभी-कभार सामान्य फॉर्म भरने होते हैं।",
      fil: "Para sa paminsan-minsang pag-fill out ng mga simpleng dokumento.",
      ms: "Sesuai untuk pengguna yang sekali-sekala mengisi borang atau dokumen biasa.",
    },
    features: {
      en: [
        "5 Form Guidance Credits every month",
        "Automatic monthly quota refresh",
        "All 14 Accessibility Hub Tools (WCAG 2.2 AA)",
        "Universal Web Form & PDF Explainer (up to 3 pages)",
        "1 Local AES-256 Encrypted Smart Vault profile"
      ],
      id: [
        "5 Form Guidance Credits per bulan",
        "Auto-refresh kuota setiap bulan baru",
        "14 Tools Aksesibilitas Lengkap (A11y Hub)",
        "Universal Web Form & PDF Explainer (Maks 3 hal)",
        "1 Profil Smart Vault Lokal Terenkripsi AES-256"
      ],
      ja: [
        "毎月 5件のフォーム入力案内クレジット",
        "月初に自動リフレッシュ（自動更新）",
        "全14種類のアクセシビリティツール完備 (WCAG 2.2)",
        "ウェブフォーム & PDF解説（最大3ページ）",
        "ローカル暗号化スマート保管庫（1プロフィール）"
      ],
      ko: [
        "매월 5회 양식 작성 가이드 크레딧 제공",
        "매월 1일 사용량 자동 리프레시 갱신",
        "14가지 웹 접근성 풀패키지 지원 (WCAG 2.2)",
        "웹 서식 및 PDF 해설 (최대 3페이지)",
        "로컬 AES-256 암호화 스마트 볼트 1개"
      ],
      zh: [
        "每月 5 次官方表单智能辅导额度",
        "每月初自动重置并刷新使用额度",
        "配备全部 14 项无障碍核心工具 (WCAG 2.2)",
        "通用网页与 PDF 文档讲解（上限 3 页）",
        "1 个设备端 AES-256 加密保险库档案"
      ],
      'zh-TW': [
        "每月 5 次官方表單智慧輔導額度",
        "每月初自動重設並刷新使用額度",
        "配備全部 14 項無障礙核心工具 (WCAG 2.2)",
        "通用網頁與 PDF 文件講解（上限 3 頁）",
        "1 個裝置端 AES-256 加密保險庫檔案"
      ],
      vi: [
        "5 lượt hỗ trợ điền biểu mẫu mỗi tháng",
        "Tự động làm mới hạn mức hàng tháng",
        "Trọn bộ 14 công cụ trợ năng truy cập (WCAG 2.2)",
        "Giải thích biểu mẫu web & PDF (tối đa 3 trang)",
        "1 hồ sơ két dữ liệu mã hóa AES-256 cục bộ"
      ],
      th: [
        "เครดิตช่วยเหลือการกรอกแบบฟอร์ม 5 ครั้งต่อเดือน",
        "รีเฟรชโควตาอัตโนมัติในทุกเดือนใหม่",
        "เครื่องมือการเข้าถึงครบทั้ง 14 รายการ (WCAG 2.2)",
        "วิเคราะห์แบบฟอร์มเว็บและ PDF (สูงสุด 3 หน้า)",
        "1 โปรไฟล์ตู้นิรภัยที่เข้ารหัส AES-256 ในเครื่อง"
      ],
      hi: [
        "हर महीने 5 फॉर्म सहायता क्रेडिट",
        "हर महीने स्वतः कोटा रीफ्रेश",
        "सभी 14 सुगम्यता टूल शामिल (WCAG 2.2)",
        "वेब फॉर्म और पीडीएफ स्पष्टीकरण (3 पृष्ठों तक)",
        "1 स्थानीय AES-256 एन्क्रिप्टेड वॉल्ट प्रोफ़ाइल"
      ],
      fil: [
        "5 Form Guidance Credits bawat buwan",
        "Awtomatikong buwanang pag-refresh ng quota",
        "Lahat ng 14 Accessibility Tools (WCAG 2.2 AA)",
        "Web Form at PDF Explainer (hanggang 3 pahina)",
        "1 Lokal na AES-256 Encrypted Smart Vault profile"
      ],
      ms: [
        "5 Kredit Bantuan Borang setiap bulan",
        "Pembaharuan kuota automatik setiap bulan baharu",
        "Semua 14 Alatan Pusat Kebolehcapaian (WCAG 2.2 AA)",
        "Penerangan Borang Web & PDF (sehingga 3 muka surat)",
        "1 Profil Peti Kebal Pintar Disulitkan AES-256 Tempatan"
      ],
    },
    ctaBtn: {
      en: "Start Free",
      id: "Mulai Gratis",
      ja: "無料で始める",
      ko: "무료로 시작",
      zh: "立即免费开始",
      'zh-TW': "立即免費開始",
      vi: "Bắt đầu miễn phí",
      th: "เริ่มต้นฟรี",
      hi: "मुफ्त शुरू करें",
      fil: "Magsimula nang Libre",
      ms: "Mula Percuma",
    },
  },
  {
    id: 'standard',
    name: {
      en: "Standard",
      id: "Standard",
      ja: "スタンダード",
      ko: "스탠다드",
      zh: "标准版",
      'zh-TW': "標準版",
      vi: "Tiêu Chuẩn",
      th: "สแตนดาร์ด",
      hi: "मानक",
      fil: "Standard",
      ms: "Standard",
    },
    priceIdr: 49000,
    priceUsd: 3.00,
    displayPriceIdr: "Rp 49.000",
    displayPriceUsd: "$3",
    formsQuota: {
      en: "25 forms / month",
      id: "25 formulir / bulan",
      ja: "毎月 25件まで",
      ko: "월 25개 양식",
      zh: "每月 25 份表单",
      'zh-TW': "每月 25 份表單",
      vi: "25 biểu mẫu / tháng",
      th: "25 แบบฟอร์ม / เดือน",
      hi: "25 फॉर्म / महीना",
      fil: "25 forms / buwan",
      ms: "25 borang / bulan",
    },
    period: {
      en: "30 days",
      id: "30 hari",
      ja: "30日間",
      ko: "30일",
      zh: "30 天",
      'zh-TW': "30 天",
      vi: "30 ngày",
      th: "30 วัน",
      hi: "30 दिन",
      fil: "30 araw",
      ms: "30 hari",
    },
    rateText: {
      en: "~$0.12 / form",
      id: "Rp 1.960 / form",
      ja: "約 18円 / 件",
      ko: "약 160원 / 건",
      zh: "约 0.85元 / 份",
      'zh-TW': "約 3.8元 / 份",
      vi: "~3.000đ / biểu mẫu",
      th: "~4.2 บาท / ฟอร์ม",
      hi: "~₹10 / फॉर्म",
      fil: "~₱6.8 / form",
      ms: "~RM 0.55 / borang",
    },
    description: {
      en: "Affordable choice for civil service tests, passports, holiday visas, or regular scholarships.",
      id: "Pilihan hemat untuk pendaftar CPNS, paspor, visa liburan, atau formulir beasiswa reguler.",
      ja: "公務員試験、パスポート、観光ビザ、定期的な奨学金申請に最適なエコノミープラン。",
      ko: "공무원 시험, 여권 발급, 여행 비자, 정기 장학금 신청에 가장 알맞은 경제적인 선택.",
      zh: "公职招考、护照申办、旅游签证及常规奖学金申请的高性价比之选。",
      'zh-TW': "公職招考、護照申辦、旅遊簽證及常規獎學金申請的高性價比之選。",
      vi: "Lựa chọn tiết kiệm cho thi công chức, làm hộ chiếu, visa du lịch và học bổng.",
      th: "ตัวเลือกสุดคุ้มสำหรับการสอบราชการ ทำพาสปอร์ต วีซ่าท่องเที่ยว หรือทุนการศึกษา",
      hi: "सरकारी परीक्षाओं, पासपोर्ट, अवकाश वीज़ा या छात्रवृत्ति फॉर्म के लिए किफायती विकल्प।",
      fil: "Makatipid na pagpipilian para sa civil service, pasaporte, at tourist visa.",
      ms: "Pilihan berpatutan untuk peperiksaan awam, pasport, visa percutian, atau biasiswa.",
    },
    features: {
      en: [
        "25 Form Guidance Credits per month",
        "Active for 30 Days (Supports QRIS & Card)",
        "Full Pre-Submission Error Auditor",
        "Universal PDF Explainer up to 15 pages",
        "Save up to 3 Smart Vault profiles",
        "Natural WaveNet Voice TTS guidance"
      ],
      id: [
        "25 Form Guidance Credits per bulan",
        "Aktif 30 Hari (Mendukung QRIS & Virtual Account)",
        "Pre-Submission Error Auditor Lengkap",
        "Universal PDF Explainer hingga 15 halaman",
        "Simpan hingga 3 Profil Pintar di Vault",
        "Dukungan Suara TTS WaveNet Natural"
      ],
      ja: [
        "毎月 25件のフォーム入力案内クレジット",
        "30日間有効（各種カード・QR決済対応）",
        "提出前シグナル事前監査（エラー防止）完備",
        "PDFフォーム解説 最大15ページまで対応",
        "スマート保管庫 最大3プロフィール保存可能",
        "自然な WaveNet 音声読み上げ案内"
      ],
      ko: [
        "매월 25회 양식 작성 가이드 크레딧 제공",
        "30일간 유효 (간편결제 및 카드 지원)",
        "제출 전 종합 신호등 오류 감사 기능 탑재",
        "최대 15페이지 분량의 PDF 양식 분석 지원",
        "스마트 볼트 내 최대 3개 프로필 저장",
        "자연스러운 WaveNet 음성 낭독 가이드"
      ],
      zh: [
        "每月 25 次表单智能申报辅导额度",
        "30 天有效期（支持国际信用卡与快捷支付）",
        "全流程三色信号灯提交前纠错预审",
        "通用 PDF 文档表格解析（上限 15 页）",
        "智能保险库支持保存多达 3 份个人档案",
        "WaveNet 真人级多语种语音朗读指引"
      ],
      'zh-TW': [
        "每月 25 次表單智慧申報輔導額度",
        "30 天有效期限（支援國際信用卡與快捷支付）",
        "全流程三色訊號燈提交前糾錯預審",
        "通用 PDF 文件表格解析（上限 15 頁）",
        "智慧保險庫支援儲存多達 3 份個人檔案",
        "WaveNet 真人級多語種語音朗讀指引"
      ],
      vi: [
        "25 lượt hỗ trợ biểu mẫu mỗi tháng",
        "Có hiệu lực trong 30 ngày",
        "Kiểm định lỗi trước khi nộp toàn diện",
        "Phân tích biểu mẫu PDF lên đến 15 trang",
        "Lưu trữ tối đa 3 hồ sơ trong Smart Vault",
        "Giọng đọc hướng dẫn WaveNet tự nhiên"
      ],
      th: [
        "เครดิตช่วยเหลือการกรอกแบบฟอร์ม 25 ครั้งต่อเดือน",
        "ใช้งานได้ 30 วัน (รองรับการชำระเงินหลากหลาย)",
        "ระบบตรวจสอบความถูกต้องก่อนส่งแบบครบถ้วน",
        "วิเคราะห์แบบฟอร์ม PDF ได้สูงสุด 15 หน้า",
        "บันทึกโปรไฟล์ใน Smart Vault ได้สูงสุด 3 โปรไฟล์",
        "ระบบอ่านออกเสียง WaveNet ที่เป็นธรรมชาติ"
      ],
      hi: [
        "हर महीने 25 फॉर्म मार्गदर्शन क्रेडिट",
        "30 दिनों के लिए वैध",
        "पूर्ण सबमिशन पूर्व त्रुटि ऑडिटर",
        "15 पृष्ठों तक पीडीएफ फॉर्म विश्लेषण",
        "वॉल्ट में 3 प्रोफाइल तक सहेजें",
        "प्राकृतिक WaveNet आवाज टीटीएस मार्गदर्शन"
      ],
      fil: [
        "25 Form Guidance Credits bawat buwan",
        "Aktibo sa loob ng 30 Araw",
        "Kumpletong Pre-Submission Error Auditor",
        "PDF Explainer hanggang 15 pahina",
        "Mag-save ng hanggang 3 Smart Vault profiles",
        "Natural na WaveNet Voice TTS guidance"
      ],
      ms: [
        "25 Kredit Bantuan Borang setiap bulan",
        "Aktif selama 30 Hari",
        "Juruaudit Ralat Pra-Penyerahan Lengkap",
        "Penerangan PDF sehingga 15 muka surat",
        "Simpan sehingga 3 Profil Pintar di Peti Kebal",
        "Bimbingan Suara TTS WaveNet Semula Jadi"
      ],
    },
    ctaBtn: {
      en: "Choose Standard",
      id: "Pilih Standard",
      ja: "スタンダードを選択",
      ko: "스탠다드 선택",
      zh: "选择标准版",
      'zh-TW': "選擇標準版",
      vi: "Chọn Tiêu Chuẩn",
      th: "เลือกสแตนดาร์ด",
      hi: "मानक चुनें",
      fil: "Piliin ang Standard",
      ms: "Pilih Standard",
    },
  },
  {
    id: 'pro',
    name: {
      en: "Pro",
      id: "Pro",
      ja: "プロ (Pro)",
      ko: "프로 (Pro)",
      zh: "Pro 专业版",
      'zh-TW': "Pro 專業版",
      vi: "Gói Pro",
      th: "โปร (Pro)",
      hi: "प्रो (Pro)",
      fil: "Pro Plan",
      ms: "Pelan Pro",
    },
    isPopular: true,
    priceIdr: 99000,
    priceUsd: 7.00,
    displayPriceIdr: "Rp 99.000",
    displayPriceUsd: "$7",
    formsQuota: {
      en: "75 forms / month",
      id: "75 formulir / bulan",
      ja: "毎月 75件まで",
      ko: "월 75개 양식",
      zh: "每月 75 份表单",
      'zh-TW': "每月 75 份表單",
      vi: "75 biểu mẫu / tháng",
      th: "75 แบบฟอร์ม / เดือน",
      hi: "75 फॉर्म / महीना",
      fil: "75 forms / buwan",
      ms: "75 borang / bulan",
    },
    period: {
      en: "30 days",
      id: "30 hari",
      ja: "30日間",
      ko: "30일",
      zh: "30 天",
      'zh-TW': "30 天",
      vi: "30 ngày",
      th: "30 วัน",
      hi: "30 दिन",
      fil: "30 araw",
      ms: "30 hari",
    },
    rateText: {
      en: "~$0.09 / form",
      id: "Rp 1.320 / form",
      ja: "約 14円 / 件",
      ko: "약 120원 / 건",
      zh: "约 0.65元 / 份",
      'zh-TW': "約 2.9元 / 份",
      vi: "~2.000đ / biểu mẫu",
      th: "~3.1 บาท / ฟอร์ม",
      hi: "~₹7.5 / फॉर्म",
      fil: "~₱5.1 / form",
      ms: "~RM 0.40 / borang",
    },
    description: {
      en: "Most popular! Best for international scholarship applicants, work/study visas, and intensive apostille declarations.",
      id: "Paling populer! Terbaik untuk pelamar beasiswa luar negeri, visa kerja/studi, dan apostille intensif.",
      ja: "一番人気！海外留学奨学金、就労・留学ビザ、アポスティーユ認証などの集中的な手続きに最適。",
      ko: "가장 인기 있는 플랜! 해외 장학금, 취업·유학 비자, 아포스티유 인증 등 집중적인 작성에 최적화.",
      zh: "最受欢迎方案！海外留学奖学金申请者、工签学签办理及涉外公证申报的不二之选。",
      'zh-TW': "最受歡迎方案！海外留學獎學金申請者、工簽學簽辦理及涉外公證申報的不二之選。",
      vi: "Phổ biến nhất! Dành cho người xin học bổng du học, visa lao động/du học và hợp pháp hóa lãnh sự.",
      th: "ยอดนิยมที่สุด! เหมาะสำหรับผู้สมัครทุนต่างประเทศ วีซ่าทำงานหรือเรียนต่อ และการรับรองเอกสาร",
      hi: "सबसे लोकप्रिय! अंतरराष्ट्रीय छात्रवृत्ति, कार्य/अध्ययन वीज़ा और महत्वपूर्ण दस्तावेजों के लिए सर्वोत्तम।",
      fil: "Pinakasikat! Tamang-tama para sa scholarship sa ibang bansa at work/study visa.",
      ms: "Paling popular! Terbaik untuk pemohon biasiswa luar negara, visa kerja/belajar, dan pengesahan intensif.",
    },
    features: {
      en: [
        "75 Form Guidance Credits per month",
        "Gemini 3.5 Flash-Lite High Priority Processing",
        "Unlimited Voice WaveNet Lip-Sync Mascot Guidance",
        "Universal PDF Explainer up to 50 pages",
        "10 Multi-Member Profiles (Family & Colleagues)",
        "Advanced Pre-Submission Form & Cross-Field Auditor"
      ],
      id: [
        "75 Form Guidance Credits per bulan",
        "Prioritas Pemrosesan Gemini 3.5 Flash-Lite",
        "Unlimited Voice WaveNet Lip-Sync Mascot",
        "Universal PDF Explainer hingga 50 halaman",
        "10 Profil Multi-Anggota (Keluarga / Rekan)",
        "Pre-Submission Form Auditor Lanjutan"
      ],
      ja: [
        "毎月 75件のフォーム入力案内クレジット",
        "Gemini 3.5 Flash-Lite 最優先 AI 処理キュー",
        "無制限の WaveNet リップシンクマスコット音声案内",
        "PDFフォーム解説 最大50ページまで対応",
        "複数メンバー管理（家族・同僚など最大10名）",
        "高度な提出前クロスフィールド総合エラー監査"
      ],
      ko: [
        "매월 75회 양식 작성 가이드 크레딧 제공",
        "Gemini 3.5 Flash-Lite 최우선 AI 고속 처리",
        "무제한 WaveNet 립싱크 마스코트 음성 지원",
        "대용량 PDF 서식 분석 (최대 50페이지)",
        "10인 가족 및 동료 다중 프로필 관리",
        "고급 교차 검증 제출 전 서식 정밀 감사"
      ],
      zh: [
        "每月 75 次表单深度辅导额度",
        "Gemini 3.5 Flash-Lite 极速高优先级 AI 推理",
        "无限量 WaveNet 口型同步语音交互陪伴",
        "大容量 PDF 表格文档解析（上限 50 页）",
        "支持多达 10 份家庭成员或同伴档案管理",
        "高级跨字段逻辑比对与提交前终审"
      ],
      'zh-TW': [
        "每月 75 次表單深度輔導額度",
        "Gemini 3.5 Flash-Lite 極速高優先級 AI 推理",
        "無限量 WaveNet 口型同步語音互動陪伴",
        "大容量 PDF 表格文件解析（上限 50 頁）",
        "支援多達 10 份家庭成員或同伴檔案管理",
        "高級跨欄位邏輯比對與提交前終審"
      ],
      vi: [
        "75 lượt hỗ trợ biểu mẫu mỗi tháng",
        "Ưu tiên xử lý cao nhất với Gemini 3.5 Flash-Lite",
        "Không giới hạn giọng đọc WaveNet khớp khẩu hình",
        "Phân tích tài liệu PDF dày lên đến 50 trang",
        "Quản lý 10 hồ sơ thành viên (Gia đình / Đồng nghiệp)",
        "Kiểm định chéo nâng cao trước khi nộp đơn"
      ],
      th: [
        "เครดิตช่วยเหลือการกรอกแบบฟอร์ม 75 ครั้งต่อเดือน",
        "ประมวลผลด่วนพิเศษด้วย Gemini 3.5 Flash-Lite",
        "เสียงอ่าน WaveNet ไม่จำกัดพร้อมแอนิเมชันมาสคอต",
        "วิเคราะห์เอกสาร PDF หนาสูงสุด 50 หน้า",
        "จัดการข้อมูลได้ 10 โปรไฟล์ (ครอบครัวและเพื่อนร่วมงาน)",
        "ระบบตรวจสอบข้อผิดพลาดข้ามช่องขั้นสูงก่อนส่ง"
      ],
      hi: [
        "हर महीने 75 फॉर्म मार्गदर्शन क्रेडिट",
        "Gemini 3.5 Flash-Lite प्राथमिकता प्रसंस्करण",
        "असीमित WaveNet आवाज लिप-सिंक शुभंकर मार्गदर्शन",
        "50 पृष्ठों तक विस्तृत पीडीएफ विश्लेषण",
        "10 सदस्यों के प्रोफाइल (परिवार और सहकर्मी)",
        "उन्नत क्रॉस-फ़ील्ड प्री-सबमिशन ऑडिटर"
      ],
      fil: [
        "75 Form Guidance Credits bawat buwan",
        "Mabilis na priority AI processing gamit ang Gemini",
        "Unlimited WaveNet mascot voice guidance",
        "Pagsusuri ng PDF form hanggang 50 pahina",
        "10 Multi-Member Profiles para sa pamilya o kasama",
        "Advanced Pre-Submission Form & Cross-Field Auditor"
      ],
      ms: [
        "75 Kredit Bantuan Borang setiap bulan",
        "Keutamaan Pemprosesan Gemini 3.5 Flash-Lite",
        "Bimbingan Suara WaveNet Maskot Tanpa Had",
        "Penerangan PDF sehingga 50 muka surat",
        "10 Profil Pelbagai Ahli (Keluarga / Rakan sekerja)",
        "Juruaudit Ralat Silang Lanjutan Pra-Penyerahan"
      ],
    },
    ctaBtn: {
      en: "Choose Pro",
      id: "Pilih Pro",
      ja: "プロを選択",
      ko: "프로 선택",
      zh: "选择 Pro 专业版",
      'zh-TW': "選擇 Pro 專業版",
      vi: "Chọn gói Pro",
      th: "เลือกแพ็กเกจโปร",
      hi: "प्रो चुनें",
      fil: "Piliin ang Pro",
      ms: "Pilih Pro",
    },
  },
]
