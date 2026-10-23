import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TranslationData } from '@/data/translations'
import { useLanguage } from '@/context/LanguageContext'
import { JAPAC_LANGUAGES } from '@/data/languages'
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  ListOrdered,
  Bot,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  Focus,
  BookOpen,
  Info,
  HelpCircle,
  ArrowRight,
  Send
} from 'lucide-react'

interface SimulatorProps {
  t: TranslationData
}

type SidepanelMainTab = 'chat' | 'fields' | 'vault' | 'a11y'

interface ChatMessage {
  sender: 'ai' | 'user'
  text: string
  actionChip?: string
}

interface AuditFieldResult {
  status: 'valid' | 'warning' | 'error'
  label: string
  message: string
}

export const Simulator: React.FC<SimulatorProps> = ({ t }) => {
  const { lang: globalLang } = useLanguage()

  // Simulator Extension Local Language (does not change the entire website)
  const [simLang, setSimLang] = useState<string>(globalLang || 'id')

  // Form Inputs State
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [passport, setPassport] = useState('')
  const [activeInputFocus, setActiveInputFocus] = useState<number>(1)

  // Sidepanel Core State
  const [activeTab, setActiveTab] = useState<SidepanelMainTab>('chat')
  const [chatMode, setChatMode] = useState<'chat' | 'voice'>('chat')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)

  // Guided Stepper (Forms Guide)
  const [guidedStep, setGuidedStep] = useState<number>(1)
  const [hasRunAudit, setHasRunAudit] = useState<boolean>(false)

  // Vault State
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false)
  const [masterPassword, setMasterPassword] = useState('')

  // A11y States
  const [activePreset, setActivePreset] = useState<'none' | 'adhd' | 'dyslexia' | 'lowvision' | 'senior'>('none')
  const [isSpotlight, setIsSpotlight] = useState(false)
  const [isDyslexia, setIsDyslexia] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isLargeText, setIsLargeText] = useState(false)
  const [isLineSpacing, setIsLineSpacing] = useState(false)

  // Quick Questions dictionary for all supported languages (2 questions each, no privacy question)
  const QUICK_QUESTIONS_MAP: Record<string, string[]> = {
    id: ['Jelaskan apa itu NIK & Formatnya?', 'Berapa syarat masa aktif Paspor?'],
    en: ['What is the National ID (NIK) format?', 'What is the 6-Month Passport rule?'],
    ja: ['マイナンバー／国家IDの形式とは？', 'パスポートの残存有効期間6ヶ月ルールとは？'],
    ko: ['주민등록번호/국가 ID 형식은 무엇인가요?', '여권 유효기간 6개월 규정이란?'],
    zh: ['请解释身份证号码（NIK）及格式要求？', '护照6个月有效期规则是什么？'],
    'zh-TW': ['請解釋國民身分證號（NIK）及格式要求？', '護照6個月有效期限規定是什麼？'],
    vi: ['Giải thích số định danh (NIK) và định dạng?', 'Quy tắc hộ chiếu còn hạn 6 tháng là gì?'],
    th: ['อธิบายรูปแบบเลขประจำตัวประชาชน (NIK)?', 'กฎอายุการใช้งานหนังสือเดินทาง 6 เดือนคืออะไร?'],
    hi: ['राष्ट्रीय पहचान (NIK) प्रारूप क्या है?', 'पासपोर्ट का 6 महीने की वैधता नियम क्या है?'],
    fil: ['Ano ang format ng National ID (NIK)?', 'Ano ang 6-buwang patakaran sa Pasaporte?'],
    ms: ['Apakah format Nombor Pengenalan (NIK)?', 'Apakah syarat sah laku 6 bulan Pasport?']
  }

  const quickQuestions = QUICK_QUESTIONS_MAP[simLang] || QUICK_QUESTIONS_MAP['en']

  // Welcome greeting per language
  const WELCOME_GREETINGS: Record<string, string> = {
    id: 'Halo! Saya Telmy AI. Saya mendampingi formulir izin tinggal & visa ini. Pilih pertanyaan di bawah untuk penjelasan instan.',
    en: 'Hello! I am Telmy AI. I am assisting with this official application. Select any prompt below for instant plain-language guidance.',
    ja: 'こんにちは！Telmy AIです。このビザ・滞在許可申請書を分かりやすくサポートします。下の質問を選んで即座に案内を確認できます。',
    ko: '안녕하세요! Telmy AI입니다. 비자 및 체류 허가 신청서를 실시간으로 도와드립니다. 아래 질문을 선택해 바로 확인해 보세요.',
    zh: '您好！我是 Telmy AI。我将协助您填写此居留许可与签证表格。点击下方问题即可获取即时通俗解读。',
    'zh-TW': '您好！我是 Telmy AI。我將協助您填寫此居留許可與簽證申請表。點擊下方問題即可獲取即時通俗說明。',
    vi: 'Xin chào! Tôi là Telmy AI. Tôi hỗ trợ điền mẫu đơn xin thị thực & cư trú này. Chọn câu hỏi bên dưới để được hướng dẫn tức thì.',
    th: 'สวัสดี! ฉันคือ Telmy AI พร้อมช่วยเหลือการกรอกแบบฟอร์มขอวีซ่าและใบอนุญาตพำนัก เลือกคำถามด้านล่างเพื่อดูคำแนะนำทันที',
    hi: 'नमस्ते! मैं Telmy AI हूँ। मैं इस वीज़ा और निवास परमिट फ़ॉर्म को भरने में आपकी सहायता कर रहा हूँ। तुरंत मार्गदर्शन के लिए नीचे दिए गए प्रश्न चुनें।',
    fil: 'Kamusta! Ako si Telmy AI. Ginagabayan kita sa form ng visa at permit na ito. Pumili ng tanong sa ibaba para sa agarang tulong.',
    ms: 'Halo! Saya Telmy AI. Saya membantu mengisi borang permit kediaman & visa ini. Pilih soalan di bawah untuk bimbingan segera.'
  }

  // Chatbot Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: WELCOME_GREETINGS[simLang] || WELCOME_GREETINGS['en'],
    },
  ])

  // Sync welcome message if simulator extension language switches
  React.useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: WELCOME_GREETINGS[simLang] || WELCOME_GREETINGS['en'],
      },
    ])
  }, [simLang])

  // Handle Quick Chat Prompt with full multi-language responses
  const handlePromptClick = (question: string) => {
    const userMsg: ChatMessage = { sender: 'user', text: question }
    let reply = ''
    let chip = ''

    const isNikQuestion =
      question.includes('NIK') ||
      question.includes('National ID') ||
      question.includes('マイナンバー') ||
      question.includes('주민등록') ||
      question.includes('身份证') ||
      question.includes('身分證') ||
      question.includes('định danh') ||
      question.includes('ประจำตัว') ||
      question.includes('राष्ट्रीय पहचान')

    if (isNikQuestion) {
      const nikReplies: Record<string, string> = {
        id: 'NIK (Nomor Induk Kependudukan) terdiri dari 16 digit angka resmi KTP tanpa spasi atau tanda hubung (-). Digit 7-12 mencerminkan tanggal lahir Anda.',
        en: 'National Identification (NIK) requires 16 numeric digits matching your government identity document without hyphens or spaces.',
        ja: '国家身分証番号（NIK/ID）は、ハイフンやスペース抜きの16桁の公式数字です。第7〜12桁は生年月日を表しています。',
        ko: '국가 식별 번호(NIK/ID)는 하이픈이나 공백 없이 16자리 공식 숫자로 입력해야 합니다. 7~12번째 자리는 생년월일을 나타냅니다.',
        zh: '国民身份证号码（NIK）由16位官方纯数字组成，无需输入空格或连字符（-）。第7至12位代表出生日期。',
        'zh-TW': '國民身分證號（NIK）由16位官方純數字組成，無需輸入空格或連字號（-）。第7至12位代表出生日期。',
        vi: 'Mã số định danh (NIK) gồm đúng 16 chữ số theo giấy tờ tùy thân, không có dấu gạch ngang hay dấu cách.',
        th: 'หมายเลขประจำตัว (NIK) ประกอบด้วยตัวเลขทางการ 16 หลักโดยไม่ต้องเว้นวรรคหรือใส่เครื่องหมายขีดคั่น (-)',
        hi: 'राष्ट्रीय पहचान संख्या (NIK) में बिना किसी स्पेस या हाइफ़न के 16 आधिकारिक अंक होने चाहिए।',
        fil: 'Ang National ID (NIK) ay binubuo ng 16 na digit na numero mula sa opisyal na ID nang walang espasyo o gitling (-).',
        ms: 'Nombor Pengenalan (NIK) mengandungi 16 digit nombor rasmi tanpa ruang atau tanda sempang (-).'
      }
      reply = nikReplies[simLang] || nikReplies['en']
      chip = simLang === 'id' ? 'Buka Panduan Kolom #2' : simLang === 'ja' ? '項目2の解説を見る' : simLang === 'ko' ? '2번 항목 안내 보기' : simLang === 'zh' ? '查看第2栏指南' : 'View Field #2 Guide'
    } else {
      // Passport question
      const passReplies: Record<string, string> = {
        id: 'Untuk visa dan izin tinggal resmi internasional, paspor Anda wajib memiliki sisa masa berlaku minimal 6 bulan saat tanggal keberangkatan.',
        en: 'For international visas and stay permits, your passport must have at least 6 months of validity remaining from the intended departure date.',
        ja: '国際ビザや滞在許可の申請では、出国予定日から最低6ヶ月以上のパスポート残存有効期間が必須です。',
        ko: '국제 비자 및 체류 허가의 경우, 출국 예정일 기준으로 여권 잔여 유효기간이 최소 6개월 이상 남아있어야 합니다.',
        zh: '对于国际签证及官方居留许可，您的护照在计划出发日期时必须至少拥有6个月以上的剩余有效期。',
        'zh-TW': '對於國際簽證及官方居留許可，您的護照在預計出發日期時必須至少具備6個月以上的剩餘效期。',
        vi: 'Đối với thị thực và giấy phép cư trú quốc tế, hộ chiếu của bạn phải còn thời hạn tối thiểu 6 tháng kể từ ngày khởi hành.',
        th: 'สำหรับการขอวีซ่าและใบอนุญาตพำนักสากล หนังสือเดินทางของคุณต้องมีอายุการใช้งานคงเหลืออย่างน้อย 6 เดือนนับจากวันเดินทาง',
        hi: 'अंतर्राष्ट्रीय वीज़ा और निवास परमिट के लिए आपके पासपोर्ट की शेष वैधता यात्रा तिथि से कम से कम 6 महीने होनी चाहिए।',
        fil: 'Para sa mga internasyonal na visa at permit, ang iyong pasaporte ay dapat may natitirang bisa na hindi bababa sa 6 na buwan bago ang petsa ng pag-alis.',
        ms: 'Bagi visa dan permit kediaman antarabangsa, pasport anda wajib mempunyai tempoh sah sekurang-kurangnya 6 bulan sebelum tarikh pelepasan.'
      }
      reply = passReplies[simLang] || passReplies['en']
      chip = simLang === 'id' ? 'Buka Panduan Kolom #3' : simLang === 'ja' ? '項目3の解説を見る' : simLang === 'ko' ? '3번 항목 안내 보기' : simLang === 'zh' ? '查看第3栏指南' : 'View Field #3 Guide'
    }

    setMessages((prev) => [...prev, userMsg])
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: reply, actionChip: chip }])
    }, 300)
  }

  // Handle 1-Click AutoFill
  const handlePerformAutofill = () => {
    setFullName('Alexander Christopher Ward')
    setIdNumber('3201241995080004')
    setPassport('X84910284')
    setHasRunAudit(false)
  }

  // Handle Speech Voice Playback
  const handleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        window.speechSynthesis.cancel()
        const textMap: Record<string, string> = {
          id: 'Panduan formulir resmi: Kolom satu, nama lengkap resmi sesuai paspor. Kolom dua, nomor NIK enam belas digit. Kolom tiga, nomor paspor internasional.',
          en: 'Official Form Guidance: Field one, full legal name as in passport. Field two, sixteen-digit national identification. Field three, international passport document.',
          ja: '公式申請フォームの案内：項目1、パスポート記載通りの氏名。項目2、16桁の国家身分証番号。項目3、パスポート番号。',
          ko: '공식 신청서 안내: 1번 항목 여권상 영문 성명, 2번 항목 16자리 국가 식별 번호, 3번 항목 국제 여권 번호입니다.',
          zh: '官方表格指南：第一栏，护照官方全名。第二栏，十六位国民身份识别码。第三栏，国际护照号码。',
          'zh-TW': '官方表格指南：第一欄，護照官方全名。第二欄，十六位國民身分識別碼。第三欄，國際護照號碼。'
        }
        const text = textMap[simLang] || textMap['en']
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = simLang === 'id' ? 'id-ID' : simLang === 'ja' ? 'ja-JP' : simLang === 'ko' ? 'ko-KR' : simLang === 'zh' ? 'zh-CN' : 'en-US'
        utter.onend = () => setIsSpeaking(false)
        utter.onerror = () => setIsSpeaking(false)
        setIsSpeaking(true)
        window.speechSynthesis.speak(utter)
      }
    } else {
      setIsSpeaking((p) => !p)
    }
  }

  // A11y Presets
  const applyPreset = (preset: 'adhd' | 'dyslexia' | 'lowvision' | 'senior') => {
    if (activePreset === preset) {
      setActivePreset('none')
      setIsSpotlight(false)
      setIsDyslexia(false)
      setIsHighContrast(false)
      setIsLargeText(false)
      setIsLineSpacing(false)
      return
    }

    setActivePreset(preset)
    if (preset === 'adhd') {
      setIsSpotlight(true)
      setIsLineSpacing(true)
      setIsDyslexia(false)
      setIsHighContrast(false)
    } else if (preset === 'dyslexia') {
      setIsDyslexia(true)
      setIsLineSpacing(true)
      setIsSpotlight(false)
    } else if (preset === 'lowvision') {
      setIsHighContrast(true)
      setIsLargeText(true)
      setIsSpotlight(false)
    } else if (preset === 'senior') {
      setIsLargeText(true)
      setIsLineSpacing(true)
      handleSpeech()
    }
  }

  // Real Dynamic Audit Evaluation with full multi-language messages
  const getAuditResults = (): AuditFieldResult[] => {
    const results: AuditFieldResult[] = []

    const labels = {
      f1: simLang === 'id' ? '1. Nama Lengkap' : simLang === 'ja' ? '1. 氏名（パスポート通り）' : simLang === 'ko' ? '1. 성명 (여권 기준)' : simLang === 'zh' ? '1. 官方全名' : simLang === 'zh-TW' ? '1. 官方全名' : '1. Full Legal Name',
      f2: simLang === 'id' ? '2. NIK / KTP' : simLang === 'ja' ? '2. 国家ID（NIK）' : simLang === 'ko' ? '2. 국가 식별 번호 (NIK)' : simLang === 'zh' ? '2. 身份证号 (NIK)' : simLang === 'zh-TW' ? '2. 身分證號 (NIK)' : '2. National ID',
      f3: simLang === 'id' ? '3. Paspor Internasional' : simLang === 'ja' ? '3. パスポート番号' : simLang === 'ko' ? '3. 여권 번호' : simLang === 'zh' ? '3. 国际护照' : simLang === 'zh-TW' ? '3. 國際護照' : '3. Passport Document'
    }

    // 1. Full Legal Name
    if (!fullName.trim()) {
      results.push({
        status: 'error',
        label: labels.f1,
        message:
          simLang === 'id'
            ? 'Kolom masih kosong. Wajib diisi sesuai dokumen paspor.'
            : simLang === 'ja'
            ? '未入力です。パスポートの表記通りに入力してください。'
            : simLang === 'ko'
            ? '항목이 비어 있습니다. 여권과 동일하게 입력해야 합니다.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '此栏为空。必须严格按照护照上的姓名填写。'
            : 'Field is empty. Required as printed on passport.',
      })
    } else if (/[,.]|\b(dr|prof|phd|ir|s\.t|s\.kom|sh|se|m\.sc)\b/i.test(fullName)) {
      results.push({
        status: 'warning',
        label: labels.f1,
        message:
          simLang === 'id'
            ? 'Terdeteksi potensi gelar/singkatan. Pastikan bersih tanpa gelar akademis.'
            : simLang === 'ja'
            ? '敬称や学位の略称が検出されました。パスポートの表記と完全に一致させてください。'
            : simLang === 'ko'
            ? '학위나 직함이 감지되었습니다. 여권상 이름만 정확히 입력해 주세요.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '检测到可能的头衔或缩写。请确保无多余学术头衔，严格与护照一致。'
            : 'Potential title or abbreviation detected. Ensure exact passport match.',
      })
    } else {
      results.push({
        status: 'valid',
        label: labels.f1,
        message:
          simLang === 'id'
            ? 'Format nama legal valid tanpa karakter terlarang.'
            : simLang === 'ja'
            ? '禁止文字のない有効な氏名フォーマットです。'
            : simLang === 'ko'
            ? '특수문자 없는 올바른 영문 성명 형식입니다.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '姓名格式正确，无禁止字符。'
            : 'Valid legal name format without prohibited characters.',
      })
    }

    // 2. National ID (NIK)
    const cleanId = idNumber.replace(/\s+/g, '')
    if (!cleanId) {
      results.push({
        status: 'error',
        label: labels.f2,
        message:
          simLang === 'id'
            ? 'Kolom NIK masih kosong. Wajib 16 digit angka resmi.'
            : simLang === 'ja'
            ? '国家IDが未入力です。公式の16桁の数字が必要です。'
            : simLang === 'ko'
            ? '식별 번호가 비어 있습니다. 16자리 숫자여야 합니다.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '身份证号码为空。必须是16位纯数字。'
            : 'National ID field is empty. Must be 16 numeric digits.',
      })
    } else if (!/^\d+$/.test(cleanId) || cleanId.length !== 16) {
      results.push({
        status: 'error',
        label: labels.f2,
        message:
          simLang === 'id'
            ? `Format tidak sesuai (${cleanId.length} digit). Wajib tepat 16 angka tanpa huruf.`
            : simLang === 'ja'
            ? `無効な桁数です（${cleanId.length}桁）。文字なしの16桁の数字である必要があります。`
            : simLang === 'ko'
            ? `형식이 올바르지 않습니다 (${cleanId.length}자리). 정확히 16자리 숫자여야 합니다.`
            : simLang === 'zh' || simLang === 'zh-TW'
            ? `位数不符（当前 ${cleanId.length} 位）。必须为16位纯数字且不含字母。`
            : `Invalid length (${cleanId.length} digits). Must be exactly 16 numeric digits.`,
      })
    } else {
      results.push({
        status: 'valid',
        label: labels.f2,
        message:
          simLang === 'id'
            ? '16 digit angka resmi terverifikasi valid.'
            : simLang === 'ja'
            ? '16桁の公式IDが確認されました。'
            : simLang === 'ko'
            ? '16자리 식별 번호가 유효하게 확인되었습니다.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '16位官方身份证号验证有效。'
            : 'Verified 16-digit national identification code.',
      })
    }

    // 3. Passport
    const cleanPass = passport.replace(/\s+/g, '')
    if (!cleanPass) {
      results.push({
        status: 'error',
        label: labels.f3,
        message:
          simLang === 'id'
            ? 'Nomor paspor masih kosong.'
            : simLang === 'ja'
            ? 'パスポート番号が未入力です。'
            : simLang === 'ko'
            ? '여권 번호가 비어 있습니다.'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '护照号码为空。'
            : 'Passport document number is empty.',
      })
    } else if (cleanPass.length < 7) {
      results.push({
        status: 'warning',
        label: labels.f3,
        message:
          simLang === 'id'
            ? 'Nomor paspor terlalu pendek (umumnya 8–9 karakter alfanumerik).'
            : simLang === 'ja'
            ? '番号が短すぎます（通常は8〜9桁の英数字）。'
            : simLang === 'ko'
            ? '번호가 너무 짧습니다 (보통 8~9자리 영숫자).'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '护照号码过短（通常为8至9位字母及数字组合）。'
            : 'Passport number seems too short (typically 8–9 alphanumeric characters).',
      })
    } else {
      results.push({
        status: 'valid',
        label: labels.f3,
        message:
          simLang === 'id'
            ? 'Nomor paspor valid dengan masa aktif mencukupi (>6 bulan).'
            : simLang === 'ja'
            ? '有効なパスポート番号です（残存期間6ヶ月以上確認）。'
            : simLang === 'ko'
            ? '유효한 여권 번호입니다 (유효기간 6개월 이상 요건 충족).'
            : simLang === 'zh' || simLang === 'zh-TW'
            ? '护照号码有效，且满足6个月以上有效期要求。'
            : 'Valid passport format with sufficient validity period (>6 months).',
      })
    }

    return results
  }

  const auditResults = getAuditResults()
  const overallAuditStatus = auditResults.some((r) => r.status === 'error')
    ? 'error'
    : auditResults.some((r) => r.status === 'warning')
    ? 'warning'
    : 'valid'

  // Forms Guide Data with multi-language titles and descriptions
  const getFieldTitles = () => {
    switch (simLang) {
      case 'id':
        return {
          f1: 'Nama Lengkap Sesuai Paspor',
          f2: 'Nomor Induk Kependudukan (NIK)',
          f3: 'Nomor Buku Paspor Internasional',
          m1: 'Pihak imigrasi dan universitas mencocokkan identitas pemohon dengan data machine-readable zone (MRZ) paspor internasional.',
          h1: 'Ketik huruf persis seperti urutan nama di paspor. Jangan menambahkan gelar (dr., S.T., Ph.D.) atau tanda baca koma.',
          err1: 'Menulis nama panggilan, membalik urutan nama marga yang tidak sesuai paspor, atau menyertakan gelar kesarjanaan.',
          n1: 'Jika paspor Anda hanya memiliki satu suku kata nama, tuliskan nama tersebut di kolom ini.',
          m2: 'Nomor identitas unik tunggal 16 angka dari catatan sipil nasional untuk verifikasi keabsahan kewarganegaraan pemohon.',
          h2: 'Masukkan 16 angka tanpa spasi, titik, atau tanda hubung (-). Enam digit di tengah (digit 7–12) adalah tanggal lahir Anda.',
          err2: 'Menyisipkan tanda strip (-) dari format cetak KTP atau salah memasukkan tanggal lahir.',
          n2: 'Pastikan NIK masih aktif di data kependudukan Dukcapil setempat.',
          m3: 'Nomor seri identifikasi buku paspor aktif yang menjadi dasar penerbitan visa atau izin tinggal resmi.',
          h3: 'Ketik satu huruf seri paspor diikuti kombinasi angka (umumnya 8–9 karakter alfanumerik) dengan huruf besar.',
          err3: 'Menggunakan paspor lama yang sudah habis masa berlakunya, atau sisa masa berlaku kurang dari 6 bulan.',
          n3: 'Hampir seluruh negara menolak permohonan visa jika paspor tersisa kurang dari 6 bulan.'
        }
      case 'ja':
        return {
          f1: 'パスポート記載の氏名（英文）',
          f2: '国家身分証番号（NIK / ID）',
          f3: '国際パスポート旅券番号',
          m1: '入国管理局および査証機関は、国際パスポートの機械読取領域（MRZ）と照合して身元を確認します。',
          h1: 'パスポートに印字されている順序通りに入力してください。博士号や敬称、カンマ記号は含めないでください。',
          err1: '通称名の入力、パスポートと異なる姓名順、学位表記の混入。',
          n1: '単一の氏名のみをお持ちの場合は、その名前をそのまま入力してください。',
          m2: '市民登録および本人確認のための16桁の公式個人識別番号です。',
          h2: 'スペースやハイフンを含めずに16桁の数字を入力してください。',
          err2: '印刷表記のハイフン（-）を混入させたり、生年月日の数字を誤入力すること。',
          n2: '国家身分証データベースで有効状態であることを確認してください。',
          m3: '国際査証および滞在許可証の発行根拠となる有効なパスポートの固有番号です。',
          h3: '旅券番号の英字1文字に続けて数字（通常8〜9桁）を大文字で入力します。',
          err3: '失効した旧パスポート番号の入力、または残存期間が6ヶ月未満の旅券の使用。',
          n3: '渡航先国の多くは、残存有効期間が6ヶ月未満の旅券での査証発給を拒否します。'
        }
      case 'ko':
        return {
          f1: '여권상 영문 성명 (Passport Match)',
          f2: '국가 식별 번호 (NIK / ID)',
          f3: '국제 여권 번호 (Passport Number)',
          m1: '이민국 및 공식 기관은 국제 여권의 기계판독영역(MRZ)과 대조하여 신청인 신원을 확인합니다.',
          h1: '여권에 인쇄된 순서대로 정확히 입력하세요. 학위나 직함(Dr., Ph.D.) 및 쉼표는 제외합니다.',
          err1: '별칭 입력, 여권과 다른 성/이름 순서 반전, 학위 약어 포함.',
          n1: '여권에 단일 이름만 기재된 경우 해당 이름을 그대로 기입하세요.',
          m2: '신청인의 국적 및 신원을 검증하기 위한 16자리 고유 국가 식별 코드입니다.',
          h2: '공백이나 하이픈(-) 없이 16자리 숫자를 입력하세요.',
          err2: '하이픈(-)을 포함하거나 생년월일 위치 번호를 오기입하는 경우.',
          n2: '주민등록 데이터베이스에 정상 등록된 유효한 번호여야 합니다.',
          m3: '사증(비자) 및 공식 체류 허가증 발급의 기준이 되는 유효한 여권 일련번호입니다.',
          h3: '여권 일련 영문 기호와 숫자를 대문자로 결합하여 입력합니다 (보통 8~9자리).',
          err3: '만료된 여권 번호 사용 또는 출국일 기준 잔여 유효기간 6개월 미만 여권 사용.',
          n3: '거의 모든 국가에서 잔여 유효기간이 6개월 미만인 여권의 비자 신청을 반려합니다.'
        }
      case 'zh':
      case 'zh-TW':
        return {
          f1: simLang === 'zh' ? '护照官方全名（英文）' : '護照官方全名（英文）',
          f2: simLang === 'zh' ? '国民身份证号码 (NIK / ID)' : '國民身分證號 (NIK / ID)',
          f3: simLang === 'zh' ? '国际护照证件号码' : '國際護照證件號碼',
          m1: simLang === 'zh' ? '移民局与官方机构通过国际护照机读码（MRZ）比对核实申请人法定身份。' : '移民局與官方機構透過國際護照機讀碼（MRZ）比對核實申請人法定身分。',
          h1: simLang === 'zh' ? '请严格按照护照上的字母顺序填写。切勿添加学术头衔（如Dr.、Ph.D.）或逗号。' : '請嚴格按照護照上的字母順序填寫。切勿加入學術頭銜（如Dr.、Ph.D.）或逗號。',
          err1: simLang === 'zh' ? '填写昵称、颠倒姓氏顺序、或附带学位缩写。' : '填寫暱稱、顛倒姓氏順序、或附帶學位縮寫。',
          n1: simLang === 'zh' ? '如果您的护照上仅有单名，请直接在姓名栏填写该名称。' : '如果您的護照上僅有單名，請直接在姓名欄填寫該名稱。',
          m2: simLang === 'zh' ? '用于验证申请人官方国籍与公民身份的唯一16位数字识别码。' : '用於驗證申請人官方國籍與公民身分的唯一16位數字識別碼。',
          h2: simLang === 'zh' ? '输入16位数字，不得包含空格或破折号（-）。' : '輸入16位數字，不得包含空格或破折號（-）。',
          err2: simLang === 'zh' ? '复制证件上的连接号（-）或输错出生年月日。' : '複製證件上的連接號（-）或輸錯出生年月日。',
          n2: simLang === 'zh' ? '请确认此号码在官方公民登记系统中处于正常有效状态。' : '請確認此號碼在官方公民登記系統中處於正常有效狀態。',
          m3: simLang === 'zh' ? '用于签发签证或有效居留许可的基础旅行证件序列号。' : '用於簽發簽證或有效居留許可的基礎旅行證件序列號。',
          h3: simLang === 'zh' ? '以大写英文字母开头，后接数字（通常为8至9位字符）。' : '以大寫英文字母開頭，後接數字（通常為8至9位字元）。',
          err3: simLang === 'zh' ? '使用已过期的旧护照，或护照剩余有效期不足6个月。' : '使用已過期的舊護照，或護照剩餘效期不足6個月。',
          n3: simLang === 'zh' ? '绝大多数国家在大使馆审理时均要求护照有效期大于6个月。' : '絕大多數國家在使領館審理時均要求護照效期大於6個月。'
        }
      default:
        return {
          f1: 'Full Legal Name (as in Passport)',
          f2: 'National Identification (NIK / ID)',
          f3: 'Passport Document Number',
          m1: 'Authorities match applicant identity against the international passport Machine-Readable Zone (MRZ).',
          h1: 'Type exactly as ordered in your passport page. Never add academic titles (Dr., B.Sc., Ph.D.) or commas.',
          err1: 'Adding nicknames, reversing surname order not matching passport, or inserting degree abbreviations.',
          n1: 'If your passport only contains a single name, enter it here without repeating.',
          m2: 'Unique 16-digit civil registration code verifying applicant national citizenship.',
          h2: 'Enter 16 digits without spaces or dashes. Middle digits represent date of birth in local civil registry format.',
          err2: 'Inserting dashes (-) from physical ID card format or mistyping birth date sequence.',
          n2: 'Must match active registry records in the national identity database.',
          m3: 'Primary travel document serial number used to issue entry visas and official residency permits.',
          h3: 'Type the initial series letter followed by numbers (usually 8–9 alphanumeric characters) in uppercase.',
          err3: 'Using an expired passport or one with less than 6 months validity remaining before travel.',
          n3: 'Most embassies immediately reject applications if passport validity is under 6 months.'
        }
    }
  }

  const ft = getFieldTitles()

  const FORM_GUIDES = [
    {
      step: 1,
      userTitle: ft.f1,
      portalFieldName: 'Full Legal Name (as in Passport)',
      meaning: ft.m1,
      howToFill: ft.h1,
      example: 'Alexander Christopher Ward',
      mistakes: ft.err1,
      notes: ft.n1,
    },
    {
      step: 2,
      userTitle: ft.f2,
      portalFieldName: 'National Identification (NIK / ID)',
      meaning: ft.m2,
      howToFill: ft.h2,
      example: '3201241995080004',
      mistakes: ft.err2,
      notes: ft.n2,
    },
    {
      step: 3,
      userTitle: ft.f3,
      portalFieldName: 'Passport Document Number',
      meaning: ft.m3,
      howToFill: ft.h3,
      example: 'X84910284',
      mistakes: ft.err3,
      notes: ft.n3,
    },
  ]

  const activeGuide = FORM_GUIDES.find((g) => g.step === guidedStep) || FORM_GUIDES[0]
  const currentLangObj = JAPAC_LANGUAGES.find((l) => l.code === simLang) || JAPAC_LANGUAGES[0]

  // UI Localized Strings for the simulator extension sidepanel
  const uiTexts = {
    requiredBadge: simLang === 'id' ? 'Wajib' : simLang === 'ja' ? '必須' : simLang === 'ko' ? '필수' : simLang === 'zh' || simLang === 'zh-TW' ? '必填' : 'Required',
    fieldGuidanceHeader: simLang === 'id' ? 'Kartu Bimbingan Kolom' : simLang === 'ja' ? '項目ガイダンスカード' : simLang === 'ko' ? '항목별 상세 가이드' : 'Field Guidance Card',
    fieldStepLabel: (s: number) => simLang === 'id' ? `Kolom ${s} dari 3` : simLang === 'ja' ? `項目 ${s} / 3` : simLang === 'ko' ? `항목 ${s} / 3` : `Field ${s} of 3`,
    meaningLabel: simLang === 'id' ? 'Maksud & Tujuan Kolom:' : simLang === 'ja' ? '項目の趣旨と目的:' : 'Meaning & Purpose:',
    howToFillLabel: simLang === 'id' ? '✍️ Cara Mengisi:' : simLang === 'ja' ? '✍️ 入力の手引き:' : '✍️ How to Fill:',
    exampleLabel: simLang === 'id' ? '📋 Contoh Isian:' : simLang === 'ja' ? '📋 入力例:' : '📋 Example Entry:',
    mistakesLabel: simLang === 'id' ? '⚠️ Kesalahan Umum:' : simLang === 'ja' ? '⚠️ よくある間違い:' : '⚠️ Common Mistakes:',
    notesLabel: simLang === 'id' ? '📌 Catatan Penting:' : simLang === 'ja' ? '📌 注意事項:' : '📌 Notes:',
    autofillBtn: simLang === 'id' ? 'Isi Otomatis Kolom Ini' : simLang === 'ja' ? 'この項目を自動入力' : 'AutoFill This Field',
    prevBtn: simLang === 'id' ? '← Sebelumnya' : '← Prev',
    nextBtn: simLang === 'id' ? 'Selanjutnya →' : 'Next →',
    auditBtn: simLang === 'id' ? '🚦 Jalankan Audit' : simLang === 'ja' ? '🚦 監査を実行' : '🚦 Run Audit',
    chatbotDesc: simLang === 'id' ? 'Tanya jawab instan' : 'Instant guidance',
    voiceDesc: simLang === 'id' ? 'Tanya langsung lewat suara' : 'Direct voice guidance',
    voiceHeroTitle: simLang === 'id' ? 'Untuk kamu yang ingin tanya langsung' : 'Direct Voice Assistant',
    voiceHeroDesc: simLang === 'id' ? 'Dengarkan penjelasan suara yang tenang tanpa perlu membaca teks panjang.' : 'Comforting audio guidance without reading dense text.',
    quickTitle: simLang === 'id' ? '💡 Pertanyaan Cepat:' : '💡 Quick Questions:',
    customNote: simLang === 'id' ? '*Di ekstensi resmi Telmy, kamu bebas mengetik pertanyaan kustom apa pun.' : '*In the official Telmy extension, you can type any custom question freely.'
  }

  return (
    <section id="simulator" className="py-20 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800 scroll-mt-16">
      {/* Background Soft Glows */}
      <div className="absolute top-10 right-1/4 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm shadow-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{globalLang === 'id' ? 'Simulasi Langsung' : 'Live Interactive Demo'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            {t.simHeading || (globalLang === 'id' ? 'Lihat cara kerjanya.' : 'See it in action.')}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.simSubheading ||
              (globalLang === 'id'
                ? 'Lihat bagaimana Telmy mendampingi pengisian form, menjelaskan pertanyaan, dan memeriksa eror sebelum dikirim.'
                : 'Watch how Telmy assists form filling, explains questions, and catches mistakes before you hit submit.')}
          </p>
        </div>

        {/* The Outer Browser Application Frame */}
        <div className="rounded-3xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden relative">
          {/* Top Browser Bar (URL + Actions) */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/90 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="ml-3 hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[11px] font-mono text-slate-300 max-w-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="truncate">https://portal.immigration.gov/visa/apply-stage2</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Telmy Chrome Extension: Active</span>
              </span>
            </div>
          </div>

          {/* Main Workspace Split: Left (Web Form) + Right (Sidepanel Cupertino Replica) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
            {/* LEFT 7 COLS: The Live Webpage & Form */}
            <div
              className={`lg:col-span-7 p-6 sm:p-8 relative transition-all duration-300 ${
                isHighContrast ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
              } ${isDyslexia ? 'font-sans tracking-widest' : ''}`}
            >
              {/* Dimmer Overlay for Spotlight Mode */}
              {isSpotlight && (
                <div className="absolute inset-0 bg-slate-950/70 z-10 pointer-events-none transition-opacity duration-300" />
              )}

              {/* Form Title Header */}
              <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between relative z-20">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    Visa Application Portal
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black mt-2 ${isHighContrast ? 'text-white' : 'text-slate-900'}`}>
                    General Visa & Stay Permit
                  </h3>
                  <p className={`text-xs mt-1 ${isHighContrast ? 'text-slate-300' : 'text-slate-500'}`}>
                    Official immigration portal for visitor permit application.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400">Step 2 of 4</span>
                </div>
              </div>

              {/* Form Input Fields (Interactive with Focus & Spotlight handling) */}
              <div className={`space-y-6 ${isLineSpacing ? 'space-y-9 tracking-wider leading-loose' : ''}`}>
                {/* Field 1: Full Legal Name */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                    isSpotlight && activeInputFocus === 1
                      ? 'z-30 bg-white ring-8 ring-blue-500/30 border-blue-600 shadow-2xl scale-[1.01]'
                      : activeInputFocus === 1
                      ? 'z-20 border-blue-600 bg-blue-50/50 ring-4 ring-blue-100 shadow-xs'
                      : isHighContrast
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setActiveInputFocus(1)
                    setGuidedStep(1)
                    setActiveTab('fields')
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        1
                      </span>
                      <span className={isLargeText ? 'text-sm font-black' : 'text-xs'}>Full Legal Name (as in Passport)</span>
                    </label>
                    <span className="text-[10px] text-rose-500 font-bold">*{uiTexts.requiredBadge}</span>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Alexander Christopher Ward"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      isHighContrast
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                    } ${isLargeText ? 'text-base py-3' : ''}`}
                  />
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isHighContrast ? 'text-blue-300' : 'text-slate-500'}`}>
                    <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{ft.h1}</span>
                  </p>
                </div>

                {/* Field 2: National Identification (NIK) */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                    isSpotlight && activeInputFocus === 2
                      ? 'z-30 bg-white ring-8 ring-blue-500/30 border-blue-600 shadow-2xl scale-[1.01]'
                      : activeInputFocus === 2
                      ? 'z-20 border-blue-600 bg-blue-50/50 ring-4 ring-blue-100 shadow-xs'
                      : isHighContrast
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setActiveInputFocus(2)
                    setGuidedStep(2)
                    setActiveTab('fields')
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        2
                      </span>
                      <span className={isLargeText ? 'text-sm font-black' : 'text-xs'}>National Identification (NIK / KTP)</span>
                    </label>
                    <span className="text-[10px] text-rose-500 font-bold">*{uiTexts.requiredBadge}</span>
                  </div>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="16 digit angka resmi KTP"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all font-mono ${
                      isHighContrast
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                    } ${isLargeText ? 'text-base py-3' : ''}`}
                  />
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isHighContrast ? 'text-blue-300' : 'text-slate-500'}`}>
                    <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{ft.h2}</span>
                  </p>
                </div>

                {/* Field 3: Passport Number */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-300 relative ${
                    isSpotlight && activeInputFocus === 3
                      ? 'z-30 bg-white ring-8 ring-blue-500/30 border-blue-600 shadow-2xl scale-[1.01]'
                      : activeInputFocus === 3
                      ? 'z-20 border-blue-600 bg-blue-50/50 ring-4 ring-blue-100 shadow-xs'
                      : isHighContrast
                      ? 'border-slate-700 bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setActiveInputFocus(3)
                    setGuidedStep(3)
                    setActiveTab('fields')
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isHighContrast ? 'text-white' : 'text-slate-800'}`}>
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        3
                      </span>
                      <span className={isLargeText ? 'text-sm font-black' : 'text-xs'}>Passport Document Number</span>
                    </label>
                    <span className="text-[10px] text-rose-500 font-bold">*{uiTexts.requiredBadge}</span>
                  </div>
                  <input
                    type="text"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    placeholder="Contoh: X84910284"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all font-mono uppercase ${
                      isHighContrast
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                    } ${isLargeText ? 'text-base py-3' : ''}`}
                  />
                  <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isHighContrast ? 'text-blue-300' : 'text-slate-500'}`}>
                    <Bot className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{ft.h3}</span>
                  </p>
                </div>
              </div>

              {/* Dynamic Real Audit Results Card */}
              {hasRunAudit && (
                <div
                  className={`mt-8 p-5 rounded-2xl border transition-all animate-in fade-in duration-300 relative z-20 ${
                    overallAuditStatus === 'valid'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : overallAuditStatus === 'warning'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-3">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {overallAuditStatus === 'valid' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {overallAuditStatus === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      {overallAuditStatus === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                      <span>
                        {overallAuditStatus === 'valid' && (simLang === 'id' ? 'Hasil Audit: Siap Kirim (Lolos Sempurna)' : 'Audit Results: Ready to Submit')}
                        {overallAuditStatus === 'warning' && (simLang === 'id' ? 'Hasil Audit: Perlu Ditinjau Ulang' : 'Audit Results: Needs Review')}
                        {overallAuditStatus === 'error' && (simLang === 'id' ? 'Hasil Audit: Terdapat Kolom Belum Lengkap / Salah' : 'Audit Results: Incomplete or Invalid')}
                      </span>
                    </div>
                    <button
                      onClick={() => setHasRunAudit(false)}
                      className="text-xs opacity-60 hover:opacity-100 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {auditResults.map((r, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span
                          className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                            r.status === 'valid'
                              ? 'bg-emerald-500 ring-2 ring-emerald-200'
                              : r.status === 'warning'
                              ? 'bg-amber-500 ring-2 ring-amber-200'
                              : 'bg-rose-500 ring-2 ring-rose-200'
                          }`}
                        />
                        <div>
                          <strong className="font-bold mr-1.5">{r.label}:</strong>
                          <span className="opacity-90">{r.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT 5 COLS: Exact Replica of Telmy Native Chrome Sidepanel */}
            <div className="lg:col-span-5 bg-[#f5f5f7] text-[#1d1d1f] border-t lg:border-t-0 lg:border-l border-slate-300/70 flex flex-col justify-between select-none">
              <div className="flex-1 flex flex-col">
                {/* 1. Cupertino Frosted Glass Header */}
                <div className="px-3.5 py-2.5 bg-white/90 backdrop-blur-md border-b border-black/8 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/telmy_icon.png"
                      alt="Telmy Icon"
                      className="w-7 h-7 rounded-lg shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                    />
                    <div>
                      <span className="font-extrabold text-[14px] tracking-tight text-slate-900 leading-none">
                        Telmy<span className="text-[#0071e3]">.ai</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Free Quota Badge */}
                    <div className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0071e3] text-[10.5px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#0071e3]" />
                      <span>5 Forms</span>
                    </div>

                    {/* Mini SVG Flag Language Dropdown (Changes Extension Language Only) */}
                    <div className="relative">
                      <button
                        onClick={() => setShowLangMenu((p) => !p)}
                        className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs"
                      >
                        <div
                          className="w-4 h-3 flex items-center overflow-hidden rounded-2xs"
                          dangerouslySetInnerHTML={{ __html: currentLangObj.svg }}
                        />
                        <span className="uppercase">{currentLangObj.code}</span>
                      </button>

                      {showLangMenu && (
                        <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 space-y-0.5">
                          {JAPAC_LANGUAGES.map((l) => (
                            <button
                              key={l.code}
                              onClick={() => {
                                setSimLang(l.code)
                                setShowLangMenu(false)
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer ${
                                simLang === l.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <div
                                className="w-4 h-3 flex items-center overflow-hidden rounded-2xs"
                                dangerouslySetInnerHTML={{ __html: l.svg }}
                              />
                              <span>{l.nativeName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Speaking Waves Audio Bar (Appears when speaking) */}
                {isSpeaking && (
                  <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-4 py-1.5 flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 h-3">
                        <span className="w-1 bg-white h-2 animate-pulse" />
                        <span className="w-1 bg-white h-3 animate-pulse delay-75" />
                        <span className="w-1 bg-white h-1.5 animate-pulse delay-150" />
                      </div>
                      <span className="text-[11px]">{simLang === 'id' ? 'Telmy sedang membacakan panduan...' : 'Telmy is reading aloud...'}</span>
                    </div>
                    <button
                      onClick={handleSpeech}
                      className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-[10px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* 2. Apple Segmented Control Navigation Tabs (3 Main Pillars + A11y) */}
                <div className="p-2 px-3">
                  <div className="flex bg-slate-200/70 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab('chat')}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTab === 'chat'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5 text-blue-600" />
                      <span>AI Assistant</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('fields')}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTab === 'fields'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                      <span>Forms Guide</span>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black">
                        3
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab('vault')}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTab === 'vault'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>AutoFill</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('a11y')}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        activeTab === 'a11y'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Focus className="w-3.5 h-3.5 text-violet-600" />
                      <span>A11y Hub</span>
                    </button>
                  </div>
                </div>

                {/* 3. Tab Contents */}
                <div className="p-3.5 pt-1 flex-1 flex flex-col justify-between">
                  {/* TAB 1: AI Assistant (Chatbot & Voicebot Stage) */}
                  {activeTab === 'chat' && (
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <div className="space-y-2">
                        {/* Mode Switch Cards: Text vs Voice */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Chatbot Mode */}
                          <div
                            onClick={() => setChatMode('chat')}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              chatMode === 'chat'
                                ? 'bg-gradient-to-b from-white to-blue-50/40 border-blue-500 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                                chatMode === 'chat'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {chatMode === 'chat' ? '✓ Active' : '○ Switch'}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">Chatbot Mode</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{uiTexts.chatbotDesc}</p>
                          </div>

                          {/* Voice Mode */}
                          <div
                            onClick={() => {
                              setChatMode('voice')
                              handleSpeech()
                            }}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              chatMode === 'voice'
                                ? 'bg-gradient-to-b from-white to-blue-50/40 border-blue-500 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-slate-300'
                            }`}
                          >
                            <div
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                                chatMode === 'voice'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {chatMode === 'voice' ? '✓ Active' : '○ Switch'}
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                              <span>Voice Mode</span>
                              <Volume2 className="w-3 h-3 text-blue-600" />
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-0.5">{uiTexts.voiceDesc}</p>
                          </div>
                        </div>

                        {/* Voice Hero Stage */}
                        {chatMode === 'voice' && (
                          <div className="p-3 bg-gradient-to-b from-sky-50 to-white border border-sky-200 rounded-2xl text-center space-y-2 animate-in fade-in duration-200">
                            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center mx-auto shadow-xs">
                              <Volume2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">
                                {uiTexts.voiceHeroTitle}
                              </h4>
                              <p className="text-[10.5px] text-slate-500">
                                {uiTexts.voiceHeroDesc}
                              </p>
                            </div>
                            <button
                              onClick={handleSpeech}
                              className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/30 cursor-pointer active:scale-95 transition-all"
                            >
                              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          </div>
                        )}

                        {/* Messages Stream Container (Expanded height so full chat history can be scrolled) */}
                        <div className="h-64 sm:h-72 overflow-y-auto space-y-2 pr-1 text-xs">
                          {messages.map((m, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-2xl leading-relaxed ${
                                m.sender === 'ai'
                                  ? 'bg-white border border-slate-200/90 text-slate-800 shadow-2xs'
                                  : 'bg-blue-600 text-white ml-6 text-right font-medium'
                              }`}
                            >
                              {m.sender === 'ai' && (
                                <span className="block font-bold text-blue-600 text-[10px] uppercase mb-0.5">
                                  Telmy Companion:
                                </span>
                              )}
                              {m.text}
                              {m.actionChip && (
                                <button
                                  onClick={() => {
                                    if (m.actionChip?.includes('2')) {
                                      setActiveInputFocus(2)
                                      setGuidedStep(2)
                                      setActiveTab('fields')
                                    } else if (m.actionChip?.includes('3')) {
                                      setActiveInputFocus(3)
                                      setGuidedStep(3)
                                      setActiveTab('fields')
                                    } else {
                                      setActiveTab('vault')
                                    }
                                  }}
                                  className="mt-2 block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                                >
                                  ↗ {m.actionChip}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Compact Quick Question Chips & Input (Takes minimal space at footer) */}
                      <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                            {uiTexts.quickTitle}
                          </span>
                          {quickQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handlePromptClick(q)}
                              className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 text-[10.5px] font-medium transition-all shrink-0 cursor-pointer shadow-2xs flex items-center gap-1"
                            >
                              <span className="truncate max-w-[170px]">{q}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            </button>
                          ))}
                        </div>

                        {/* Interactive Chat Input Bar with Note */}
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            placeholder={
                              simLang === 'id'
                                ? 'Pilih pertanyaan di atas...'
                                : 'Select a question above...'
                            }
                            className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 shadow-2xs outline-none cursor-default"
                          />
                          <button
                            disabled
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[9px] text-slate-400 italic text-center">
                          {uiTexts.customNote}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Forms Guide (Exact Comprehensive 5 Sub-sections Structure) */}
                  {activeTab === 'fields' && (
                    <div className="space-y-3">
                      {/* Step Indicator Header */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                            {uiTexts.fieldGuidanceHeader}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900">
                            {uiTexts.fieldStepLabel(guidedStep)}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((step) => (
                            <button
                              key={step}
                              onClick={() => {
                                setGuidedStep(step)
                                setActiveInputFocus(step)
                              }}
                              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                guidedStep === step
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {step}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Active Field Guidance (Complete Requested Structure) */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs max-h-[380px] overflow-y-auto">
                        {/* 1. Nama Kolom Bahasa User (Besar) + Nama Asli Portal */}
                        <div className="pb-2 border-b border-slate-100">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                            {simLang === 'id' ? 'Nama Kolom (Bahasa Pilihanmu):' : 'Field Name (Your Language):'}
                          </span>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                            {activeGuide.userTitle}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                              Field: {activeGuide.portalFieldName}
                            </span>
                            <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-bold border border-rose-200">
                              {uiTexts.requiredBadge}
                            </span>
                          </div>
                        </div>

                        {/* 2. Meaning & Purpose */}
                        <div>
                          <span className="text-[10.5px] font-bold text-blue-700 flex items-center gap-1 mb-0.5">
                            <Info className="w-3 h-3" />
                            <span>{uiTexts.meaningLabel}</span>
                          </span>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            {activeGuide.meaning}
                          </p>
                        </div>

                        {/* 3. How to Fill */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px]">
                          <strong className="text-slate-800 font-bold block mb-0.5">
                            {uiTexts.howToFillLabel}
                          </strong>
                          <p className="text-slate-600 leading-relaxed">
                            {activeGuide.howToFill}
                          </p>
                        </div>

                        {/* 4. Example Entry */}
                        <div className="bg-blue-50/60 border-l-2 border-blue-600 p-2 rounded-r-xl text-[11px] text-slate-700">
                          <strong className="text-blue-800 block mb-0.5">
                            {uiTexts.exampleLabel}
                          </strong>
                          <span className="font-mono font-bold text-blue-900">
                            {activeGuide.example}
                          </span>
                        </div>

                        {/* 5. Common Mistakes */}
                        <div className="bg-amber-50/80 border-l-2 border-amber-500 p-2 rounded-r-xl text-[11px] text-amber-950">
                          <strong className="text-amber-800 block mb-0.5">
                            {uiTexts.mistakesLabel}
                          </strong>
                          <p className="leading-relaxed">
                            {activeGuide.mistakes}
                          </p>
                        </div>

                        {/* 6. Notes */}
                        <div className="text-[10.5px] text-slate-500 bg-slate-50 p-2 rounded-xl">
                          <strong className="text-slate-700 block mb-0.5">{uiTexts.notesLabel}</strong>
                          <span>{activeGuide.notes}</span>
                        </div>

                        {/* Action Buttons: Quick Fill & Voice Read */}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              if (guidedStep === 1) setFullName('Alexander Christopher Ward')
                              if (guidedStep === 2) setIdNumber('3201241995080004')
                              if (guidedStep === 3) setPassport('X84910284')
                            }}
                            className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>{uiTexts.autofillBtn}</span>
                          </button>
                          <button
                            onClick={handleSpeech}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Bacakan Bimbingan Kolom"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Stepper Footer Controls */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                        <button
                          disabled={guidedStep === 1}
                          onClick={() => {
                            setGuidedStep((p) => p - 1)
                            setActiveInputFocus(guidedStep - 1)
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-[11px] disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                        >
                          {uiTexts.prevBtn}
                        </button>
                        <span className="font-bold text-slate-500 text-[11px]">{guidedStep} / 3</span>
                        <button
                          onClick={() => {
                            if (guidedStep < 3) {
                              setGuidedStep((p) => p + 1)
                              setActiveInputFocus(guidedStep + 1)
                            } else {
                              setHasRunAudit(true)
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-500 cursor-pointer shadow-xs"
                        >
                          {guidedStep === 3 ? uiTexts.auditBtn : uiTexts.nextBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Encrypted Profile Vault & AutoFill */}
                  {activeTab === 'vault' && (
                    <div className="space-y-3">
                      {!isVaultUnlocked ? (
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                            <Lock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">Encrypted Profile Vault</h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {simLang === 'id'
                                ? 'Data profil pribadi Anda dilindungi enkripsi perangkat klien (AES-256-GCM). Buka brankas untuk mengisi formulir seketika.'
                                : 'Your profile data is protected by local AES-256-GCM client encryption. Unlock to fill forms in 1-click.'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="password"
                              value={masterPassword}
                              onChange={(e) => setMasterPassword(e.target.value)}
                              placeholder="Master PIN (1234)"
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600 bg-white"
                            />
                            <button
                              onClick={() => setIsVaultUnlocked(true)}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                            >
                              {simLang === 'id' ? 'Buka' : 'Unlock'}
                            </button>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold block">
                            🔒 Zero-Retention Client Hardware Storage
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-in fade-in duration-200">
                          {/* Top Status Bar */}
                          <div className="bg-emerald-50 border border-emerald-200 p-2.5 px-3 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-[11px]">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Vault Unlocked (Session RAM)</span>
                            </div>
                            <button
                              onClick={() => setIsVaultUnlocked(false)}
                              className="text-[10.5px] font-bold text-slate-600 hover:text-rose-600 cursor-pointer"
                            >
                              {simLang === 'id' ? 'Kunci Brankas' : 'Lock Vault'}
                            </button>
                          </div>

                          {/* Hero 1-Click AutoFill Banner */}
                          <div className="bg-white p-3.5 rounded-2xl border border-amber-300 shadow-xs space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span>Ready to Fill Active Form</span>
                              </span>
                              <span className="text-[9.5px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">
                                3 Fields Matched
                              </span>
                            </div>
                            <button
                              onClick={handlePerformAutofill}
                              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                              <Zap className="w-4 h-4 fill-slate-950" />
                              <span>1-CLICK AUTOFILL ALL FIELDS</span>
                            </button>
                          </div>

                          {/* Profile Items */}
                          <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500 text-[11px]">Full Name:</span>
                              <strong className="text-slate-800 text-[11px]">Alexander Christopher Ward</strong>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-100">
                              <span className="text-slate-500 text-[11px]">National ID:</span>
                              <strong className="text-slate-800 text-[11px]">3201241995080004</strong>
                            </div>
                            <div className="flex justify-between py-1">
                              <span className="text-slate-500 text-[11px]">Passport:</span>
                              <strong className="text-slate-800 text-[11px]">X84910284</strong>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: Accessibility Hub (A11y Presets & Working Individual Controls) */}
                  {activeTab === 'a11y' && (
                    <div className="space-y-3">
                      {/* Presets Row */}
                      <div>
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          🎯 {simLang === 'id' ? 'Profil Aksesibilitas Cepat:' : 'Quick Accessibility Presets:'}
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: 'adhd', icon: '🧠', name: 'ADHD Focus' },
                            { id: 'dyslexia', icon: '📖', name: 'Dyslexia Friendly' },
                            { id: 'lowvision', icon: '👁️', name: 'Low Vision' },
                            { id: 'senior', icon: '👴', name: 'Senior Friendly' },
                          ].map((p) => (
                            <button
                              key={p.id}
                              onClick={() => applyPreset(p.id as any)}
                              className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                activePreset === p.id
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="text-sm">{p.icon}</span>
                              <span className="text-[11px] font-bold">{p.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 14 Tools Grid Preview - Truly functional */}
                      <div>
                        <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                          🛠️ {simLang === 'id' ? 'Pengaturan Mandiri:' : 'Individual Tools:'}
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          {/* Spotlight */}
                          <button
                            onClick={() => setIsSpotlight((p) => !p)}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isSpotlight ? 'bg-violet-50 border-violet-400 text-violet-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">🔦 Spotlight</span>
                            <span className="text-[9.5px] font-bold">{isSpotlight ? 'ON' : 'OFF'}</span>
                          </button>

                          {/* Dyslexia */}
                          <button
                            onClick={() => setIsDyslexia((p) => !p)}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isDyslexia ? 'bg-teal-50 border-teal-400 text-teal-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">📖 Font Dyslexia</span>
                            <span className="text-[9.5px] font-bold">{isDyslexia ? 'ON' : 'OFF'}</span>
                          </button>

                          {/* Contrast */}
                          <button
                            onClick={() => setIsHighContrast((p) => !p)}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isHighContrast ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">🌓 Contrast</span>
                            <span className="text-[9.5px] font-bold">{isHighContrast ? 'ON' : 'OFF'}</span>
                          </button>

                          {/* Large Text */}
                          <button
                            onClick={() => setIsLargeText((p) => !p)}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isLargeText ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">🔠 Large Text</span>
                            <span className="text-[9.5px] font-bold">{isLargeText ? 'ON' : 'OFF'}</span>
                          </button>

                          {/* Audio TTS */}
                          <button
                            onClick={handleSpeech}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isSpeaking ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">🔊 Screen Reader</span>
                            <span className="text-[9.5px] font-bold">{isSpeaking ? 'PLAY' : 'IDLE'}</span>
                          </button>

                          {/* Line Spacing */}
                          <button
                            onClick={() => setIsLineSpacing((p) => !p)}
                            className={`p-2 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                              isLineSpacing ? 'bg-indigo-50 border-indigo-400 text-indigo-800' : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-semibold">↔️ Line Spacing</span>
                            <span className="text-[9.5px] font-bold">{isLineSpacing ? 'ON' : 'OFF'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big CTA Banner Below Simulator Frame (Replacing the small cramped button inside the sidepanel) */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md shadow-2xl">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {globalLang === 'id' ? 'Bebas dari Rasa Cemas Mengisi Formulir' : 'Free Your Next Form from Anxiety'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {globalLang === 'id'
                ? 'Pasang Telmy di browsermu sekarang juga.'
                : 'Install Telmy on your browser today.'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {globalLang === 'id'
                ? 'Gratis 5 formulir per bulan dengan enkripsi penuh di komputermu. Tanpa kartu kredit.'
                : 'Free 5 forms per month with zero-knowledge local encryption. No credit card required.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/download"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{globalLang === 'id' ? 'Pasang Ekstensi — Gratis' : "Add to Chrome, it's free"}</span>
            </Link>
            <Link
              to="/features"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all text-center"
            >
              {globalLang === 'id' ? 'Jelajahi Fitur →' : 'Explore 14 Tools →'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
