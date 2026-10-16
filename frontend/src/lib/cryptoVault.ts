// Telmy Web Dashboard — Zero-Knowledge Client-Side Encryption (CSE) Vault Utility
// Powered by Web Crypto API (AES-GCM 256-bit + PBKDF2 with 100,000 iterations)

function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

async function deriveKeyFromSecret(secret: string, saltBytes: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const cleanSecret = String(secret).trim()
  const secretBuffer = enc.encode(cleanSecret)

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    secretBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export interface VaultEnvelope {
  ciphertext: string
  iv: string
  salt: string
  updatedAt?: string
  lockType?: 'password' | 'seed_phrase'
}

export interface VaultDecrypted {
  vaultVersion?: number
  lastUpdated?: string
  documents?: any[]
  fields: Array<{
    id: string
    key: string
    label?: string
    value: string
    category?: string
    sourceDocName?: string
    aliases?: string[]
    isCustom?: boolean
  }>
}

export async function encryptVault(
  plainObject: VaultDecrypted,
  secret: string,
  existingSalt: string | null = null,
  lockType: 'password' | 'seed_phrase' = 'password'
): Promise<VaultEnvelope> {
  const enc = new TextEncoder()
  const dataBuffer = enc.encode(JSON.stringify(plainObject))

  let saltBytes: Uint8Array
  if (existingSalt) {
    saltBytes = new Uint8Array(base64ToBuffer(existingSalt))
  } else {
    saltBytes = window.crypto.getRandomValues(new Uint8Array(16))
  }

  const ivBytes = window.crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKeyFromSecret(secret, saltBytes)

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    dataBuffer
  )

  return {
    ciphertext: bufferToBase64(encryptedBuffer),
    iv: bufferToBase64(ivBytes.buffer as ArrayBuffer),
    salt: bufferToBase64(saltBytes.buffer as ArrayBuffer),
    lockType,
    updatedAt: new Date().toISOString()
  }
}

export async function decryptVault(
  envelope: VaultEnvelope,
  secret: string
): Promise<VaultDecrypted> {
  if (!envelope || !envelope.ciphertext || !envelope.iv || !envelope.salt) {
    throw new Error('Invalid vault envelope')
  }

  const saltBytes = new Uint8Array(base64ToBuffer(envelope.salt))
  const ivBytes = new Uint8Array(base64ToBuffer(envelope.iv))
  const cipherBuffer = base64ToBuffer(envelope.ciphertext)

  const key = await deriveKeyFromSecret(secret, saltBytes)

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      key,
      cipherBuffer
    )

    const dec = new TextDecoder()
    const jsonStr = dec.decode(decryptedBuffer)
    return JSON.parse(jsonStr)
  } catch (err) {
    throw new Error('INCORRECT_SECRET')
  }
}
