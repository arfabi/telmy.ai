window.GMT_MOCK_DICTIONARY = {
  "form_id": "apostille_ahu",
  "domain_pattern": "apostille.ahu.go.id",
  "title": "Permohonan Sertifikat Apostille Kemenkumham",
  "fields": [
    {
      "id": "nik_paspor",
      "patterns": ["nik", "nomor induk kependudukan", "no paspor", "passport", "no. ktp", "identitas"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "NIK / Nomor Paspor",
          "meaning": "Nomor identitas kependudukan resmi pemohon.",
          "how_to_fill": "WNI wajib memasukkan 16 digit NIK sesuai e-KTP. WNA masukkan nomor paspor yang masih aktif beserta kode negara.",
          "example": "3201234567890001 (WNI) / A12345678 (WNA)",
          "common_mistakes": "Typo pada angka NIK atau menggunakan nomor identitas yang sudah kedaluwarsa.",
          "foreign_note": "Pastikan paspor masih berlaku minimal 6 bulan saat pengajuan."
        },
        "en": {
          "label": "National ID / Passport Number",
          "meaning": "Official identity number of the applicant.",
          "how_to_fill": "Indonesian citizens enter 16-digit NIK. Foreign nationals enter active passport number.",
          "example": "3201234567890001 (Citizen) / A12345678 (Foreigner)",
          "common_mistakes": "Typo in digits or entering an expired identification document.",
          "foreign_note": "Ensure your passport is valid for at least 6 months."
        },
        "zh": {
          "label": "身份证号 / 护照号",
          "meaning": "申请人的官方有效身份证件号码。",
          "how_to_fill": "印尼公民填写16位NIK。外籍人士填写在有效期内的护照号码及国家代码。",
          "example": "3201234567890001 (印尼公民) / G12345678 (外籍)",
          "common_mistakes": "数字输入错误或使用了已过期的证件号码。",
          "foreign_note": "外籍人员请确保护照有效期在6个月以上。"
        },
        "ja": {
          "label": "住民登録番号 (NIK) / パスポート番号",
          "meaning": "申請者の公的身分証明書番号です。",
          "how_to_fill": "インドネシア国民は16桁のNIKを入力。外国人は有効なパスポート番号を入力してください。",
          "example": "3201234567890001 (国民) / TK1234567 (外国人)",
          "common_mistakes": "番号の誤入力、または有効期限切れの身分証番号を入力すること。",
          "foreign_note": "パスポートの残存有効期間が6ヶ月以上あることを確認してください。"
        },
        "ko": {
          "label": "주민등록번호(NIK) / 여권번호",
          "meaning": "신청인의 공식 신분증 번호입니다.",
          "how_to_fill": "인도네시아 국민은 16자리 NIK를 입력하고, 외국인은 유효한 여권 번호를 입력하세요.",
          "example": "3201234567890001 (내국인) / M12345678 (외국인)",
          "common_mistakes": "자릿수 오입력 또는 만료된 신분증 번호 기재.",
          "foreign_note": "외국인의 경우 여권 유효기간이 최소 6개월 이상 남아있어야 합니다."
        }
      }
    },
    {
      "id": "nama_lengkap",
      "patterns": ["nama lengkap", "nama pemohon", "full name", "applicant name"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Nama Lengkap Pemohon",
          "meaning": "Nama orang yang mengajukan permohonan sertifikat apostille.",
          "how_to_fill": "Ketik nama lengkap sesuai e-KTP / Paspor tanpa gelar akademik atau keagamaan (kecuali diminta khusus).",
          "example": "JOHN MICHAEL DOE",
          "common_mistakes": "Menyingkat nama tengah atau urutan nama tertukar.",
          "foreign_note": "Huruf kapital disarankan, tulis persis sesuai passport machine-readable zone."
        },
        "en": {
          "label": "Full Applicant Name",
          "meaning": "The full legal name of the person submitting the application.",
          "how_to_fill": "Type exactly as printed on your national ID or Passport, without titles.",
          "example": "JOHN MICHAEL DOE",
          "common_mistakes": "Abbreviating middle names or swapping first and last names.",
          "foreign_note": "Capital letters recommended, match exact passport spelling."
        },
        "zh": {
          "label": "申请人全名",
          "meaning": "提交海牙认证申请人的法定姓名。",
          "how_to_fill": "请按照身份证或护照上的拼写完整填写，不含头衔或荣誉称号。",
          "example": "ZHANG WEI / JOHN MICHAEL DOE",
          "common_mistakes": "缩写中间名或姓氏名字顺序颠倒。",
          "foreign_note": "外籍人士建议全部大写，与护照页面完全保持一致。"
        },
        "ja": {
          "label": "申請者氏名 (フルネーム)",
          "meaning": "アポスティーユ証明書を申請する本人の氏名です。",
          "how_to_fill": "身分証明書またはパスポートの記載通りに正確に入力してください（敬称・肩書は除く）。",
          "example": "YAMADA TARO / JOHN MICHAEL DOE",
          "common_mistakes": "ミドルネームの省略や、姓名の順序の入れ替わり。",
          "foreign_note": "ローマ字は大文字で、パスポートの記載と完全に一致させてください。"
        },
        "ko": {
          "label": "신청인 성명 (풀네임)",
          "meaning": "아포스티유 인증을 신청하는 본인의 법적 성명입니다.",
          "how_to_fill": "신분증 또는 여권에 표시된 그대로 정확하게 입력하세요 (직함 제외).",
          "example": "KIM MIN SOO / JOHN MICHAEL DOE",
          "common_mistakes": "중간 이름 축약 또는 성과 이름 순서 뒤바뀜.",
          "foreign_note": "여권 영문 표기와 철자가 정확히 일치해야 합니다."
        }
      }
    },
    {
      "id": "email",
      "patterns": ["email", "surel", "alamat email", "e-mail"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "Alamat Email Aktif",
          "meaning": "Email resmi untuk menerima bukti tanda terima dan e-billing PNBP.",
          "how_to_fill": "Gunakan email pribadi yang aktif dan dapat diakses setiap saat.",
          "example": "pemohon.dokumen@example.com",
          "common_mistakes": "Typo domain email (misal: @gmai.com) sehingga kode billing tidak masuk.",
          "foreign_note": "Pastikan filter spam email Anda tidak memblokir domain @ahu.go.id."
        },
        "en": {
          "label": "Active Email Address",
          "meaning": "Contact email to receive application vouchers and payment billing code.",
          "how_to_fill": "Enter a valid personal email address that you check regularly.",
          "example": "applicant.legal@example.com",
          "common_mistakes": "Typing errors in domain name leading to missed billing notifications.",
          "foreign_note": "Check spam folder if you do not receive ahu.go.id verification emails."
        },
        "zh": {
          "label": "常用电子邮箱",
          "meaning": "用于接收申请确认单和非税收入缴费账单的代码。",
          "how_to_fill": "请提供随时可以查收的有效个人邮箱。",
          "example": "applicant@example.com",
          "common_mistakes": "邮箱后缀拼写错误，导致无法收到缴费单。",
          "foreign_note": "请确保邮件不过滤来自 @ahu.go.id 的系统通知。"
        },
        "ja": {
          "label": "メールアドレス",
          "meaning": "申請受領書や決済コード（PNBP）を受け取るための連絡先です。",
          "how_to_fill": "日常的に受信確認ができる個人の有効なアドレスを入力してください。",
          "example": "user@example.com",
          "common_mistakes": "ドメイン名のスペルミス（例: @gmai.com）による案内不達。",
          "foreign_note": "@ahu.go.id からのメールが迷惑フォルダに入らないようご注意ください。"
        },
        "ko": {
          "label": "이메일 주소",
          "meaning": "신청 접수증 및 국가 세입 납부 청구서(e-Billing)를 수신할 주소입니다.",
          "how_to_fill": "자주 확인하는 본인의 유효한 이메일을 기재하세요.",
          "example": "applicant@example.com",
          "common_mistakes": "도메인 오탈자로 인해 납부 코드 수신 실패.",
          "foreign_note": "@ahu.go.id 도메인이 스팸 분류되지 않도록 확인 바랍니다."
        }
      }
    },
    {
      "id": "telepon",
      "patterns": ["nomor telepon", "no hp", "no telp", "phone", "mobile", "whatsapp"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Nomor Telepon / WhatsApp",
          "meaning": "Nomor kontak untuk konfirmasi dan notifikasi status permohonan.",
          "how_to_fill": "Gunakan format internasional diawali kode negara (+62 untuk Indonesia).",
          "example": "+6281234567890",
          "common_mistakes": "Nomor tidak aktif di WhatsApp atau format nomor terputus.",
          "foreign_note": "Gunakan nomor aktif yang bisa menerima panggilan/pesan konfirmasi."
        },
        "en": {
          "label": "Phone / WhatsApp Number",
          "meaning": "Contact phone for verification and status updates.",
          "how_to_fill": "Use international format starting with country code (+62 for Indonesia).",
          "example": "+6281234567890",
          "common_mistakes": "Inactive WhatsApp account or missing country code.",
          "foreign_note": "Foreign applicants may use overseas roaming numbers with valid country prefixes."
        },
        "zh": {
          "label": "联系电话 / WhatsApp",
          "meaning": "用于接收审核进度通知及紧急核验的联系号码。",
          "how_to_fill": "请使用含国家代码的国际标准格式（印尼为+62，中国为+86）。",
          "example": "+6281234567890 或 +8613800000000",
          "common_mistakes": "缺少国家区号导致系统无法发送通知短信。",
          "foreign_note": "确保该手机号支持接收国际短信或已开通WhatsApp。"
        },
        "ja": {
          "label": "電話番号 / WhatsApp",
          "meaning": "申請状況の通知や緊急確認用の連絡先番号です。",
          "how_to_fill": "国番号を含む国際電話形式（日本は+81、インドネシアは+62）で入力してください。",
          "example": "+819012345678",
          "common_mistakes": "国番号の脱落や、非稼働番号の入力。",
          "foreign_note": "SMSまたはWhatsAppで連絡可能な番号を指定してください。"
        },
        "ko": {
          "label": "연락처 / WhatsApp",
          "meaning": "심사 진행 상황 알림 및 비상 연락용 전화번호입니다.",
          "how_to_fill": "국가번호가 포함된 국제 규격 형식으로 입력하세요 (한국 +82, 인니 +62).",
          "example": "+821012345678",
          "common_mistakes": "국가번호 누락 또는 수신 불가 번호 기재.",
          "foreign_note": "SMS 또는 WhatsApp 확인이 가능한 번호여야 합니다."
        }
      }
    },
    {
      "id": "alamat",
      "patterns": ["alamat", "alamat domisili", "address", "domicile"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "Alamat Tempat Tinggal / Domisili",
          "meaning": "Alamat tempat tinggal resmi pemohon saat ini.",
          "how_to_fill": "Tuliskan nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota/kabupaten, dan kode pos.",
          "example": "Jl. Rasuna Said Kav. 4, Kuningan, Setiabudi, Jakarta Selatan 12920",
          "common_mistakes": "Alamat terlalu singkat tanpa mencantumkan kota atau kode pos.",
          "foreign_note": "Untuk WNA, bisa mencantumkan alamat tempat tinggal di Indonesia (KITAS/hotel/apartemen)."
        },
        "en": {
          "label": "Residential / Domicile Address",
          "meaning": "Current registered legal address of the applicant.",
          "how_to_fill": "Include street name, building number, district, city/regency, and postal code.",
          "example": "Jl. Rasuna Said Kav. 4, Setiabudi, South Jakarta 12920",
          "common_mistakes": "Overly brief address missing city name or postal zip code.",
          "foreign_note": "Foreigners residing in Indonesia can use temporary apartment/residence address."
        },
        "zh": {
          "label": "居住地址",
          "meaning": "申请人目前的正式合法居住地址。",
          "how_to_fill": "填写详细街道、门牌号、区域、城市及邮政编码。",
          "example": "Jl. Rasuna Said Kav. 4, South Jakarta 12920",
          "common_mistakes": "地址过于简略缺少所属行政区或邮编。",
          "foreign_note": "外籍人员可填写印尼境内的合法住所或公寓地址。"
        },
        "ja": {
          "label": "住所・居住地",
          "meaning": "申請者の現住所または居住地情報です。",
          "how_to_fill": "番地、建物名、地区名、都市名、郵便番号まで詳細に記載してください。",
          "example": "Jl. Rasuna Said Kav. 4, Setiabudi, South Jakarta 12920",
          "common_mistakes": "都市名や郵便番号が抜けた不完全な住所入力。",
          "foreign_note": "インドネシア滞在中の外国人は現地の滞在先住所を記入できます。"
        },
        "ko": {
          "label": "거주지 주소",
          "meaning": "신청인의 현재 공식 등록 주소지입니다.",
          "how_to_fill": "상세 도로명, 건물 번호, 구/군, 도시 및 우편번호를 포함하여 입력하세요.",
          "example": "Jl. Rasuna Said Kav. 4, Setiabudi, South Jakarta 12920",
          "common_mistakes": "시/군 명칭 또는 우편번호가 생략된 불완전한 기재.",
          "foreign_note": "인도네시아 체류 외국인은 현지 거주지(아파트/호텔 등) 주소를 기재합니다."
        }
      }
    },
    {
      "id": "penerima_kuasa_nama",
      "patterns": ["penerima kuasa", "nama kuasa", "proxy", "attorney", "authorized person"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Nama Penerima Kuasa (Bila Dikuasakan)",
          "meaning": "Nama orang yang diberi kuasa resmi untuk mengurus permohonan ini.",
          "how_to_fill": "Kosongkan jika diurus sendiri. Jika diwakilkan biro jasa/keluarga, tulis nama lengkap penerima kuasa sesuai KTP-nya.",
          "example": "BUDI SANTOSO, S.H. (Kosongkan bila mandiri)",
          "common_mistakes": "Mengisi nama penerima kuasa tetapi tidak melampirkan surat kuasa sah.",
          "foreign_note": "Sangat dianjurkan menggunakan surat kuasa bermeterai Rp 10.000 jika diwakilkan."
        },
        "en": {
          "label": "Authorized Representative Name (Proxy)",
          "meaning": "Name of the person legally authorized to submit on your behalf.",
          "how_to_fill": "Leave blank if applying yourself. If represented by an agent or relative, write their legal name.",
          "example": "BUDI SANTOSO (Leave empty if self-applicant)",
          "common_mistakes": "Filling this field without attaching a valid stamped Power of Attorney.",
          "foreign_note": "Must be backed with a signed Power of Attorney with Rp 10,000 duty stamp."
        },
        "zh": {
          "label": "受托代理人姓名 (如有代办)",
          "meaning": "代表您办理此项申请的合法委托人全名。",
          "how_to_fill": "若本人亲自办理请留空。若由中介或亲友代办，请填写代办人有效证件全名。",
          "example": "BUDI SANTOSO (本人申请请留空)",
          "common_mistakes": "填写时代办人未附带印花税授权委托书。",
          "foreign_note": "代办必须同时上传贴有10,000印尼盾印花税票的正式授权书。"
        },
        "ja": {
          "label": "代理人氏名 (委任する場合)",
          "meaning": "本人に代わって申請手続きを行う正式な委任代理人の氏名です。",
          "how_to_fill": "本人が直接申請する場合は空欄。代理店や代理人が申請する場合は代理人の身分証氏名を入力。",
          "example": "BUDI SANTOSO (自己申請時は空欄)",
          "common_mistakes": "代理人を記載しているにもかかわらず有効な委任状を添付していないこと。",
          "foreign_note": "代理人申請には10,000ルピア印紙付きの委任状添付が必須です。"
        },
        "ko": {
          "label": "위임 대리인 성명 (대리 신청 시)",
          "meaning": "본인을 대신하여 신청을 대행하는 수임인의 법적 성명입니다.",
          "how_to_fill": "직접 신청하는 경우 공란으로 둡니다. 대행사 또는 가족 대리 신청 시 대리인 신분증 성명을 기재합니다.",
          "example": "BUDI SANTOSO (본인 직접 신청 시 공란)",
          "common_mistakes": "대리인 명의를 기재하고 공인된 위임장을 첨부하지 않는 경우.",
          "foreign_note": "대리 신청 시 10,000 루피아 인지가 부착된 위임장이 필요합니다."
        }
      }
    },
    {
      "id": "penerima_kuasa_id",
      "patterns": ["ktp kuasa", "nik penerima kuasa", "proxy id", "id kuasa"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "NIK / Nomor Identitas Penerima Kuasa",
          "meaning": "Nomor KTP atau paspor orang yang ditunjuk sebagai kuasa.",
          "how_to_fill": "Masukkan 16 digit NIK penerima kuasa. Kosongkan jika mengurus sendiri.",
          "example": "3171012345670002",
          "common_mistakes": "NIK kuasa tidak cocok dengan KTP yang diunggah.",
          "foreign_note": "Pastikan data identitas kuasa valid dan aktif di Dukcapil."
        },
        "en": {
          "label": "Representative ID / NIK Number",
          "meaning": "National ID number of the proxy or attorney-in-fact.",
          "how_to_fill": "Enter 16-digit NIK of proxy. Leave empty if applying in person.",
          "example": "3171012345670002",
          "common_mistakes": "Mismatch between typed ID and the attached ID card copy.",
          "foreign_note": "Proxy must hold a legally recognized Indonesian ID or valid residency permit."
        },
        "zh": {
          "label": "代理人身份证件号",
          "meaning": "被授权受托人的印尼身份证(NIK)或护照号码。",
          "how_to_fill": "输入受托人16位NIK。本人办理请留空。",
          "example": "3171012345670002",
          "common_mistakes": "填写的号码与上传的代理人身份证扫描件不一致。",
          "foreign_note": "代理人必须持有合法有效的印尼身份证件。"
        },
        "ja": {
          "label": "代理人身分証明番号",
          "meaning": "代理人に指名された方のNIK（またはパスポート番号）です。",
          "how_to_fill": "代理人の16桁のNIKを入力。自己申請時は空欄。",
          "example": "3171012345670002",
          "common_mistakes": "アップロードされた身分証コピーと入力番号の不一致。",
          "foreign_note": "代理人はインドネシア国内で有効な身分証明書を所持している必要があります。"
        },
        "ko": {
          "label": "대리인 신분증 번호",
          "meaning": "수임 대리인의 NIK(또는 여권번호)입니다.",
          "how_to_fill": "대리인의 16자리 NIK를 기재하세요. 본인 직접 신청 시 공란.",
          "example": "3171012345670002",
          "common_mistakes": "첨부된 대리인 신분증 사본과 입력 번호 불일치.",
          "foreign_note": "대리인은 인도네시아에서 유효한 법적 신분증을 소지해야 합니다."
        }
      }
    },
    {
      "id": "surat_kuasa",
      "patterns": ["surat kuasa", "upload kuasa", "file kuasa", "power of attorney"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Unggah Surat Kuasa",
          "meaning": "Dokumen bukti pelimpahan wewenang dari pemohon kepada perwakilan.",
          "how_to_fill": "Format file PDF / JPG / PNG (maksimal 2MB), wajib bermeterai Rp 10.000 dan bertandatangan kedua pihak.",
          "example": "surat_kuasa_apostille.pdf",
          "common_mistakes": "Surat kuasa tidak memakai meterai atau tanda tangan tidak basah/digital tersertifikasi.",
          "foreign_note": "Bila dibuat di luar negeri, surat kuasa harus sudah dilegalisasi perwakilan RI setempat."
        },
        "en": {
          "label": "Upload Power of Attorney",
          "meaning": "Legal document delegating authority from applicant to representative.",
          "how_to_fill": "Upload in PDF/JPG format (max 2MB), must bear Rp 10,000 tax stamp and signatures.",
          "example": "power_of_attorney_stamped.pdf",
          "common_mistakes": "Missing duty stamp (meterai) or missing signatures from both parties.",
          "foreign_note": "If issued abroad, the proxy letter must be attested by the Indonesian Embassy/Consulate."
        },
        "zh": {
          "label": "上传授权委托书",
          "meaning": "申请人授予代理人办理权限的正式法律文书。",
          "how_to_fill": "PDF/JPG格式（文件上限2MB），必须贴附10,000印尼盾印花税并由双方签字。",
          "example": "power_of_attorney.pdf",
          "common_mistakes": "未贴印花税票或缺少委托人/受托人亲笔签名。",
          "foreign_note": "若委托书在印尼境外签署，须经当地印尼使领馆领事认证。"
        },
        "ja": {
          "label": "委任状ファイルのアップロード",
          "meaning": "申請権限を代理人に委譲することを証明する法的文書です。",
          "how_to_fill": "PDF/JPG形式（最大2MB）、10,000ルピアの印紙貼付および双方の署名が必須です。",
          "example": "surat_kuasa.pdf",
          "common_mistakes": "印紙の貼り忘れ、または双方の署名漏れ。",
          "foreign_note": "海外で作成された委任状は、現地のインドネシア在外公館による認証が必要です。"
        },
        "ko": {
          "label": "위임장 파일 업로드",
          "meaning": "신청인이 대리인에게 권한을 위임했음을 증명하는 서류입니다.",
          "how_to_fill": "PDF 또는 JPG 형식(최대 2MB), 10,000루피아 인지세 부착 및 쌍방 서명 필수.",
          "example": "power_of_attorney.pdf",
          "common_mistakes": "수입인지 미부착 또는 위임인/수임인 서명 누락.",
          "foreign_note": "해외에서 작성된 위임장은 현지 인도네시아 대사관/영사관의 확인을 받아야 합니다."
        }
      }
    },
    {
      "id": "negara_tujuan",
      "patterns": ["negara tujuan", "destination country", "country of destination", "negara pengaju"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Negara Tujuan Dokumen",
          "meaning": "Negara tempat sertifikat apostille dokumen ini akan digunakan.",
          "how_to_fill": "Pilih salah satu negara dari daftar dropdown. Negara tersebut WAJIB merupakan peserta Konvensi Apostille Den Haag 1961.",
          "example": "Jepang / Korea Selatan / Jerman / Amerika Serikat",
          "common_mistakes": "Memilih negara yang belum meratifikasi Konvensi Apostille (misal: Kanada atau UAE memerlukan legalisasi diplomatik biasa, bukan apostille).",
          "foreign_note": "Cek status negara Anda pada tabel konvensi HCCH Apostille Convention."
        },
        "en": {
          "label": "Country of Destination",
          "meaning": "The country where the apostilled document will be presented and recognized.",
          "how_to_fill": "Select from dropdown. The destination country MUST be a member party of the Hague Apostille Convention 1961.",
          "example": "Japan / South Korea / Germany / United States",
          "common_mistakes": "Selecting a non-member country (e.g. non-members require standard embassy legalization).",
          "foreign_note": "Verify that your destination state has acceded to the 1961 Apostille Convention."
        },
        "zh": {
          "label": "文书使用目的国",
          "meaning": "公证书及海牙认证证书将要提交使用的目标国家。",
          "how_to_fill": "从下拉列表中选择。该国必须是1961年《海牙取消外国公文书认证公约》缔约成员国。",
          "example": "中国 / 日本 / 韩国 / 德国 / 美国",
          "common_mistakes": "选择了非海牙成员国（非海牙国需要走传统使领馆领事双认证程序）。",
          "foreign_note": "请提前确认目标国已承认印尼出具的海牙认证附签。"
        },
        "ja": {
          "label": "提出先国（目的国）",
          "meaning": "アポスティーユ認証済みの文書を提出・使用する相手国です。",
          "how_to_fill": "ドロップダウンから選択。提出先国は1961年ハーグ条約加盟国である必要があります。",
          "example": "日本 / 韓国 / ドイツ / 米国",
          "common_mistakes": "ハーグ条約非加盟国を選択すること（非加盟国の場合は領事認証が必要です）。",
          "foreign_note": "提出先の官庁がアポスティーユ証明を受け入れる加盟国か事前にご確認ください。"
        },
        "ko": {
          "label": "문서 제출 대상국 (목적국)",
          "meaning": "아포스티유 인증 문서를 제출하여 효력을 인정받을 목적지 국가입니다.",
          "how_to_fill": "드롭다운에서 선택. 해당 국가는 반드시 1961년 헤이그 아포스티유 협약 가입국이어야 합니다.",
          "example": "대한민국 / 일본 / 독일 / 미국",
          "common_mistakes": "협약 미가입국 선택 (미가입국의 경우 영사확인 절차 진행 필요).",
          "foreign_note": "목적국이 헤이그 협약 체약국인지 사전 확인이 필요합니다."
        }
      }
    },
    {
      "id": "jenis_dokumen",
      "patterns": ["jenis dokumen", "document type", "kategori dokumen", "tipe dokumen"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Jenis / Kategori Dokumen",
          "meaning": "Klasifikasi resmi dari berkas dokumen yang diajukan.",
          "how_to_fill": "Pilih kelompok dokumen yang sesuai (misal: Dokumen Kependudukan, Pendidikan, Putusan Pengadilan, Dokumen Notaris, Kepolisian/SKCK).",
          "example": "Pendidikan (Ijazah/Transkrip) atau Kependudukan (Akta Lahir)",
          "common_mistakes": "Salah memilih kategori (misal: Ijazah dipilih kategori Notaris) yang menyebabkan verifikasi ditolak.",
          "foreign_note": "Kategori menentukan kementerian/lembaga yang menjadi rujukan legalisasi dasar."
        },
        "en": {
          "label": "Document Classification / Type",
          "meaning": "The official category of the public document being legalized.",
          "how_to_fill": "Select appropriate category (e.g. Civil Registry, Education, Notarial Acts, Police Records/SKCK).",
          "example": "Education (Diploma/Transcript) or Civil Registry (Birth Certificate)",
          "common_mistakes": "Selecting wrong category leads to mismatch with official specimen signatures.",
          "foreign_note": "Classification links to the primary government authority issuing specimen stamps."
        },
        "zh": {
          "label": "公文书种类 / 类别",
          "meaning": "申请办理海牙认证的公文书性质分类。",
          "how_to_fill": "从分类中选择（如：民政户籍证明、学历学位证、公证书、无犯罪记录SKCK等）。",
          "example": "教育类 (学位证书) 或 民政类 (出生证明)",
          "common_mistakes": "选错文书类别导致审核官员调取错误的印鉴样本而驳回申请。",
          "foreign_note": "类别决定了签发机关印章样本的比对机构。"
        },
        "ja": {
          "label": "文書種別（カテゴリー）",
          "meaning": "認証を受ける公的文書の公式な分類区分です。",
          "how_to_fill": "該当する分類を選択（例：住民登録書類、卒業証明・成績証明、公証人認証書、無犯罪証明書SKCKなど）。",
          "example": "学歴書類（卒業証書）または 身分登録（出生証明書）",
          "common_mistakes": "カテゴリーの誤選択により、公印照合ができず却下されること。",
          "foreign_note": "種別選択によって照合対象となる発行機関の登録印鑑が異なります。"
        },
        "ko": {
          "label": "문서 유형 / 분류",
          "meaning": "아포스티유 인증을 신청하는 공문서의 공식 구분입니다.",
          "how_to_fill": "올바른 분류 선택 (예: 가족관계/호적서류, 학력증명, 공증문서, 범죄경력증명SKCK 등).",
          "example": "교육서류(학위증명) 또는 등록서류(출생증명서)",
          "common_mistakes": "카테고리 오선택으로 관인 서명 견본 대조 실패 및 반려.",
          "foreign_note": "분류에 따라 대조할 발행기관 서명 견본 데이터베이스가 결정됩니다."
        }
      }
    },
    {
      "id": "nama_dokumen",
      "patterns": ["nama dokumen", "document name", "judul dokumen", "title of document"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "Nama Lengkap Dokumen",
          "meaning": "Judul resmi yang tertera di bagian kepala dokumen fisik Anda.",
          "how_to_fill": "Tuliskan nama dokumen sesuai teks asli pada surat/akta.",
          "example": "Ijazah Sarjana Teknik / Kutipan Akta Kelahiran",
          "common_mistakes": "Menulis singkatan atau deskripsi umum yang tidak sesuai kop dokumen.",
          "foreign_note": "Gunakan bahasa Indonesia sesuai judul asli yang tercetak di dokumen."
        },
        "en": {
          "label": "Official Document Title",
          "meaning": "The exact title printed at the top of your physical document.",
          "how_to_fill": "Enter exact title as printed on the original certificate/act.",
          "example": "Bachelor Degree Diploma / Birth Certificate Extract",
          "common_mistakes": "Writing informal nicknames or missing official prefixes.",
          "foreign_note": "Keep Indonesian title wording if that is what appears on the document header."
        },
        "zh": {
          "label": "文书正式名称",
          "meaning": "您所持纸质文件顶端印刷的完整公文标题。",
          "how_to_fill": "按照文件原件文字一字不差地输入。",
          "example": "Ijazah Sarjana (学士学位证书) / Kutipan Akta Kelahiran (出生证明)",
          "common_mistakes": "使用通俗简称而非正式公文标题。",
          "foreign_note": "必须与原始印尼文件标题文字保持一致。"
        },
        "ja": {
          "label": "文書の正式名称（タイトル）",
          "meaning": "原本のヘッダー部分に記載されている公的文書の表題です。",
          "how_to_fill": "原本に印刷されている通りに入力してください。",
          "example": "Ijazah Sarjana（学士号証書）/ Kutipan Akta Kelahiran（出生証明書抄本）",
          "common_mistakes": "略称や一般的な俗称での入力。",
          "foreign_note": "文書原本に記載されたインドネシア語の表記通りに入力してください。"
        },
        "ko": {
          "label": "문서 공식 명칭 (제목)",
          "meaning": "실물 서류 상단에 인쇄된 공식 서류 표제입니다.",
          "how_to_fill": "서류 원본에 기재된 명칭 그대로 입력하세요.",
          "example": "Ijazah Sarjana (학사 학위증명서) / Kutipan Akta Kelahiran (출생증명서)",
          "common_mistakes": "임의의 약칭 또는 불일치하는 일반 명칭 기재.",
          "foreign_note": "문서 원본에 표기된 인도네시아어 명칭을 기준으로 기재해야 합니다."
        }
      }
    },
    {
      "id": "nomor_dokumen",
      "patterns": ["nomor seri", "registrasi dokumen", "nomor dokumen", "no dokumen", "document number", "certificate number", "no seri"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Nomor Registrasi / Seri Dokumen",
          "meaning": "Nomor unik resmi yang tercetak di dokumen fisik Anda. Letaknya biasanya di sudut kanan atas, tepat di bawah judul/kop surat (misal: 'Nomor: ...'), atau di dekat cap instansi penerbit.",
          "how_to_fill": "Ketik nomor lengkap persis seperti tertulis di dokumen fisik. Jangan hilangkan tanda baca seperti garis miring (/), tanda hubung (-), atau titik.",
          "example": "Ijazah: 1234/UN1/FT/2024 | Akta Lahir: 3171-LT-01012023-0001 | SKCK: SKCK/YANMAS/8821/VII/2024",
          "common_mistakes": "Hanya mengetik angka saja tanpa kode huruf/garis miring, atau tertukar antara angka nol (0) dan huruf O.",
          "foreign_note": "Bagi dokumen luar negeri yang diterjemahkan, gunakan nomor seri dokumen asli yang disahkan."
        },
        "en": {
          "label": "Document Registration / Serial Number",
          "meaning": "Official unique serial number printed on your physical certificate. It is typically found at the top-right corner, directly below the document header/title ('No: ...'), or near the official rubber stamp.",
          "how_to_fill": "Type the exact serial string as printed on the physical document. Keep all slashes (/), hyphens (-), and punctuation intact.",
          "example": "Diploma: 1234/UN1/FT/2024 | Birth Certificate: 3171-LT-01012023-0001 | Police Clearance: SKCK/8821/2024",
          "common_mistakes": "Omitting letter prefixes or slashes, or confusing number 0 with letter O.",
          "foreign_note": "For certified translations, refer to the original physical registration number."
        },
        "zh": {
          "label": "文书编号 / 登记序列号",
          "meaning": "印刷在您纸质公证书上的官方唯一文号。通常位于文件右上角、文件标题正下方（如“No: ...”）或发证机关印章附近。",
          "how_to_fill": "请完整输入文书上记载的全部字符，包括所有斜杠(/)、短横线(-)及字母前缀。",
          "example": "学位证: 1234/UN1/FT/2024 | 出生证明: 3171-LT-01012023-0001 | 无犯罪记录: SKCK/8821/2024",
          "common_mistakes": "仅填写数字而遗漏字母代码或斜杠符号，或者将数字0与字母O混淆。",
          "foreign_note": "如使用翻译公证件，请核对原始官方文件的正规流水文号。"
        },
        "ja": {
          "label": "文書番号（登録・通し番号）",
          "meaning": "原本の文書に記載されている固有の公的登録番号です。通常は右上の隅、表題の直下（「No:...」表記）、または発行印の付近に記載されています。",
          "how_to_fill": "原本に印刷されている通り、アルファベット、スラッシュ(/)、ハイフン(-)を含めて省略せず入力してください。",
          "example": "卒業証明書: 1234/UN1/FT/2024 | 出生証明書: 3171-LT-01012023-0001",
          "common_mistakes": "記号やアルファベットの省略、数字の「0」とアルファベット「O」の誤認。",
          "foreign_note": "翻訳証明書の場合でも、原本の登録番号を確認して入力してください。"
        },
        "ko": {
          "label": "문서 등록 / 일련 번호",
          "meaning": "실물 서류에 인쇄된 공식 고유 등록 번호입니다. 일반적으로 우측 상단, 문서 제목 바로 아래('No: ...'), 또는 발행 직인 근처에 위치합니다.",
          "how_to_fill": "슬래시(/), 하이픈(-), 영문 기호를 포함하여 서류에 인쇄된 그대로 정확하게 입력하세요.",
          "example": "학위증: 1234/UN1/FT/2024 | 출생증명: 3171-LT-01012023-0001 | 범죄경력: SKCK/8821/2024",
          "common_mistakes": "문자 기호나 슬래시를 누락하고 숫자만 입력하는 오류.",
          "foreign_note": "번역 공증본의 경우 원본 공문서의 등록 번호를 기준으로 확인하세요."
        }
      }
    },
    {
      "id": "pemilik_dokumen",
      "patterns": ["nama pemilik", "pemilik dokumen", "owner", "holder", "nama subjek"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "Nama Pemilik Dokumen",
          "meaning": "Nama orang atau badan yang menjadi subjek pemilik berkas.",
          "how_to_fill": "Tuliskan nama pemilik yang tertera di dalam isi dokumen (bisa sama dengan pemohon, atau orang lain jika diajukan orang tua/wali).",
          "example": "JANE EMILY DOE",
          "common_mistakes": "Menulis nama pemohon padahal dokumen adalah milik anak atau klien.",
          "foreign_note": "Pastikan ejaan sama dengan nama yang tertera di badan akta."
        },
        "en": {
          "label": "Name of Document Holder / Owner",
          "meaning": "The person or entity named as the subject of the document.",
          "how_to_fill": "Enter the name printed inside the document (may differ from applicant if applying on behalf of a child/client).",
          "example": "JANE EMILY DOE",
          "common_mistakes": "Mistakenly writing the applicant's name when the document belongs to a relative.",
          "foreign_note": "Must precisely match the name printed on the certificate body."
        },
        "zh": {
          "label": "文书权利人 / 持有人姓名",
          "meaning": "该公文书所证明的主体人姓名。",
          "how_to_fill": "填写文件中记载的当事人姓名（若父母为子女办理，此处填子女姓名）。",
          "example": "JANE EMILY DOE",
          "common_mistakes": "将代办申请人姓名误填为文件持有人姓名。",
          "foreign_note": "必须与文件内页记载的姓名拼写完全一致。"
        },
        "ja": {
          "label": "文書名義人（保有者氏名）",
          "meaning": "文書に記載されている対象本人の氏名です。",
          "how_to_fill": "文書原本に記載された名義人の氏名を入力（保護者が子の書類を申請する場合は子の氏名）。",
          "example": "JANE EMILY DOE",
          "common_mistakes": "名義人と申請者（親や代理人）の取り違え。",
          "foreign_note": "文書の本文に記載された名前の綴りと一致させてください。"
        },
        "ko": {
          "label": "문서 명의인 (대상자 성명)",
          "meaning": "서류 내용에 명시된 당사자(소유자)의 성명입니다.",
          "how_to_fill": "서류에 적힌 명의인의 성명을 기재하세요 (대리 신청의 경우 본인 명의가 아닌 서류 대상자 성명).",
          "example": "JANE EMILY DOE",
          "common_mistakes": "서류 명의인과 대리 신청인 성명 혼동.",
          "foreign_note": "서류 본문에 명시된 성명 철자와 일치해야 합니다."
        }
      }
    },
    {
      "id": "pejabat_penandatangan",
      "patterns": ["nama pejabat", "penandatangan", "officer", "signed by", "nama penandatangan"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Nama Pejabat yang Menandatangani",
          "meaning": "Nama lengkap pejabat berwenang yang membubuhkan tanda tangan pada dokumen.",
          "how_to_fill": "Lihat bagian bawah dokumen/tanda tangan, ketik nama pejabat tanpa menyingkat (lengkap beserta gelar bila ada di spesimen).",
          "example": "Prof. Dr. Ir. BAMBANG SOEMARNO, M.Sc.",
          "common_mistakes": "Menulis nama staff pelaksana, bukan pejabat yang menandatangani atau melegalisasi.",
          "foreign_note": "Nama pejabat ini akan dicocokkan dengan spesimen tanda tangan di database AHU."
        },
        "en": {
          "label": "Name of Signatory Official",
          "meaning": "The official who signed or certified the document.",
          "how_to_fill": "Check the signature block at bottom; type the official's name including academic titles if printed.",
          "example": "Prof. Dr. Ir. BAMBANG SOEMARNO, M.Sc.",
          "common_mistakes": "Entering the clerk's name instead of the authorized signing official.",
          "foreign_note": "This name must match the signature specimen registered in the AHU database."
        },
        "zh": {
          "label": "签署官员姓名",
          "meaning": "在公文书上签署或者盖章的具有官方权限的主管官员全名。",
          "how_to_fill": "查看文件底部的签字栏，完整输入官员姓名（含印章上注明的学位头衔）。",
          "example": "Prof. Dr. Ir. BAMBANG SOEMARNO, M.Sc.",
          "common_mistakes": "误填了经办办事员姓名，而非最终签署授权长官姓名。",
          "foreign_note": "该姓名将与印尼司法部数据库内备案的官员签名印鉴进行系统核对。"
        },
        "ja": {
          "label": "署名官氏名（署名した公職者）",
          "meaning": "文書に最終署名または公印を押印した所轄官公庁の責任者氏名です。",
          "how_to_fill": "文書下部の署名欄を確認し、肩書や学位を含めて正確に入力してください。",
          "example": "Prof. Dr. Ir. BAMBANG SOEMARNO, M.Sc.",
          "common_mistakes": "窓口担当者の名前と、決裁署名官の名前の混同。",
          "foreign_note": "AHUに登録されている印鑑・署名サンプル（スペシメン）と照合されます。"
        },
        "ko": {
          "label": "서명 공직자 성명",
          "meaning": "공문서에 최종 서명 또는 날인한 권한 있는 공직자의 성명입니다.",
          "how_to_fill": "문서 하단 서명란을 확인하여 직함/학위를 포함한 공식 성명을 기재하세요.",
          "example": "Prof. Dr. Ir. BAMBANG SOEMARNO, M.Sc.",
          "common_mistakes": "접수 담당자 성명을 결재 서명권자 성명으로 오기재.",
          "foreign_note": "법무인권부(AHU) 데이터베이스의 등록 관인 서명 견본과 대조됩니다."
        }
      }
    },
    {
      "id": "jabatan_pejabat",
      "patterns": ["jabatan", "jabatan pejabat", "official position", "position", "title"],
      "source": "ai",
      "source_label": "AI Generated",
      "translations": {
        "id": {
          "label": "Jabatan Resmi Pejabat",
          "meaning": "Posisi struktural pejabat saat menandatangani dokumen.",
          "how_to_fill": "Tuliskan jabatan persis sesuai cap/teks di bawah nama tanda tangan (misal: Rektor, Kepala Dinas Dukcapil, Notaris di Jakarta Selatan).",
          "example": "Kepala Dinas Kependudukan dan Pencatatan Sipil Kota Bandung",
          "common_mistakes": "Menyingkat jabatan sehingga sistem tidak dapat memvalidasi wewenangnya.",
          "foreign_note": "Jika ditandatangani atas nama (a.n. / Plt), cantumkan keterangan pelaksana tugas tersebut."
        },
        "en": {
          "label": "Official Position / Title of Signatory",
          "meaning": "The official capacity or governmental title of the signer.",
          "how_to_fill": "Enter exact title printed under signature (e.g. Rector, Head of Civil Registry, Notary Public).",
          "example": "Head of Civil Registry Office of Bandung",
          "common_mistakes": "Abbreviating titles causing authority validation errors.",
          "foreign_note": "If signed as Acting/Interim (Plt/a.n.), mention the exact delegation capacity."
        },
        "zh": {
          "label": "官员官方职务",
          "meaning": "签署官员在签字时所担任的法定公职头衔。",
          "how_to_fill": "按照印章或文字记录填写（如：校长、民政局长、雅加达公证人等）。",
          "example": "Kepala Dinas Kependudukan dan Pencatatan Sipil",
          "common_mistakes": "过度缩写职务头衔导致核权未通过。",
          "foreign_note": "若为代理（Plt）或代签署（a.n.），需在职务中准确体现。"
        },
        "ja": {
          "label": "署名官の官職・役職名",
          "meaning": "文書に署名した際の公職上の役職名です。",
          "how_to_fill": "印章や署名欄に記載の通りに入力（例：学長、住民登録局長、公証人など）。",
          "example": "Kepala Dinas Kependudukan dan Pencatatan Sipil",
          "common_mistakes": "役職の過度な省略による権限確認エラー。",
          "foreign_note": "代行（a.n. / Plt）の場合もその表記を含めて記載してください。"
        },
        "ko": {
          "label": "서명 공직자 공식 직위",
          "meaning": "문서 서명 당시 해당 공직자의 법적 직함입니다.",
          "how_to_fill": "서명란 하단 직명 그대로 입력 (예: 총장, 주민등록국장, 공증인 등).",
          "example": "Kepala Dinas Kependudukan dan Pencatatan Sipil",
          "common_mistakes": "직위 약어로 기재하여 권한 확인 실패.",
          "foreign_note": "직무대리(Plt) 또는 대결(a.n.)인 경우 해당 표기를 포함하세요."
        }
      }
    },
    {
      "id": "instansi_penerbit",
      "patterns": ["instansi", "instansi penerbit", "issuing authority", "lembaga penerbit", "badan penerbit"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Instansi / Lembaga Penerbit Dokumen",
          "meaning": "Nama kementerian, lembaga, universitas, atau kantor dinas yang mengeluarkan dokumen.",
          "how_to_fill": "Tuliskan nama instansi lengkap tanpa disingkat.",
          "example": "Universitas Indonesia / Dinas Kependudukan dan Catatan Sipil Kota Surabaya",
          "common_mistakes": "Hanya menulis singkatan (misal: UI, Disdukcapil) yang tidak resmi di sistem.",
          "foreign_note": "Gunakan nama resmi instansi dalam bahasa Indonesia."
        },
        "en": {
          "label": "Issuing Authority / Institution",
          "meaning": "The governmental department, university, or court that produced the document.",
          "how_to_fill": "Type the full formal agency name without informal abbreviations.",
          "example": "Universitas Indonesia / Civil Registry Office of Surabaya",
          "common_mistakes": "Using informal acronyms that don't match the ministry directory.",
          "foreign_note": "Use the formal Indonesian agency name."
        },
        "zh": {
          "label": "公文书出具机关 / 机构",
          "meaning": "签发或认证该文件的部委、大学、法院或政府机关。",
          "how_to_fill": "完整填写机关正式法定全称，避免使用口头缩写。",
          "example": "Universitas Indonesia / Dinas Kependudukan dan Catatan Sipil",
          "common_mistakes": "使用缩写导致系统无法匹配到对应发证机关目录。",
          "foreign_note": "请使用印尼官方标准机构全称。"
        },
        "ja": {
          "label": "発行機関・所轄省庁",
          "meaning": "当該公的文書を発行・認証した官公庁、大学、裁判所などの名称です。",
          "how_to_fill": "非公式な略称を使わず、正式な機関名称を省略せず入力してください。",
          "example": "Universitas Indonesia / Dinas Kependudukan dan Catatan Sipil",
          "common_mistakes": "略語（UI、Disdukcapilなど）のみの入力による登録不一致。",
          "foreign_note": "インドネシア語の正式な機関名称を使用してください。"
        },
        "ko": {
          "label": "발행 기관 / 정부 기관",
          "meaning": "해당 문서를 발급 또는 인증한 정부 부처, 대학, 법원 등입니다.",
          "how_to_fill": "약어를 사용하지 않고 기관의 공식 명칭을 정확히 입력하세요.",
          "example": "Universitas Indonesia / Dinas Kependudukan dan Catatan Sipil",
          "common_mistakes": "약칭 단독 기재로 인한 기관 목록 매칭 오류.",
          "foreign_note": "인도네시아 공식 기관 명칭을 전체 기재해야 합니다."
        }
      }
    },
    {
      "id": "upload_dokumen",
      "patterns": ["upload dokumen", "unggah dokumen", "file dokumen", "attach document", "dokumen asli"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Unggah Berkas Dokumen Publik",
          "meaning": "File hasil pindai (scan) dokumen asli yang telah dilegalisasi oleh instansi berwenang.",
          "how_to_fill": "Unggah format PDF (maksimal 2MB per file), scan berwarna (bukan fotokopi hitam putih), seluruh tepi dokumen terlihat jelas.",
          "example": "scan_asli_ijazah_legalisir.pdf",
          "common_mistakes": "Mengunggah foto blur, terpotong, atau dokumen fotokopi tanpa stempel basah.",
          "foreign_note": "Pastikan cap stempel dan tanda tangan berwarna terlihat tajam."
        },
        "en": {
          "label": "Upload Public Document Scan",
          "meaning": "Color scanned PDF of the original certified public document.",
          "how_to_fill": "Upload in PDF format (max 2MB), full color scan (not grayscale/photocopy), all corners visible.",
          "example": "scan_original_degree_legalized.pdf",
          "common_mistakes": "Uploading blurry photo, cropped edges, or black-and-white photocopy without original stamp.",
          "foreign_note": "Ensure ink stamps and signatures are crisp and clearly legible."
        },
        "zh": {
          "label": "上传公文书扫描件",
          "meaning": "已由发证机关盖章认证的原始公文书清晰彩色扫描文件。",
          "how_to_fill": "上传PDF格式（单文件不超过2MB），必须为原件彩色扫描（非黑白复印件），四角完整无遮挡。",
          "example": "original_degree_scan.pdf",
          "common_mistakes": "上传照片模糊、反光、边角缺失或黑白复印件导致退件。",
          "foreign_note": "必须清晰辨识鲜章印泥与手写签字笔迹。"
        },
        "ja": {
          "label": "原本スキャンデータのアップロード",
          "meaning": "権限ある機関によって認証・発行された原本のカラーPDFスキャンです。",
          "how_to_fill": "PDF形式（最大2MB）、カラー原本スキャン（白黒コピー不可）、四隅が切れていないものを添付。",
          "example": "scan_original_document.pdf",
          "common_mistakes": "不鮮明な写真、端が欠けた画像、または原本印鑑のないコピーの添付。",
          "foreign_note": "公印の朱肉や自筆署名が鮮明に見える状態でアップロードしてください。"
        },
        "ko": {
          "label": "공문서 원본 스캔본 업로드",
          "meaning": "권한 있는 기관에서 발급 및 공증받은 원본의 고해상도 컬러 스캔본입니다.",
          "how_to_fill": "PDF 형식(최대 2MB), 컬러 스캔본(흑백 복사본 불가), 문서의 네 모서리가 모두 보이도록 업로드.",
          "example": "original_document_color_scan.pdf",
          "common_mistakes": "흔들리거나 잘린 이미지, 원본 날인이 없는 흑백 복사본 업로드.",
          "foreign_note": "직인 및 서명의 색상이 선명하게 확인되어야 심사가 통과됩니다."
        }
      }
    },
    {
      "id": "kanwil_pengambilan",
      "patterns": ["kanwil", "kantor wilayah", "lokasi cetak", "tempat pengambilan", "collection office", "lokasi stiker"],
      "source": "user",
      "source_label": "User Verified",
      "translations": {
        "id": {
          "label": "Lokasi Cetak Sertifikat / Stiker (Kanwil Kemenkumham)",
          "meaning": "Kantor Wilayah Kemenkumham tempat Anda akan mengambil sertifikat/stiker fisik Apostille.",
          "how_to_fill": "Pilih Kanwil terdekat dengan domisili Anda dari daftar dropdown provinsi.",
          "example": "Kanwil DKI Jakarta / Kanwil Jawa Barat / Kanwil Bali",
          "common_mistakes": "Salah memilih Kanwil luar pulau sehingga menyulitkan proses pencetakan fisik.",
          "foreign_note": "Sertifikat stiker harus dicetak dan ditempelkan fisik di Kanwil yang Anda pilih."
        },
        "en": {
          "label": "Certificate Print / Collection Office (Regional Office)",
          "meaning": "The Kemenkumham Regional Office (Kanwil) where physical Apostille sticker will be printed.",
          "how_to_fill": "Select the office closest to your current residence from the province dropdown.",
          "example": "Kanwil DKI Jakarta / Kanwil West Java / Kanwil Bali",
          "common_mistakes": "Selecting a distant province office making in-person collection burdensome.",
          "foreign_note": "Physical Apostille certificates/stickers must be collected in person or by authorized proxy."
        },
        "zh": {
          "label": "证书打印及领取地点 (司法部地区办事处)",
          "meaning": "您最终前往打印并领取海牙认证物理防伪防撕贴纸的Kemenkumham地方官署。",
          "how_to_fill": "从下拉省份列表中选择离您当前住址最近的Kanwil办事处。",
          "example": "Kanwil DKI Jakarta (雅加达) / Kanwil Bali (巴厘岛)",
          "common_mistakes": "选错了较远省份的Kanwil导致后续奔波甚至无法现场领取。",
          "foreign_note": "海牙认证贴纸必须本人或受托代理人携带原件前往现场打印加贴。"
        },
        "ja": {
          "label": "証明書受取・発行場所（法務人権省 地方事務所 Kanwil）",
          "meaning": "物理的なアポスティーユ証明ステッカーを印刷・受領する法務人権省地方事務所です。",
          "how_to_fill": "ドロップダウンリストから、現住所に一番近い州のKanwilを選択してください。",
          "example": "Kanwil DKI Jakarta（ジャカルタ）/ Kanwil Bali（バリ）",
          "common_mistakes": "遠方の地方事務所を選択してしまい、直接の受領が困難になること。",
          "foreign_note": "アポスティーユステッカーは指定したKanwil窓口で原本に貼付してもらう必要があります。"
        },
        "ko": {
          "label": "인증서 수령 / 발급 장소 (법무인권부 지역사무소 Kanwil)",
          "meaning": "실물 아포스티유 스티커를 인쇄 및 수령할 관할 지역 사무소(Kanwil)입니다.",
          "how_to_fill": "현재 체류지에서 가장 가까운 시/도 Kanwil을 드롭다운에서 선택하세요.",
          "example": "Kanwil DKI Jakarta (자카르타) / Kanwil Bali (발리)",
          "common_mistakes": "원거리 지역 사무소를 선택하여 실물 수령에 어려움을 겪는 경우.",
          "foreign_note": "아포스티유 실물 스티커는 선택한 Kanwil에 직접(또는 대리인) 방문하여 원본에 부착해야 합니다."
        }
      }
    }
  ]
}
;