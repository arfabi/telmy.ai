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

  // Localized texts for CoreCards section & modal dialogs
  const i18n = {
    en: {
      badge: "Core Pillars",
      mainTitle: "One companion. Three jobs.",
      mainSubtitle: "Click any card to inspect the full interactive demonstration and security details.",
      clickExpand: "Click to expand",
      clickFullDemo: "Click to view full demonstration",
      p1Badge: "Pillar 1",
      p1Title: "Understand",
      p1Desc: "Get a plain-language explanation of every field, with examples, legal definitions, and common pitfalls — written or spoken aloud in your native language.",
      p1Footer: "Forms Guide & Context Explainer",
      p2Badge: "Pillar 2",
      p2Title: "Complete",
      p2Desc: "Upload your ID, passport, or certificate once. Telmy reads it client-side into an encrypted vault and auto-fills matching fields across complex portals in 1 click.",
      p2Footer: "Smart Vault & 1-Click AutoFill",
      p3Badge: "Pillar 3",
      p3Title: "Check",
      p3Desc: "Before you click submit on the official portal, Telmy flags missed mandatory fields, inconsistent dates, and high-risk errors to prevent costly rejections.",
      p3Footer: "Built-in Form Auditor & Pre-check",
      tl1: "Name matches passport identity",
      tl2: "Date format: change DD/MM to YYYY/MM/DD",
      tl3: "Mandatory signature field is required",
      bannerTitle: "Looking for Voice Mode, Accessibility Hub & PDF Imports?",
      bannerDesc: "Discover all 14 accessibility profiles, client-side encryption, and complete feature matrix.",
      bannerBtn: "Explore All Features",
      modalHowTitle: "How it works in your browser:",
      modalPrivTitle: "Privacy & Zero Retention Guarantee",
      modalCta: "Get Telmy Extension Free",
      modalRecording: "Real interactive recording from Telmy Chrome Side Panel",
      // Modal Details
      p1ModalTitle: "Pillar 1: Understand Every Field in Context",
      p1ModalSub: "Eliminate anxiety with plain-language explanations, official legal definitions, examples, and native voice audio.",
      p1ModalBadge: "Form Explainer & Voice Guidance",
      p1Steps: [
        { title: "1. Click or Focus on Any Field", desc: "Telmy identifies the field context, official embassy guideline, and surrounding labels automatically." },
        { title: "2. Plain Language Explanation", desc: "Ambiguous legal terms (e.g., 'Apostille', 'Stay Period', 'Inviting Party') are translated into simple, everyday language." },
        { title: "3. Real Examples & Common Pitfalls", desc: "See exactly what a valid entry looks like (Latin letters vs Katakana, date order YYYY/MM/DD) to avoid immediate rejections." },
        { title: "4. Voice Assistance Mode", desc: "Listen to explanations spoken aloud in your native language (11 JAPAC neural voices available)." }
      ],
      p1Security: "Only field instructions and labels are parsed. Personal values entered are masked client-side before any contextual request is made.",
      p2ModalTitle: "Pillar 2: Complete Complex Forms with 1-Click AutoFill",
      p2ModalSub: "Upload identity documents once. Extract canonical data into your local encrypted vault and auto-fill multi-step forms in seconds.",
      p2ModalBadge: "Smart Vault & Canonical Autofill",
      p2Steps: [
        { title: "1. One-Time Identity OCR", desc: "Upload your Passport, National ID, or Diploma. AI extracts verified details and deletes the original file immediately from memory." },
        { title: "2. Client-Side Vault Encryption", desc: "Your profile is sealed with AES-256-GCM. The encryption key lives strictly on your device." },
        { title: "3. 1-Click Smart Matching", desc: "Telmy matches 20+ canonical fields (given name, surname, passport expiry, issuance country) across government portals." },
        { title: "4. Zero Authentication Capture", desc: "Passwords, credit card CVVs, and banking PINs are strictly blacklisted and never captured or filled." }
      ],
      p2Security: "Zero-knowledge storage: Telmy servers only store encrypted ciphertext. Decryption occurs strictly inside your browser session.",
      p3ModalTitle: "Pillar 3: Pre-Submission Traffic Light Auditor",
      p3ModalSub: "A thorough pre-flight audit that catches typos, missed mandatory fields, and format errors before you press submit.",
      p3ModalBadge: "Pre-flight Validator & Safety Audit",
      p3Steps: [
        { title: "1. Mandatory Field Verification (Red Flag)", desc: "Flags blank required fields and unsigned declaration checkboxes before the portal rejects your application." },
        { title: "2. Date & Format Mismatch (Yellow Warning)", desc: "Warns you when a date is entered in DD/MM instead of the requested YYYY/MM/DD, or when passport numbers include spaces." },
        { title: "3. Name & Identity Consistency (Green Check)", desc: "Verifies that the spelling of your full name matches your official passport identity record." },
        { title: "4. Confidence Before Final Submission", desc: "Telmy gives you peace of mind so you never have to pay repeat fees or suffer visa processing delays." }
      ],
      p3Security: "Audits run locally in the browser DOM. No human review or manual data inspection takes place."
    },
    id: {
      badge: "Pilar Utama",
      mainTitle: "Satu pendamping. Tiga tugas penting.",
      mainSubtitle: "Klik kartu mana saja untuk melihat simulasi interaktif lengkap dan jaminan keamanan.",
      clickExpand: "Klik untuk perbesar",
      clickFullDemo: "Klik untuk melihat demonstrasi penuh",
      p1Badge: "Pilar 1",
      p1Title: "Pahami",
      p1Desc: "Dapatkan penjelasan bahasa sehari-hari untuk setiap kolom, contoh pengisian, istilah hukum, dan kesalahan umum — tertulis atau disuarakan dalam bahasa ibu Anda.",
      p1Footer: "Panduan Formulir & Penjelas Konteks",
      p2Badge: "Pilar 2",
      p2Title: "Lengkapi",
      p2Desc: "Unggah KTP, paspor, atau ijazah sekali saja. AI mengekstrak data ke brankas terenkripsi lokal dan mengisi formulir multi-langkah dalam 1 kali klik.",
      p2Footer: "Brankas Cerdas & 1-Klik AutoFill",
      p3Badge: "Pilar 3",
      p3Title: "Periksa",
      p3Desc: "Sebelum klik kirim pada portal resmi, Telmy memeriksa kolom wajib yang terlewat, format tanggal tidak cocok, dan potensi kesalahan fatal.",
      p3Footer: "Auditor Formulir & Pemeriksaan Awal",
      tl1: "Nama cocok dengan identitas paspor",
      tl2: "Format tanggal: sesuaikan HH/BB ke TTTT/BB/HH",
      tl3: "Kolom tanda tangan wajib diisi",
      bannerTitle: "Mencari Mode Suara, Pusat Aksesibilitas & Impor PDF?",
      bannerDesc: "Temukan 14 profil aksesibilitas, enkripsi di sisi klien, dan matriks fitur lengkap.",
      bannerBtn: "Jelajahi Semua Fitur",
      modalHowTitle: "Cara kerjanya di browser Anda:",
      modalPrivTitle: "Jaminan Privasi & Tanpa Penyimpanan Dokumen",
      modalCta: "Pasang Ekstensi Telmy Gratis",
      modalRecording: "Rekaman interaktif asli dari Chrome Side Panel Telmy",
      p1ModalTitle: "Pilar 1: Pahami Setiap Kolom Berdasarkan Konteks",
      p1ModalSub: "Hilangkan kecemasan dengan penjelasan bahasa lugas, definisi resmi, contoh nyata, dan panduan suara lokal.",
      p1ModalBadge: "Penjelas Formulir & Panduan Suara",
      p1Steps: [
        { title: "1. Klik atau Arahkan Kursor ke Kolom Mana Saja", desc: "Telmy secara otomatis mengidentifikasi konteks pertanyaan, panduan resmi kedutaan, dan instruksi di sekitarnya." },
        { title: "2. Penjelasan Bahasa Sederhana", desc: "Istilah birokrasi rumit (misal 'Apostille', 'Masa Tinggal', 'Pihak Pengundang') diterjemahkan ke dalam bahasa sehari-hari yang mudah dimengerti." },
        { title: "3. Contoh Nyata & Kesalahan Umum", desc: "Ketahui format penulisan yang benar (huruf Latin vs karakter khusus, urutan tanggal) agar tidak langsung ditolak sistem." },
        { title: "4. Mode Suara Alami", desc: "Dengarkan penjelasan dibacakan dengan suara alami dalam bahasa ibu Anda (tersedia 11 suara resmi Asia-Pasifik)." }
      ],
      p1Security: "Hanya teks instruksi dan nama kolom yang diproses. Nilai data pribadi Anda disamarkan di browser sebelum dikirim untuk analisis AI.",
      p2ModalTitle: "Pilar 2: Lengkapi Formulir Rumit dengan 1-Klik AutoFill",
      p2ModalSub: "Cukup unggah dokumen identitas sekali. Data tersimpan di brankas terenkripsi perangkat Anda dan mengisi puluhan kolom dalam sekejap.",
      p2ModalBadge: "Brankas Pintar & Pengisian Otomatis",
      p2Steps: [
        { title: "1. Ekstraksi Dokumen Sekali Jalan (OCR)", desc: "Unggah paspor, KTP, atau ijazah. AI mengekstrak data penting dan langsung menghapus file asli secara permanen dari memori." },
        { title: "2. Enkripsi Lokal Berstandar Militer", desc: "Data profil Anda disegel dengan enkripsi AES-256-GCM. Kunci dekripsi hanya tersimpan di perangkat lokal Anda." },
        { title: "3. Pencocokan Cerdas 1-Klik", desc: "Telmy mencocokkan 20+ bidang data standar pada portal pemerintah secara otomatis." },
        { title: "4. Perlindungan Kata Sandi & Finansial", desc: "Password, CVV kartu kredit, dan PIN rekening secara otomatis diabaikan dan tidak pernah disimpan." }
      ],
      p2Security: "Penyimpanan Zero-Knowledge: Server cloud Telmy hanya menyimpan ciphertext yang terkunci rapat.",
      p3ModalTitle: "Pilar 3: Auditor Lampu Lalu Lintas Sebelum Submit",
      p3ModalSub: "Pemeriksaan pra-pengiriman mendalam untuk mencegah penolakan dokumen, penundaan visa, atau biaya pengajuan ulang.",
      p3ModalBadge: "Pemeriksa Pra-Kirim & Audit Keamanan",
      p3Steps: [
        { title: "1. Verifikasi Kolom Wajib (Lampu Merah)", desc: "Mendeteksi kolom penting yang masih kosong atau persetujuan yang belum dicentang sebelum Anda mengirimkannya." },
        { title: "2. Format Tanggal & Angka (Lampu Kuning)", desc: "Memberi peringatan jika format tanggal terbalik (misal format AS vs Asia) atau nomor identitas mengandung spasi." },
        { title: "3. Keselarasan Nama Paspor (Lampu Hijau)", desc: "Memastikan ejaan nama lengkap cocok persis dengan dokumen resmi paspor Anda." },
        { title: "4. Ketenangan Saat Mengirim", desc: "Kirim formulir resmi Anda dengan rasa percaya diri tanpa takut salah ketik." }
      ],
      p3Security: "Proses audit berjalan langsung di browser pengguna tanpa ada pemeriksaan manual oleh pihak ketiga."
    },
    ja: {
      badge: "コア機能",
      mainTitle: "ひとつの拡張機能で、3つの安心。",
      mainSubtitle: "各カードをクリックして、拡大デモと安全設計の詳細をご確認ください。",
      clickExpand: "クリックして拡大",
      clickFullDemo: "クリックして全体デモを表示",
      p1Badge: "柱 1",
      p1Title: "理解する",
      p1Desc: "難解な公的用語や申請項目の意味を、分かりやすい母国語のテキストや音声で解説します。",
      p1Footer: "フォーム項目ガイド＆文脈解説",
      p2Badge: "柱 2",
      p2Title: "入力する",
      p2Desc: "身分証明書を一度アップロードするだけで、端末内暗号化保管庫から安全に1クリック自動入力します。",
      p2Footer: "スマート保管庫＆ワンクリック自動入力",
      p3Badge: "柱 3",
      p3Title: "確認する",
      p3Desc: "公的ポータルで最終送信する前に、必須項目の抜け漏れや日付フォーマットの誤りを信号機カラーで監査します。",
      p3Footer: "提出前スマート監査機能",
      tl1: "パスポートの氏名表記と一致",
      tl2: "日付形式：YYYY/MM/DDに変更を推奨",
      tl3: "署名確認欄が未入力です",
      bannerTitle: "音声モードや14のアクセシビリティツールをお探しですか？",
      bannerDesc: "全14種類の閲覧支援機能、端末内暗号化、詳細な機能比較をご確認いただけます。",
      bannerBtn: "全機能を見る",
      modalHowTitle: "ブラウザでの動作手順：",
      modalPrivTitle: "プライバシーとデータ非保持の約束",
      modalCta: "Telmy 拡張機能を無料入手",
      modalRecording: "Chrome サイドパネルでの実際の画面録画",
      p1ModalTitle: "柱 1：あらゆる入力項目を分かりやすく理解",
      p1ModalSub: "難解な公式要件を、身近な母国語の解説とクリアな音声案内で解決します。",
      p1ModalBadge: "項目解説＆音声ガイド",
      p1Steps: [
        { title: "1. 任意の項目をクリック", desc: "大使館や行政機関の公式ガイドラインをもとに、その項目の目的をAIが自動把握します。" },
        { title: "2. 平易な言葉で解説", desc: "「アポスティーユ」や「在留資格理由」などの専門法律用語をかみ砕いて説明します。" },
        { title: "3. 記入例と注意点", desc: "ローマ字表記の順序や日付の書式など、リジェクトを防ぐ正しい記入例を表示します。" },
        { title: "4. 自然な音声アシスト", desc: "アジア太平洋11言語の自然なニューラル音声で読み上げが可能です。" }
      ],
      p1Security: "指示文と項目ラベルのみを解析します。個人情報は端末側でマスクされた後でのみ処理されます。",
      p2ModalTitle: "柱 2：複雑なフォームも1クリックで正確に入力",
      p2ModalSub: "公的証明書から情報を抽出し、ブラウザ内のAES-256暗号化保管庫から瞬時に自動入力します。",
      p2ModalBadge: "スマート暗号保管庫＆自動入力",
      p2Steps: [
        { title: "1. 1回限りの書類読み取り (OCR)", desc: "パスポートや身分証を読み取り後、元ファイルはメモリから即座に完全消去されます。" },
        { title: "2. 端末内 AES-256-GCM 暗号化", desc: "データはお客様のパソコン内でのみ暗号化・復号され、外部に平文が漏れることはありません。" },
        { title: "3. 20項目以上のスマート照合", desc: "氏名、生年月日、有効期限などの主要項目を行政ポータルに一括入力します。" },
        { title: "4. パスワード等の完全除外", desc: "パスワードやクレジットカード番号、暗証番号は一切取得・入力されません。" }
      ],
      p2Security: "ゼロ知識設計：Telmyサーバーには暗号化された文字データのみが保存されます。",
      p3ModalTitle: "柱 3：提出前の信号機エラー監査",
      p3ModalSub: "記入漏れやフォーマットの不一致を提出前にチェックし、再申請の手間や手数料の無駄を防ぎます。",
      p3ModalBadge: "提出前セーフティ監査",
      p3Steps: [
        { title: "1. 必須項目の未入力検知（赤ランプ）", desc: "必須入力漏れや同意チェックボックスの未選択を送信前に警告します。" },
        { title: "2. 書式・日付形式の検証（黄ランプ）", desc: "年/月/日の並び順の違いやパスポート番号の空白文字を検知します。" },
        { title: "3. パスポート名との一致確認（緑ランプ）", desc: "登録データと証明書のスペルが完全に一致しているかを照合します。" },
        { title: "4. 自信を持って申請完了", desc: "記入ミスによる却下の不安を解消し、安心して申請手続きを完了できます。" }
      ],
      p3Security: "監査処理はお使いのブラウザ内で行われ、第三者による手動閲覧は一切ありません。"
    }
  }

  const cur = i18n[lang as keyof typeof i18n] || i18n.en

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
            className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 text-slate-900 p-6 sm:p-8 flex flex-col gap-6"
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

            {/* Modal Body: Left Big GIF + Right Step Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Big High-Res GIF Display */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-xl p-1">
                <img
                  src={modalData.gifSrc}
                  alt={modalData.title}
                  className="w-full h-auto rounded-xl object-contain"
                />
                <div className="p-3 text-center bg-slate-900 text-slate-300 text-xs flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{cur.modalRecording}</span>
                </div>
              </div>

              {/* Right Steps Breakdown */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    {cur.modalHowTitle}
                  </h4>
                  <div className="space-y-4">
                    {modalData.steps.map((st, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 transition-colors"
                      >
                        <h5 className="font-bold text-slate-900 text-sm">
                          {st.title}
                        </h5>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Guarantee Note */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">{cur.modalPrivTitle}</span>
                    <span className="text-emerald-800 leading-relaxed">{modalData.securityNote}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <a href="/download" className="w-full">
                    <button className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span>{cur.modalCta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
