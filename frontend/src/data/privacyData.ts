import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface SectionContent {
  title: string;
  body: string | string[];
}

export interface LegalPageTranslation {
  badge: string;
  title: string;
  lastUpdated: string;
  summaryTitle: string;
  summaryPoints: string[];
  sections: SectionContent[];
}

export const PRIVACY_TRANSLATIONS: Record<string, LegalPageTranslation> = {
  en: {
    badge: "Official Privacy Policy",
    title: "Privacy Policy for Telmy.ai & Browser Extension",
    lastUpdated: "Last Updated: October 2026 • Valid for Google Chrome, Microsoft Edge, Firefox, and Opera extensions.",
    summaryTitle: "Summary of Our Privacy Guarantee:",
    summaryPoints: [
      "Zero Plaintext: Your profile data is encrypted on your device using AES-256-GCM. We never hold your keys.",
      "Zero Document Storage: Uploaded identity cards and diplomas are analyzed in temporary RAM and immediately discarded.",
      "Zero Authentication Capture: Passwords, credit cards, CVVs, and OTP inputs are never captured or recorded.",
      "No Data Brokering: We never sell, monetize, or transfer personal data to advertising networks."
    ],
    sections: [
      {
        title: "1. Information We Collect and Process",
        body: [
          "Telmy.ai operates as a browser extension and client-side assistance tool. To assist you with filling and auditing official forms, Telmy processes the following categories of information:",
          "• Form Context & Field Labels: HTML form field names, input descriptions, labels, and relevant on-screen instructions required to provide contextual explanations.",
          "• Encrypted User Vault: User-supplied details (such as full name, date of birth, and contact information) entered into the Telmy Smart Vault. This data is encrypted locally using the Web Crypto API prior to any cloud synchronization.",
          "• Temporary Document Extractions: When you upload a passport or certificate to autofill forms, OCR extraction is executed ephemerally. The source document file is purged from memory once extraction completes."
        ]
      },
      {
        title: "2. Single-Purpose Exemption for Passwords & Financial Data",
        body: [
          "In strict accordance with Google Chrome Web Store User Data FAQ and Mozilla AMO Add-on Policies:",
          "Telmy.ai is engineered with hardcoded client-side filters that prevent access to input tags with type=\"password\", credit card number patterns, security CVV numbers, bank PINs, and one-time authentication tokens (OTP). Such inputs are completely ignored and never processed."
        ]
      },
      {
        title: "3. How Cloud AI Analysis Works",
        body: [
          "To provide natural language explanations and audio voice guidance, Telmy transmits non-sensitive form field questions and contextual descriptions to Google Gemini models via Google Cloud infrastructure.",
          "Before any request leaves your device, Telmy runs a client-side regex scrubber that masks personal identifiers (such as national ID numbers, passport codes, and phone numbers). Google Cloud does not use data submitted through enterprise API endpoints to train underlying foundation models."
        ]
      },
      {
        title: "4. Permissions Used in Browser Extensions",
        body: [
          "Telmy requests only permissions strictly necessary to deliver its core features:",
          "• sidePanel: To render the friendly conversational assistant beside your webpage.",
          "• activeTab & scripting: To read form field labels on the active web page only when the user requests an explanation or audit.",
          "• storage: To save your client-side encrypted vault and accessibility profile preferences."
        ]
      },
      {
        title: "5. User Control & Data Deletion",
        body: [
          "You retain complete control over your stored credentials. You may clear your encrypted vault, remove saved profiles, or uninstall the extension at any time directly through the extension settings, which permanently wipes all locally stored keys."
        ]
      },
      {
        title: "6. Contact & Data Protection Officer",
        body: [
          "For questions regarding this Privacy Policy or security practices, reach out to our team at:",
          "Email: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  id: {
    badge: "Kebijakan Privasi Resmi",
    title: "Kebijakan Privasi Telmy.ai & Ekstensi Browser",
    lastUpdated: "Terakhir Diperbarui: Oktober 2026 • Berlaku untuk ekstensi Google Chrome, Microsoft Edge, Firefox, dan Opera.",
    summaryTitle: "Ringkasan Jaminan Privasi Kami:",
    summaryPoints: [
      "Nol Plaintext: Data profil Anda dienkripsi di perangkat Anda dengan AES-256-GCM. Kami tidak pernah memegang kunci Anda.",
      "Nol Penyimpanan Dokumen: KTP, paspor, dan ijazah yang diunggah diproses di RAM sementara lalu langsung dimusnahkan.",
      "Nol Perekaman Autentikasi: Password, nomor kartu kredit, CVV, dan kode OTP tidak pernah dibaca atau dicatat.",
      "Tanpa Broker Data: Kami tidak pernah menjual, mengomersialkan, atau mentransfer data pribadi ke jaringan periklanan."
    ],
    sections: [
      {
        title: "1. Informasi yang Kami Kumpulkan dan Proses",
        body: [
          "Telmy.ai beroperasi sebagai ekstensi browser dan alat pendamping sisi klien. Untuk membantu Anda memahami dan memeriksa formulir resmi, Telmy memproses kategori informasi berikut:",
          "• Konteks Formulir & Label Kolom: Nama kolom HTML, label formulir, deskripsi, dan petunjuk di layar yang dibutuhkan untuk menghasilkan penjelasan.",
          "• Brankas Terenkripsi Pengguna: Informasi yang Anda simpan secara sadar (seperti nama lengkap, tanggal lahir, kontak) di Brankas Pintar Telmy. Data ini dienkripsi secara lokal memakai Web Crypto API sebelum sinkronisasi cloud.",
          "• Ekstraksi Dokumen Sementara: Saat Anda mengunggah paspor atau berkas identitas untuk mengisi formulir, ekstraksi OCR berjalan secara fana (ephemeral) dan file sumber langsung dihapus permanen dari memori setelah selesai."
        ]
      },
      {
        title: "2. Pengecualian Ketat untuk Password & Data Keuangan",
        body: [
          "Sesuai dengan Kebijakan Data Pengguna Google Chrome Web Store dan Mozilla AMO:",
          "Telmy.ai memiliki filter kode sisi klien yang mutlak memblokir akses ke input berjenis password, pola nomor kartu kredit, CVV, PIN perbankan, dan token OTP. Kolom-kolom tersebut sepenuhnya diabaikan dan tidak pernah diproses."
        ]
      },
      {
        title: "3. Cara Kerja Analisis AI Cloud",
        body: [
          "Untuk menyajikan penjelasan bahasa alami dan panduan audio, Telmy meneruskan teks pertanyaan dan label kolom yang tidak sensitif ke model Google Gemini melalui infrastruktur Google Cloud.",
          "Sebelum data dikirim dari browser Anda, Telmy menjalankan pembersih regex otomatis untuk menyamarkan identitas pribadi (seperti NIK, nomor paspor, dan telepon). Google Cloud tidak menggunakan data API enterprise ini untuk melatih model AI publik."
        ]
      },
      {
        title: "4. Izin Ekstensi Browser yang Digunakan",
        body: [
          "Telmy hanya meminta izin minimum yang mutlak diperlukan:",
          "• sidePanel: Untuk menampilkan panel asisten ramah di sisi samping halaman formulir Anda.",
          "• activeTab & scripting: Untuk membaca label kolom formulir di halaman aktif HANYA ketika Anda meminta penjelasan atau audit.",
          "• storage: Untuk menyimpan brankas terenkripsi sisi klien dan preferensi aksesibilitas Anda."
        ]
      },
      {
        title: "5. Kendali Pengguna & Penghapusan Data",
        body: [
          "Kendali data berada seutuhnya di tangan Anda. Anda dapat mengosongkan brankas, menghapus profil tersimpan, atau mencopot pemasangan ekstensi kapan saja. Tindakan ini seketika memusnahkan semua kunci enkripsi lokal."
        ]
      },
      {
        title: "6. Kontak & Petugas Perlindungan Data",
        body: [
          "Untuk pertanyaan seputar Kebijakan Privasi atau standar keamanan kami, silakan hubungi tim kami:",
          "Email: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  ms: {
    badge: "Dasar Privasi Rasmi",
    title: "Dasar Privasi untuk Telmy.ai & Sambungan Penyemak Imbas",
    lastUpdated: "Kemaskini Terakhir: Oktober 2026 • Sah untuk sambungan Google Chrome, Microsoft Edge, Firefox, dan Opera.",
    summaryTitle: "Ringkasan Jaminan Privasi Kami:",
    summaryPoints: [
      "Sifar Teks Biasa: Data profil anda disulitkan pada peranti anda menggunakan AES-256-GCM. Kami tidak pernah memegang kunci anda.",
      "Sifar Simpanan Dokumen: Kad pengenalan dan sijil yang dimuat naik diproses dalam RAM sementara dan dipadam serta-merta.",
      "Sifar Tangkapan Pengesahan: Kata laluan, kad kredit, CVV, dan kod OTP tidak pernah ditangkap atau dirakam.",
      "Tiada Penjualan Data: Kami tidak pernah menjual atau memindahkan data peribadi anda kepada rangkaian pengiklanan."
    ],
    sections: [
      {
        title: "1. Maklumat yang Kami Kumpul dan Proses",
        body: [
          "Telmy.ai berfungsi sebagai alat bantuan penyemak imbas sisi pelanggan. Untuk membantu anda mengisi dan menyemak borang rasmi, Telmy memproses kategori maklumat berikut:",
          "• Konteks Borang & Label Medan: Nama medan HTML, perihalan, dan arahan pada skrin yang diperlukan untuk memberi penerangan tepat.",
          "• Peti Simpanan Disulitkan: Butiran yang anda masukkan ke dalam Peti Pintar Telmy. Data ini disulitkan secara setempat sebelum penyegerakan awan.",
          "• Pengekstrakan Dokumen Sementara: Pengimbasan OCR dijalankan dalam memori sementara dan fail dokumen asal dipadam kekal selepas selesai."
        ]
      },
      {
        title: "2. Pengecualian Khas untuk Kata Laluan & Data Kewangan",
        body: [
          "Mengikut dasar ketat Google Chrome Web Store dan Mozilla AMO:",
          "Telmy.ai diprogramkan untuk mengabaikan medan kata laluan, nombor kad kredit, CVV, PIN bank, dan token OTP secara automatik."
        ]
      },
      {
        title: "3. Bagaimana Analisis AI Awan Berfungsi",
        body: [
          "Untuk memberikan penjelasan bahasa mudah, Telmy menghantar soalan borang bukan sensitif kepada model Google Gemini melalui Google Cloud.",
          "Sebelum dihantar, penapis regex tempatan menyamarkan maklumat pengenalan peribadi seperti kad pengenalan dan nombor pasport."
        ]
      },
      {
        title: "4. Keizinan Sambungan Penyemak Imbas",
        body: [
          "Telmy hanya meminta keizinan yang penting untuk fungsinya:",
          "• sidePanel: Memaparkan pembantu di sisi halaman web anda.",
          "• activeTab & scripting: Membaca medan borang hanya apabila diminta oleh pengguna.",
          "• storage: Menyimpan peti disulitkan dan tetapan kebolehcapaian anda."
        ]
      },
      {
        title: "5. Kawalan Pengguna & Pemadaman Data",
        body: [
          "Anda mempunyai kawalan penuh ke atas data anda. Anda boleh memadam peti simpanan atau membuang sambungan pada bila-bila masa."
        ]
      },
      {
        title: "6. Hubungi Kami",
        body: [
          "Untuk sebarang pertanyaan berkaitan privasi, hubungi kami di:",
          "E-mel: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  ja: {
    badge: "公式プライバシーポリシー",
    title: "Telmy.ai およびブラウザ拡張機能 プライバシーポリシー",
    lastUpdated: "最終更新日: 2026年10月 • Google Chrome、Microsoft Edge、Firefox、Opera 拡張機能に適用",
    summaryTitle: "プライバシー保護への誓約サマリー:",
    summaryPoints: [
      "平文データゼロ: お客様のプロフィール情報はAES-256-GCMにより端末上で暗号化されます。運営が復号キーを保持することはありません。",
      "書類の永久保存ゼロ: アップロードされた身分証や証明書は一時メモリ内でのみ処理され、即座に完全破棄されます。",
      "認証情報の取得ゼロ: パスワード、クレジットカード番号、CVV、ワンタイムパスワード（OTP）は一切検出・記録しません。",
      "第三者へのデータ販売ゼロ: 個人データを広告ネットワークや第三者に販売・提供することは決してありません。"
    ],
    sections: [
      {
        title: "1. 収集および処理する情報",
        body: [
          "Telmy.aiはブラウザ拡張機能およびクライアントサイド支援ツールとして動作します。公的申請フォームの解説および監査を提供するため、以下の情報を取り扱います:",
          "• フォームのコンテキストと項目ラベル: 各項目の意図を正確に解説するために必要なHTML項目名および画面上の指示事項。",
          "• 暗号化スマート保管庫: お客様自身が登録した氏名や連絡先情報。これらはWeb Crypto APIを用いて端末内で暗号化されてから同期されます。",
          "• 一時的な書類抽出（OCR）: パスポート等から必要事項を自動入力する際、メモリ上で一時的にOCR処理が行われ、完了後ファイルデータは即時消去されます。"
        ]
      },
      {
        title: "2. パスワードおよび財務情報の完全除外",
        body: [
          "Chrome ウェブストアおよび Mozilla AMO のセキュリティポリシーに厳格に準拠し、Telmy.aiはtype=\"password\"の入力欄、クレジットカード番号、セキュリティコード、金融機関暗証番号、ワンタイムパスワード（OTP）を自動的にスキップし、一切読み取りを行いません。"
        ]
      },
      {
        title: "3. クラウドAI解析の仕組み",
        body: [
          "自然言語による解説を生成するため、非機密の質問項目テキストのみがGoogle Cloud上のGeminiモデルに送信されます。",
          "端末から送信される前に、正規表現フィルターによりパスポート番号や個人番号等の固有識別子はマスク（匿名化）されます。企業向けAPI契約に基づき、データがAIモデルの再学習に使用されることはありません。"
        ]
      },
      {
        title: "4. ブラウザ拡張機能の権限について",
        body: [
          "必要最小限の権限のみを要求します:",
          "• sidePanel: フォーム入力画面の横に対話型アシスタントを表示するため。",
          "• activeTab & scripting: ユーザーが解説や監査を求めた際にのみ、アクティブなタブの入力ラベルを読み取るため。",
          "• storage: クライアント側で暗号化されたデータやアクセシビリティ設定を端末内に保存するため。"
        ]
      },
      {
        title: "5. ユーザーによる管理とデータ削除",
        body: [
          "お客様はいつでもご自身のデータを完全に管理できます。設定画面から保管庫をクリアしたり拡張機能をアンインストールすることで、端末内のすべての暗号化キーを完全に消去できます。"
        ]
      },
      {
        title: "6. お問い合わせ窓口",
        body: [
          "プライバシー保護に関するご質問は、下記窓口までお気軽にお問い合わせください:",
          "メール: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  ko: {
    badge: "공식 개인정보 처리방침",
    title: "Telmy.ai 및 브라우저 확장 프로그램 개인정보 처리방침",
    lastUpdated: "최종 수정일: 2026년 10월 • Chrome, Edge, Firefox, Opera 확장 프로그램 적용",
    summaryTitle: "Telmy 개인정보 보호 핵심 요약:",
    summaryPoints: [
      "평문 저장 제로: 사용자 프로필 데이터는 기기 내부에서 AES-256-GCM 알고리즘으로 즉시 암호화됩니다. 당사는 복호화 키를 보유하지 않습니다.",
      "서류 보관 제로: 자동 입력을 위해 업로드된 여권 및 증명서는 임시 메모리에서만 분석된 후 즉각 파기됩니다.",
      "비밀번호 및 금융 정보 수집 배제: 비밀번호, 신용카드 번호, CVV, OTP 등 민감한 인증 정보는 절대 감지하거나 기록하지 않습니다.",
      "데이터 판매 금지: 사용자의 개인정보를 광고 네트워크나 제3자 데이터 중개업체에 판매하거나 제공하지 않습니다."
    ],
    sections: [
      {
        title: "1. 수집 및 처리하는 정보",
        body: [
          "Telmy.ai는 브라우저 확장 프로그램 기반 클라이언트 지원 도구입니다. 공식 서식 작성을 돕기 위해 다음 항목을 처리합니다:",
          "• 서식 항목 레이블 및 문맥: 질문을 쉽게 풀어서 설명하기 위해 필요한 화면 상의 필드 명칭 및 안내 문구.",
          "• 암호화된 사용자 보관함: 사용자가 직접 스마트 보관함에 저장한 기본 정보(성명, 생년월일 등). 기기 내 Web Crypto API를 통해 암호화된 상태로만 보관됩니다.",
          "• 일회성 문서 데이터 추출: 여권이나 증명서를 업로드하여 서식을 채울 때, OCR 추출 후 원본 파일은 메모리에서 즉시 영구 삭제됩니다."
        ]
      },
      {
        title: "2. 비밀번호 및 금융 데이터 감지 차단",
        body: [
          "Chrome 웹 스토어 및 Mozilla의 사용자 데이터 정책에 따라, Telmy는 type=\"password\" 입력창, 신용카드 번호, CVC/CVV, 은행 비밀번호, 일회용 인증코드(OTP)에 접근하지 못하도록 코드로 철저히 차단되어 있습니다."
        ]
      },
      {
        title: "3. 클라우드 AI 분석 및 보안",
        body: [
          "명확한 질문 설명을 생성하기 위해 비민감 항목 안내문만 Google Cloud 인프라의 Gemini 모델로 전송됩니다.",
          "네트워크로 전송되기 전 브라우저 내부에서 고유 식별자(여권번호, 주민등록번호 등)는 자동으로 비식별화(마스킹) 처리되며, 기업용 API를 통해 처리되므로 AI 학습에 사용되지 않습니다."
        ]
      },
      {
        title: "4. 사용 권한 안내",
        body: [
          "필수적인 최소 권한만 사용합니다:",
          "• sidePanel: 작성 중인 화면 옆에 친절한 AI 조력자 패널을 표시합니다.",
          "• activeTab & scripting: 사용자가 요청할 때만 활성 페이지의 서식 라벨을 읽습니다.",
          "• storage: 기기 내 암호화 보관함 및 접근성 설정값을 저장합니다."
        ]
      },
      {
        title: "5. 사용자 데이터 통제권 및 삭제",
        body: [
          "사용자는 언제든지 확장 프로그램 설정에서 저장된 프로필을 삭제하거나 확장 프로그램을 제거하여 로컬에 저장된 모든 암호화 키를 완전히 파기할 수 있습니다."
        ]
      },
      {
        title: "6. 개인정보 보호 담당자 문의",
        body: [
          "개인정보 처리방침과 관련된 문의는 언제든지 아래로 연락주시기 바랍니다:",
          "이메일: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  zh: {
    badge: "官方隐私权政策",
    title: "Telmy.ai 与浏览器扩展程序 隐私权政策",
    lastUpdated: "最后更新：2026年10月 • 适用于 Google Chrome、Edge、Firefox 及 Opera 浏览器扩展",
    summaryTitle: "我们的隐私安全保证核心摘要：",
    summaryPoints: [
      "零明文存储：您的档案资料均在设备本地通过 AES-256-GCM 算法加密，我们绝不掌握您的解密密钥。",
      "零文件留存：上传用于自动填表的护照与证件仅在临时内存中进行 OCR 解析，完成后立即永久粉碎。",
      "零密码采集：密码框、信用卡号、CVV 安全码及动态验证码（OTP）均受到硬编码级别的屏蔽，绝不采集。",
      "绝不出售数据：我们绝不会将您的个人数据出售、商业化或提供给任何广告网络。"
    ],
    sections: [
      {
        title: "1. 我们收集与处理的信息",
        body: [
          "Telmy.ai 作为一款浏览器端辅助工具，在为您提供官方表单指引与核查时仅处理以下必要信息：",
          "• 表单上下文与输入框标签：用于准确解读填报要求所必需的 HTML 字段名称与屏幕说明文本。",
          "• 加密保险箱资料：您主动保存在 Telmy 智能保险箱中的常用信息。这些数据在同步前均已在本地设备完成加密。",
          "• 临时证件解析：上传证件自动识别填表时，OCR 仅在内存临时运行，提取字段后原文件即刻彻底销毁。"
        ]
      },
      {
        title: "2. 对密码及敏感金融信息的严格屏蔽",
        body: [
          "严格遵循 Chrome 应用商店及 Mozilla 开发者数据安全政策：",
          "Telmy 内置硬编码拦截规则，对 type=\"password\" 字段、银行卡卡号规则、CVV 码、网银 PIN 码及 OTP 动态验证码完全忽略，绝不记录任何凭据。"
        ]
      },
      {
        title: "3. 云端 AI 分析与隐私防护机制",
        body: [
          "为提供易懂的通俗语言解释，Telmy 仅将不含个人敏感隐私的表单问题文本通过 Google Cloud 传输至 Gemini 基础模型。",
          "在任何网络请求发出前，本地正则表达式过滤器会自动遮盖证件号、护照号与电话号码。企业级 API 绝不使用用户数据进行模型公开训练。"
        ]
      },
      {
        title: "4. 浏览器扩展所请求的权限",
        body: [
          "仅请求实现核心功能所不可或缺的权限：",
          "• sidePanel：在表单页面右侧呈现贴心的对话式指引面板。",
          "• activeTab 与 scripting：仅在您主动请求协助时读取当前页面的表单标签文字。",
          "• storage：安全保存设备本地的加密保险箱及无障碍辅助偏好。"
        ]
      },
      {
        title: "5. 用户控制权与数据注销",
        body: [
          "您对个人数据享有绝对控制权。可随时在扩展设置中一键清空保险箱或卸载扩展，这将永久清除设备本地存储的所有加密密钥。"
        ]
      },
      {
        title: "6. 联系我们与数据保护专员",
        body: [
          "若您对本隐私政策有任何疑问，请随时联系我们的安全团队：",
          "电子邮箱：privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  'zh-TW': {
    badge: "官方隱私權政策",
    title: "Telmy.ai 與瀏覽器擴充功能 隱私權政策",
    lastUpdated: "最後更新：2026年10月 • 適用於 Google Chrome、Edge、Firefox 及 Opera 瀏覽器擴充",
    summaryTitle: "我們的隱私安全保證核心摘要：",
    summaryPoints: [
      "零明文儲存：您的個人檔案資料均在裝置本機透過 AES-256-GCM 加密，我們絕不持有您的解密金鑰。",
      "零檔案留存：上傳用於填表輔助的護照與證件僅在暫存記憶體中進行 OCR 解析，完成後立即永久粉碎。",
      "零密碼擷取：密碼欄位、信用卡號、CVV 安全碼及動態驗證碼（OTP）均受到嚴格硬編碼屏蔽，絕不擷取。",
      "絕不出售數據：我們絕不會將您的個人資料出售、變現或轉移給任何廣告商。"
    ],
    sections: [
      {
        title: "1. 我們蒐集與處理的資訊",
        body: [
          "Telmy.ai 作為瀏覽器端輔助工具，在為您提供官方表單指引與核查時僅處理以下必要資訊：",
          "• 表單上下文與欄位標籤：用以準確解讀填報規定所必需的 HTML 欄位名稱與螢幕說明文字。",
          "• 加密保險箱資料：您主動保存在 Telmy 智慧保險箱中的常用資訊。這些資料在同步前均已於本機完成加密。",
          "• 暫時性文件解析：上傳證件自動辨識填表時，OCR 僅在記憶體中暫時運行，擷取欄位後原始檔案即刻徹底銷毀。"
        ]
      },
      {
        title: "2. 對密碼及金融資訊的嚴格屏蔽",
        body: [
          "嚴格遵循 Chrome 線上應用程式商店及 Mozilla 開發者安全政策：",
          "Telmy 內建硬編碼攔截規則，對 type=\"password\" 欄位、信用卡號、CVV 碼、銀行 PIN 碼及 OTP 動態驗證碼完全忽略，絕不記錄任何機密憑證。"
        ]
      },
      {
        title: "3. 雲端 AI 分析與隱私防護機制",
        body: [
          "為提供親切易懂的通俗語言解說，Telmy 僅將不含個人身分隱私的表單題目文字透過 Google Cloud 傳輸至 Gemini 模型。",
          "在任何網路請求發出前，本機正則表達式過濾器會自動遮蓋證件號碼、護照號碼與聯絡電話。企業級 API 絕不將用戶資料用於模型訓練。"
        ]
      },
      {
        title: "4. 瀏覽器擴充功能所使用的權限",
        body: [
          "僅請求實現核心輔助功能所不可或缺的權限：",
          "• sidePanel：在表單網頁旁開啟親切的對話式引導側邊欄。",
          "• activeTab 與 scripting：僅在您主動請求協助時讀取當前分頁的表單標籤。",
          "• storage：安全儲存裝置本機的加密保險箱與無障礙個人偏好設定。"
        ]
      },
      {
        title: "5. 使用者控制權與資料刪除",
        body: [
          "您對個人資料享有完全的主導權。隨時可在擴充設定中一鍵清空保險箱或解除安裝擴充套件，這將即刻永久銷毀本機儲存的所有加密金鑰。"
        ]
      },
      {
        title: "6. 聯絡我們與資料保護專員",
        body: [
          "若您對本隱私政策有任何疑問，歡迎隨時聯絡我們的團隊：",
          "電子郵件：privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  vi: {
    badge: "Chính sách Quyền riêng tư Chính thức",
    title: "Chính sách Quyền riêng tư cho Telmy.ai & Tiện ích Mở rộng Trình duyệt",
    lastUpdated: "Cập nhật lần cuối: Tháng 10 năm 2026 • Áp dụng cho tiện ích Chrome, Edge, Firefox và Opera.",
    summaryTitle: "Tóm tắt Cam kết Quyền riêng tư của Chúng tôi:",
    summaryPoints: [
      "Không lưu văn bản thô: Dữ liệu hồ sơ của bạn được mã hóa trên thiết bị bằng AES-256-GCM. Chúng tôi không bao giờ giữ khóa của bạn.",
      "Không lưu giữ tài liệu: Hộ chiếu và chứng chỉ tải lên chỉ được phân tích trong RAM tạm thời rồi hủy ngay lập tức.",
      "Không ghi nhận mật khẩu: Mật khẩu, số thẻ tín dụng, mã CVV và mã OTP hoàn toàn bị chặn và không bao giờ được ghi lại.",
      "Không buôn bán dữ liệu: Chúng tôi không bao giờ bán hoặc chia sẻ dữ liệu cá nhân cho các mạng quảng cáo."
    ],
    sections: [
      {
        title: "1. Thông tin Chúng tôi Thu thập và Xử lý",
        body: [
          "Telmy.ai hoạt động như một tiện ích hỗ trợ phía người dùng. Để giúp bạn điền và kiểm tra biểu mẫu, Telmy xử lý các thông tin sau:",
          "• Nhãn trường & Ngữ cảnh Biểu mẫu: Tên trường HTML và chỉ dẫn trên màn hình cần thiết để tạo giải thích trực quan.",
          "• Két lưu trữ Mã hóa: Thông tin bạn lưu trong Két Thông minh được mã hóa cục bộ bằng Web Crypto API trước khi đồng bộ đám mây.",
          "• Trích xuất Tài liệu Tạm thời: Trích xuất OCR chạy trong bộ nhớ tạm và tệp gốc bị xóa vĩnh viễn ngay khi hoàn tất."
        ]
      },
      {
        title: "2. Loại trừ Tuyệt đối Mật khẩu & Dữ liệu Tài chính",
        body: [
          "Tuân thủ nghiêm ngặt chính sách Chrome Web Store và Mozilla AMO:",
          "Telmy.ai được thiết lập bộ lọc cứng chặn hoàn toàn các ô mật khẩu, thẻ tín dụng, mã CVV và mã xác thực OTP."
        ]
      },
      {
        title: "3. Cơ chế Hoạt động của AI Đám mây",
        body: [
          "Để đưa ra giải thích dễ hiểu, Telmy chỉ gửi các câu hỏi biểu mẫu không nhạy cảm đến mô hình Google Gemini trên hạ tầng Google Cloud.",
          "Trước khi gửi, bộ lọc regex phía thiết bị sẽ che giấu các số định danh cá nhân (như số CMND/CCCD, hộ chiếu, số điện thoại)."
        ]
      },
      {
        title: "4. Quyền Hạn Tiện ích Yêu cầu",
        body: [
          "Telmy chỉ yêu cầu những quyền tối thiểu cần thiết:",
          "• sidePanel: Để hiển thị bảng trợ lý tiện lợi bên cạnh biểu mẫu.",
          "• activeTab & scripting: Đọc nhãn trường biểu mẫu khi bạn yêu cầu hỗ trợ.",
          "• storage: Lưu trữ két mã hóa an toàn và các tùy chọn trợ năng."
        ]
      },
      {
        title: "5. Quyền Kiểm soát của Người dùng & Xóa Dữ liệu",
        body: [
          "Bạn có toàn quyền kiểm soát dữ liệu. Bạn có thể xóa két lưu trữ hoặc gỡ cài đặt tiện ích bất kỳ lúc nào để hủy toàn bộ khóa mã hóa cục bộ."
        ]
      },
      {
        title: "6. Liên hệ",
        body: [
          "Nếu có câu hỏi về quyền riêng tư, vui lòng liên hệ:",
          "Email: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  th: {
    badge: "นโยบายความเป็นส่วนตัวอย่างเป็นทางการ",
    title: "นโยบายความเป็นส่วนตัวสำหรับ Telmy.ai และส่วนขยายเบราว์เซอร์",
    lastUpdated: "อัปเดตล่าสุด: ตุลาคม 2026 • มีผลสำหรับส่วนขยาย Chrome, Edge, Firefox และ Opera",
    summaryTitle: "สรุปคำมั่นสัญญาด้านความเป็นส่วนตัวของเรา:",
    summaryPoints: [
      "ไม่เก็บข้อความธรรมดา: ข้อมูลโปรไฟล์ของคุณได้รับการเข้ารหัสบนอุปกรณ์ด้วย AES-256-GCM เราไม่เคยมียกุญแจถอดรหัสของคุณ",
      "ไม่กักเก็บเอกสาร: หนังสือเดินทางและเอกสารที่อัปโหลดจะถูกประมวลผลใน RAM ชั่วคราวและลบทำลายทันที",
      "ไม่ดักจับรหัสผ่าน: รหัสผ่าน, หมายเลขบัตรเครดิต, CVV และรหัส OTP จะถูกข้ามและไม่ถูกบันทึกเด็ดขาด",
      "ไม่ขายข้อมูล: เราไม่เคยขายหรือถ่ายโอนข้อมูลส่วนบุคคลของคุณไปยังเครือข่ายโฆษณา"
    ],
    sections: [
      {
        title: "1. ข้อมูลที่เราเก็บรวบรวมและประมวลผล",
        body: [
          "Telmy.ai ทำหน้าที่เป็นส่วนขยายช่วยเหลือบนเบราว์เซอร์ เพื่อช่วยคุณกรอกและตรวจสอบแบบฟอร์ม Telmy จะประมวลผลข้อมูลต่อไปนี้:",
          "• ป้ายกำกับและบริบทของแบบฟอร์ม: ชื่อฟิลด์ HTML และคำแนะนำบนหน้าจอที่จำเป็นสำหรับการอธิบาย",
          "• ตู้นิรภัยที่เข้ารหัสของผู้ใช้: ข้อมูลที่คุณบันทึกใน Telmy Smart Vault ข้อมูลนี้จะถูกเข้ารหัสภายในเครื่องก่อนซิงค์คลาวด์",
          "• การดึงข้อมูลเอกสารชั่วคราว: การสแกน OCR จะทำงานในหน่วยความจำชั่วคราว และไฟล์ต้นฉบับจะถูกลบถาวรทันทีที่เสร็จสิ้น"
        ]
      },
      {
        title: "2. ข้อยกเว้นเด็ดขาดสำหรับรหัสผ่านและข้อมูลทางการเงิน",
        body: [
          "ตามนโยบายความปลอดภัยของ Chrome Web Store และ Mozilla AMO:",
          "Telmy.ai ได้รับการตั้งโปรแกรมให้บล็อกการเข้าถึงฟิลด์รหัสผ่าน บัตรเครดิต CVV และรหัส OTP อย่างสมบูรณ์"
        ]
      },
      {
        title: "3. การทำงานของระบบ AI บนคลาวด์",
        body: [
          "เพื่อให้คำอธิบายเป็นภาษาที่เข้าใจง่าย Telmy จะส่งเฉพาะคำถามแบบฟอร์มที่ไม่เป็นความลับไปยังโมเดล Google Gemini ผ่านโครงสร้างพื้นฐาน Google Cloud",
          "ก่อนส่งข้อมูล ตัวกรอง regex ในเครื่องจะซ่อนข้อมูลระบุตัวบุคคล เช่น หมายเลขบัตรประชาชนและหนังสือเดินทาง"
        ]
      },
      {
        title: "4. สิทธิ์การใช้งานที่ส่วนขยายต้องการ",
        body: [
          "Telmy ขอเฉพาะสิทธิ์ที่จำเป็นอย่างยิ่งเท่านั้น:",
          "• sidePanel: เพื่อแสดงแผงผู้ช่วยที่สะดวกสบายข้างแบบฟอร์มของคุณ",
          "• activeTab & scripting: เพื่ออ่านป้ายกำกับแบบฟอร์มเมื่อคุณร้องขอคำอธิบายเท่านั้น",
          "• storage: เพื่อบันทึกตู้นิรภัยที่เข้ารหัสและการตั้งค่าการเข้าถึงของคุณ"
        ]
      },
      {
        title: "5. การควบคุมของผู้ใช้และการลบข้อมูล",
        body: [
          "คุณมีอำนาจควบคุมข้อมูลอย่างสมบูรณ์ คุณสามารถล้างตู้นิรภัยหรือถอนการติดตั้งส่วนขยายได้ตลอดเวลา ซึ่งจะล้างคีย์การเข้ารหัสทั้งหมดทันที"
        ]
      },
      {
        title: "6. ติดต่อเรา",
        body: [
          "หากมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว ติดต่อเราได้ที่:",
          "อีเมล: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  hi: {
    badge: "आधिकारिक गोपनीयता नीति",
    title: "Telmy.ai और ब्राउज़र एक्सटेंशन के लिए गोपनीयता नीति",
    lastUpdated: "अंतिम अद्यतन: अक्टूबर 2026 • Chrome, Edge, Firefox, और Opera एक्सटेंशन के लिए मान्य",
    summaryTitle: "हमारी गोपनीयता गारंटी का सारांश:",
    summaryPoints: [
      "शून्य प्लेनटेक्स्ट: आपका प्रोफ़ाइल डेटा AES-256-GCM का उपयोग करके आपके डिवाइस पर एन्क्रिप्ट किया जाता है। हमारे पास आपकी चाबियां कभी नहीं होती हैं।",
      "शून्य दस्तावेज़ भंडारण: अपलोड किए गए पहचान पत्र और पासपोर्ट अस्थायी रैम में विश्लेषित किए जाते हैं और तुरंत हटा दिए जाते हैं।",
      "शून्य प्रमाणीकरण कैप्चर: पासवर्ड, क्रेडिट कार्ड नंबर, सीवीवी और ओटीपी को कभी भी कैप्चर या रिकॉर्ड नहीं किया जाता है।",
      "कोई डेटा ब्रोकिंग नहीं: हम कभी भी आपका व्यक्तिगत डेटा विज्ञापन नेटवर्क को बेचते या साझा नहीं करते हैं।"
    ],
    sections: [
      {
        title: "1. जानकारी जो हम एकत्र और संसाधित करते हैं",
        body: [
          "Telmy.ai एक ब्राउज़र एक्सटेंशन के रूप में कार्य करता है। आधिकारिक फॉर्म भरने और जांचने में आपकी सहायता के लिए Telmy निम्नलिखित श्रेणियों को संसाधित करता है:",
          "• फॉर्म संदर्भ और फ़ील्ड लेबल: प्रासंगिक व्याख्याएं प्रदान करने के लिए आवश्यक HTML फ़ील्ड नाम और ऑन-स्क्रीन निर्देश।",
          "• एन्क्रिप्टेड स्मार्ट वॉल्ट: आपके द्वारा सहेजी गई जानकारी। यह डेटा क्लाउड सिंक से पहले आपके डिवाइस पर स्थानीय रूप से एन्क्रिप्ट किया जाता है।",
          "• अस्थायी दस्तावेज़ निष्कर्षण: ओसीआर निष्कर्षण अस्थायी रूप से निष्पादित होता है और पूरा होने के बाद मूल दस्तावेज़ फ़ाइल तुरंत हटा दी जाती है।"
        ]
      },
      {
        title: "2. पासवर्ड और वित्तीय डेटा के लिए सख्त बहिष्करण",
        body: [
          "Google Chrome Web Store और Mozilla AMO नीतियों के सख्त अनुसार:",
          "Telmy.ai को पासवर्ड इनपुट, क्रेडिट कार्ड नंबर, सीवीवी और ओटीपी टोकन तक पहुंच को पूरी तरह से अनदेखा करने के लिए प्रोग्राम किया गया है।"
        ]
      },
      {
        title: "3. क्लाउड एआई विश्लेषण कैसे काम करता है",
        body: [
          "सरल भाषा में स्पष्टीकरण प्रदान करने के लिए, Telmy गैर-संवेदनशील फॉर्म प्रश्नों को Google Cloud के माध्यम से Google Gemini मॉडल में भेजता है।",
          "डेटा भेजने से पहले, स्थानीय फ़िल्टर राष्ट्रीय आईडी और पासपोर्ट नंबर जैसे व्यक्तिगत पहचानकर्ताओं को मास्क (छिपा) देता है।"
        ]
      },
      {
        title: "4. एक्सटेंशन अनुमतियां",
        body: [
          "Telmy केवल मुख्य सुविधाओं के लिए आवश्यक अनुमतियां मांगता है:",
          "• sidePanel: आपके वेबपेज के पास सहायक पैनल प्रदर्शित करने के लिए।",
          "• activeTab और scripting: उपयोगकर्ता द्वारा अनुरोध किए जाने पर ही फॉर्म लेबल पढ़ने के लिए।",
          "• storage: आपके एन्क्रिप्टेड वॉल्ट और एक्सेसिबिलिटी प्राथमिकताओं को सहेजने के लिए।"
        ]
      },
      {
        title: "5. उपयोगकर्ता नियंत्रण और डेटा हटाना",
        body: [
          "आपके पास अपने डेटा पर पूर्ण नियंत्रण है। आप कभी भी अपना वॉल्ट साफ़ कर सकते हैं या एक्सटेंशन अनइंस्टॉल कर सकते हैं।"
        ]
      },
      {
        title: "6. संपर्क",
        body: [
          "गोपनीयता नीति से संबंधित प्रश्नों के लिए हमारी टीम से संपर्क करें:",
          "ईमेल: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  },
  fil: {
    badge: "Opisyal na Patakaran sa Privacy",
    title: "Patakaran sa Privacy para sa Telmy.ai & Browser Extension",
    lastUpdated: "Huling Na-update: Oktubre 2026 • May bisa para sa Chrome, Edge, Firefox, at Opera extension.",
    summaryTitle: "Buod ng Aming Garantiya sa Privacy:",
    summaryPoints: [
      "Zero Plaintext: Ang data ng iyong profile ay naka-encrypt sa iyong device gamit ang AES-256-GCM. Hindi namin kailanman hawak ang iyong mga decryption key.",
      "Zero Document Storage: Ang mga na-upload na ID at pasaporte ay pinoproseso sa pansamantalang memorya at agad na itinatapon.",
      "Zero Authentication Capture: Ang mga password, credit card, CVV, at OTP ay hindi kailanman nire-record o kinukuha.",
      "Walang Pagbebenta ng Data: Hindi namin kailanman ibinebenta o ipinapasa ang iyong personal na data sa mga network ng ad."
    ],
    sections: [
      {
        title: "1. Impormasyong Aming Kinokolekta at Pinoproseso",
        body: [
          "Gumagana ang Telmy.ai bilang browser extension upang tulungan kang punan at suriin ang mga opisyal na form gamit ang mga sumusunod:",
          "• Konteksto ng Form at Mga Label: Mga pangalan ng field sa HTML at tagubilin na kailangan upang makapagbigay ng malinaw na paliwanag.",
          "• Naka-encrypt na Smart Vault: Mga detalye na iyong inilagay. Naka-encrypt ito sa iyong device gamit ang Web Crypto API bago i-sync.",
          "• Pansamantalang Pagkuha ng Dokumento: Ang pag-scan ng OCR ay pansamantala lamang, at ang orihinal na file ay agad na binubura pagkatapos."
        ]
      },
      {
        title: "2. Mahigpit na Pagbubukod sa Password at Data sa Pananalapi",
        body: [
          "Alinsunod sa mga patakaran ng Chrome Web Store at Mozilla AMO:",
          "Nakaharang ang Telmy.ai sa pag-access sa mga input ng password, credit card, CVV, at mga one-time code (OTP)."
        ]
      },
      {
        title: "3. Paano Gumagana ang Cloud AI Analysis",
        body: [
          "Upang makapagbigay ng madaling paliwanag, ipinapadala ng Telmy ang mga di-sensitibong tanong sa Google Gemini sa pamamagitan ng Google Cloud.",
          "Bago umalis ang data sa iyong device, awtomatikong itinatago ng local regex filter ang mga personal ID at numero ng pasaporte."
        ]
      },
      {
        title: "4. Mga Pahintulot na Ginagamit ng Extension",
        body: [
          "Hinihiling lamang ng Telmy ang mga kinakailangang pahintulot:",
          "• sidePanel: Upang ipakita ang magiliw na katulong sa tabi ng iyong webpage.",
          "• activeTab at scripting: Upang basahin ang mga label ng form kapag humiling ka ng tulong.",
          "• storage: Upang i-save ang iyong naka-encrypt na vault at mga kagustuhan."
        ]
      },
      {
        title: "5. Kontrol ng Gumagamit at Pagbura ng Data",
        body: [
          "Mayroon kang buong kontrol sa iyong data. Maaari mong burahin ang iyong vault o i-uninstall ang extension anumang oras."
        ]
      },
      {
        title: "6. Makipag-ugnayan sa Amin",
        body: [
          "Para sa mga katanungan tungkol sa aming Patakaran sa Privacy:",
          "Email: privacy@telmy.id / support@telmy.id"
        ]
      }
    ]
  }
};
