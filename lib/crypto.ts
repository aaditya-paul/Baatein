/**
 * Client-Side Encryption Utilities
 * Provides E2EE functionality where even the dev cannot decrypt user data
 */

const ITERATIONS = 100000; // PBKDF2 iterations
const KEY_LENGTH = 256; // AES-256

/**
 * Generate a random Data Encryption Key (DEK)
 */
export async function generateDEK(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: KEY_LENGTH,
    },
    true, // extractable
    ["encrypt", "decrypt"]
  );
}

/**
 * Export a CryptoKey to base64 string
 */
export async function exportKey(key: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("raw", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
}

/**
 * Import a base64 key string to CryptoKey
 */
export async function importKey(keyString: string): Promise<CryptoKey> {
  const keyData = Uint8Array.from(atob(keyString), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey("raw", keyData, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Derive a Key Encryption Key (KEK) from user's PIN using PBKDF2
 */
export async function deriveKEK(pin: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const pinKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const saltBuffer = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    pinKey,
    { name: "AES-GCM", length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Generate a random salt for PBKDF2
 */
export function generateSalt(): string {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return btoa(String.fromCharCode(...salt));
}

/**
 * Encrypt the DEK with the KEK
 */
export async function encryptDEK(
  dek: CryptoKey,
  kek: CryptoKey
): Promise<string> {
  const dekRaw = await crypto.subtle.exportKey("raw", dek);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    kek,
    dekRaw
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt the DEK with the KEK
 */
export async function decryptDEK(
  encryptedDEK: string,
  kek: CryptoKey
): Promise<CryptoKey> {
  const combined = Uint8Array.from(atob(encryptedDEK), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    kek,
    encrypted
  );

  return await crypto.subtle.importKey("raw", decrypted, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypt text content with DEK
 */
export async function encryptContent(
  content: string,
  dek: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    dek,
    encoder.encode(content)
  );

  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt text content with DEK
 */
export async function decryptContent(
  encryptedContent: string,
  dek: CryptoKey
): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedContent), (c) =>
    c.charCodeAt(0)
  );
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    dek,
    encrypted
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
