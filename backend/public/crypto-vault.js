// Telmy.ai — Zero-Knowledge Client-Side Encryption (CSE) Vault Engine
// Powered by Web Crypto API (AES-GCM 256-bit + PBKDF2 with 100,000 iterations)
(function () {
  'use strict';

  // Helper conversions between ArrayBuffer and Base64 / Hex
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

  // Derive AES-GCM 256-bit key from 6-digit PIN and Salt using PBKDF2
  async function deriveKeyFromPin(pin, saltBytes) {
    const enc = new TextEncoder();
    const pinBuffer = enc.encode(String(pin));

    // Import PIN as raw key material
    const baseKey = await window.crypto.subtle.importKey(
      'raw',
      pinBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    // Derive symmetric AES-GCM key
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
   * Encrypt plainObject using 6-Digit PIN
   * @param {Object} plainObject
   * @param {string} pin - 6-digit PIN
   * @param {string|null} existingSalt - optional existing salt Base64
   * @returns {Promise<{ ciphertext: string, iv: string, salt: string, updatedAt: string }>}
   */
  async function encryptVaultData(plainObject, pin, existingSalt = null) {
    const enc = new TextEncoder();
    const dataBuffer = enc.encode(JSON.stringify(plainObject));

    // 16 bytes salt
    let saltBytes;
    if (existingSalt) {
      saltBytes = new Uint8Array(base64ToBuffer(existingSalt));
    } else {
      saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    }

    // 12 bytes IV for AES-GCM
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKeyFromPin(pin, saltBytes);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      dataBuffer
    );

    return {
      ciphertext: bufferToBase64(encryptedBuffer),
      iv: bufferToBase64(ivBytes),
      salt: bufferToBase64(saltBytes),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Decrypt vault envelope using 6-Digit PIN
   * @param {{ ciphertext: string, iv: string, salt: string }} envelope
   * @param {string} pin - 6-digit PIN
   * @returns {Promise<Object>} Decrypted plainObject
   * @throws Error if PIN is incorrect or ciphertext corrupted
   */
  async function decryptVaultData(envelope, pin) {
    if (!envelope || !envelope.ciphertext || !envelope.iv || !envelope.salt) {
      throw new Error('Invalid vault envelope');
    }

    const saltBytes = new Uint8Array(base64ToBuffer(envelope.salt));
    const ivBytes = new Uint8Array(base64ToBuffer(envelope.iv));
    const cipherBuffer = base64ToBuffer(envelope.ciphertext);

    const key = await deriveKeyFromPin(pin, saltBytes);

    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivBytes },
        key,
        cipherBuffer
      );

      const dec = new TextDecoder();
      const jsonStr = dec.decode(decryptedBuffer);
      return JSON.parse(jsonStr);
    } catch (err) {
      // AES-GCM tag mismatch indicates wrong PIN
      throw new Error('INCORRECT_PIN');
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
    CANONICAL_FIELD_TEMPLATES
  };
})();
