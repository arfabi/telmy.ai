// Telmy.ai — Zero-Knowledge Client-Side Encryption (CSE) Vault Engine
// Powered by Web Crypto API (AES-GCM 256-bit + PBKDF2 with 100,000 iterations)
// Supports: Dual-Lock (Password 6-12 chars OR 12-Word Seed Phrase), Rate-Limiting, & Session Unlock
(function () {
  'use strict';

  // Curated 256 standard English words for 12-word cryptographic seed phrase generation
  const WORDLIST_256 = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
    'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
    'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
    'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
    'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
    'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
    'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
    'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
    'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
    'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain',
    'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'because', 'become',
    'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
    'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
    'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless',
    'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
    'boil', 'bomb', 'bone', 'bonus', 'book', 'boost', 'border', 'boring', 'borrow', 'boss',
    'bottom', 'bounce', 'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread',
    'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli', 'broken', 'bronze',
    'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy', 'budget', 'buffalo', 'build', 'bulb',
    'bulk', 'bullet', 'bundle', 'bunker', 'burden', 'burger', 'burst', 'bus', 'business', 'busy',
    'butter', 'buyer', 'buzz', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm'
  ];

  // Helper conversions between ArrayBuffer and Base64
  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Derive AES-GCM 256-bit key from secret (Password or Seed Phrase) and Salt using PBKDF2
  async function deriveKeyFromSecret(secret, saltBytes) {
    const enc = new TextEncoder();
    const cleanSecret = String(secret).trim();
    const secretBuffer = enc.encode(cleanSecret);

    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      secretBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 100000,
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate 12-Word Cryptographic Seed Phrase
   * @returns {string} 12 space-separated words
   */
  function generateSeedPhrase() {
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const words = [];
    for (let i = 0; i < 12; i++) {
      const idx = randomBytes[i] % WORDLIST_256.length;
      words.push(WORDLIST_256[idx]);
    }
    return words.join(' ');
  }

  /**
   * Calculate password strength indicator
   * @param {string} pwd
   * @returns {{ score: number, label: string, percent: number, color: string }}
   */
  function calculatePasswordStrength(pwd) {
    if (!pwd) return { score: 0, label: 'Empty', percent: 0, color: '#94a3b8' };
    const len = pwd.length;
    let score = 0;

    if (len >= 6) score++;
    if (len >= 9) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (len < 6) {
      return { score: 1, label: 'Too short (min 6)', percent: 20, color: '#ef4444' };
    }
    if (score <= 2) {
      return { score: 2, label: 'Fair', percent: 45, color: '#f59e0b' };
    }
    if (score === 3 || score === 4) {
      return { score: 3, label: 'Strong', percent: 75, color: '#0071e3' };
    }
    return { score: 4, label: 'Very Strong', percent: 100, color: '#34c759' };
  }

  // Rate Limiting (Max 3 failed attempts before lockout)
  const RATE_LIMIT_KEY = 'telmy_vault_attempts';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION_MS = 30000; // 30 seconds lockout

  function getAttemptStatus() {
    try {
      const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
      if (!raw) return { failedAttempts: 0, isLocked: false, remainingSeconds: 0 };
      const data = JSON.parse(raw);
      const now = Date.now();
      if (data.lockedUntil && data.lockedUntil > now) {
        const remaining = Math.ceil((data.lockedUntil - now) / 1000);
        return { failedAttempts: data.failedAttempts || MAX_ATTEMPTS, isLocked: true, remainingSeconds: remaining };
      }
      if (data.lockedUntil && data.lockedUntil <= now) {
        sessionStorage.removeItem(RATE_LIMIT_KEY);
        return { failedAttempts: 0, isLocked: false, remainingSeconds: 0 };
      }
      return { failedAttempts: data.failedAttempts || 0, isLocked: false, remainingSeconds: 0 };
    } catch (e) {
      return { failedAttempts: 0, isLocked: false, remainingSeconds: 0 };
    }
  }

  function recordFailedAttempt() {
    try {
      const current = getAttemptStatus();
      const newCount = (current.failedAttempts || 0) + 1;
      let lockedUntil = null;
      if (newCount >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      }
      sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({
        failedAttempts: newCount,
        lockedUntil: lockedUntil
      }));
      return getAttemptStatus();
    } catch (e) {
      return { failedAttempts: 1, isLocked: false, remainingSeconds: 0 };
    }
  }

  function resetFailedAttempts() {
    try {
      sessionStorage.removeItem(RATE_LIMIT_KEY);
    } catch (e) {}
  }

  // Session Unlock Storage (RAM-level session storage during browser session)
  const SESSION_VAULT_KEY = 'telmy_vault_unlocked_session_secret';

  function setSessionVaultSecret(secret) {
    try {
      sessionStorage.setItem(SESSION_VAULT_KEY, secret);
    } catch (e) {}
  }

  function getSessionVaultSecret() {
    try {
      return sessionStorage.getItem(SESSION_VAULT_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function clearSessionVaultSecret() {
    try {
      sessionStorage.removeItem(SESSION_VAULT_KEY);
    } catch (e) {}
  }

  /**
   * Encrypt plainObject using Secret (Password or Seed Phrase)
   * @param {Object} plainObject
   * @param {string} secret - Password or Seed Phrase
   * @param {string|null} existingSalt - optional existing salt Base64
   * @param {string} lockType - 'password' | 'seed_phrase'
   * @returns {Promise<{ ciphertext: string, iv: string, salt: string, lockType: string, updatedAt: string }>}
   */
  async function encryptVaultData(plainObject, secret, existingSalt = null, lockType = 'password') {
    const enc = new TextEncoder();
    const dataBuffer = enc.encode(JSON.stringify(plainObject));

    let saltBytes;
    if (existingSalt) {
      saltBytes = new Uint8Array(base64ToBuffer(existingSalt));
    } else {
      saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    }

    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKeyFromSecret(secret, saltBytes);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      dataBuffer
    );

    // Save to active session memory
    setSessionVaultSecret(secret);
    resetFailedAttempts();

    return {
      ciphertext: bufferToBase64(encryptedBuffer),
      iv: bufferToBase64(ivBytes),
      salt: bufferToBase64(saltBytes),
      lockType: lockType || 'password',
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Decrypt vault envelope using Secret (Password or Seed Phrase)
   * Enforces 3-attempt rate-limiting lockout
   * @param {{ ciphertext: string, iv: string, salt: string }} envelope
   * @param {string} secret
   * @returns {Promise<Object>} Decrypted plainObject
   * @throws Error if locked or secret incorrect
   */
  async function decryptVaultData(envelope, secret) {
    const attemptStatus = getAttemptStatus();
    if (attemptStatus.isLocked) {
      throw new Error(`VAULT_LOCKED:${attemptStatus.remainingSeconds}`);
    }

    if (!envelope || !envelope.ciphertext || !envelope.iv || !envelope.salt) {
      throw new Error('Invalid vault envelope');
    }

    const saltBytes = new Uint8Array(base64ToBuffer(envelope.salt));
    const ivBytes = new Uint8Array(base64ToBuffer(envelope.iv));
    const cipherBuffer = base64ToBuffer(envelope.ciphertext);

    const key = await deriveKeyFromSecret(secret, saltBytes);

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        key,
        cipherBuffer
      );

      const dec = new TextDecoder();
      const jsonStr = dec.decode(decryptedBuffer);
      
      // Decryption succeeded! Reset attempt counter & cache in session
      resetFailedAttempts();
      setSessionVaultSecret(secret);

      return JSON.parse(jsonStr);
    } catch (err) {
      // Record failed attempt
      const updatedStatus = recordFailedAttempt();
      if (updatedStatus.isLocked) {
        throw new Error(`VAULT_LOCKED:${updatedStatus.remainingSeconds}`);
      }
      throw new Error('INCORRECT_SECRET');
    }
  }

  // Canonical Dynamic Field Definition & Matching Engine
  const CANONICAL_FIELD_TEMPLATES = [
    { key: 'full_name', label: 'Nama Lengkap (Full Name)', category: 'identity', aliases: ['nama', 'name', 'full name', 'applicant name', 'nama lengkap', 'nama pemohon'] },
    { key: 'passport_number', label: 'Nomor Paspor', category: 'travel', aliases: ['passport', 'no paspor', 'nomor paspor', 'passport number', 'travel document'] },
    { key: 'passport_expiry', label: 'Masa Berlaku Paspor', category: 'travel', aliases: ['passport expiry', 'berlaku paspor', 'expiry date', 'tanggal berakhir'] },
    { key: 'nik', label: 'Nomor Induk Kependudukan (NIK/KTP)', category: 'identity', aliases: ['nik', 'ktp', 'national id', 'identity number', 'nomor ktp'] },
    { key: 'birth_date', label: 'Tanggal Lahir', category: 'identity', aliases: ['birth date', 'date of birth', 'tanggal lahir', 'tgl lahir', 'dob'] },
    { key: 'birth_place', label: 'Tempat Lahir', category: 'identity', aliases: ['birth place', 'place of birth', 'tempat lahir', 'kota lahir'] },
    { key: 'nationality', label: 'Kewarganegaraan', category: 'identity', aliases: ['nationality', 'kewarganegaraan', 'citizenship', 'negara asal'] },
    { key: 'email', label: 'Email', category: 'contact', aliases: ['email', 'surel', 'e-mail address', 'alamat email'] },
    { key: 'phone', label: 'Nomor Telepon / WhatsApp', category: 'contact', aliases: ['phone', 'telp', 'nomor hp', 'telepon', 'mobile', 'whatsapp'] },
    { key: 'address', label: 'Alamat Tinggal / Domisili', category: 'contact', aliases: ['address', 'alamat', 'domisili', 'tempat tinggal', 'residence'] },
    { key: 'university', label: 'Asal Kampus / Universitas', category: 'education', aliases: ['university', 'kampus', 'universitas', 'perguruan tinggi', 'college', 'institution'] },
    { key: 'gpa', label: 'IPK / GPA', category: 'education', aliases: ['ipk', 'gpa', 'grade point average', 'indeks prestasi kumulatif'] },
    { key: 'degree', label: 'Jenjang Pendidikan / Gelar', category: 'education', aliases: ['degree', 'jenjang', 'strata', 'gelar', 'education level'] },
    { key: 'major', label: 'Jurusan / Program Studi', category: 'education', aliases: ['major', 'jurusan', 'program studi', 'field of study'] },
    { key: 'emergency_contact', label: 'Kontak Darurat', category: 'contact', aliases: ['emergency', 'kontak darurat', 'emergency contact', 'kerabat'] }
  ];

  window.TelmyCryptoVault = {
    encryptVaultData,
    decryptVaultData,
    generateSeedPhrase,
    calculatePasswordStrength,
    getAttemptStatus,
    resetFailedAttempts,
    setSessionVaultSecret,
    getSessionVaultSecret,
    clearSessionVaultSecret,
    CANONICAL_FIELD_TEMPLATES
  };
})();
