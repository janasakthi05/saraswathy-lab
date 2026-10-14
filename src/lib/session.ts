const encoder = new TextEncoder();

// Import secret as crypto key
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Convert signature hex back to buffer
function hexToBuffer(hex: string): ArrayBuffer {
  const matches = hex.match(/.{1,2}/g) || [];
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16))).buffer as ArrayBuffer;
}

/**
 * Sign session payload into token format: `id:email:expiresAt:signature`
 */
export async function signSession(
  payload: { id: string; email: string },
  secret: string,
  expiryDays = 7
): Promise<string> {
  const expiresAt = Date.now() + expiryDays * 24 * 60 * 60 * 1000;
  const key = await getCryptoKey(secret);
  const dataStr = `${payload.id}:${payload.email}:${expiresAt}`;
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataStr)
  );

  const signatureHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return `${dataStr}:${signatureHex}`;
}

/**
 * Verify session token structure and HMAC signature
 */
export async function verifySession(
  rawToken: string,
  secret: string
): Promise<{ id: string; email: string } | null> {
  if (!rawToken) return null;
  
  try {
    const token = decodeURIComponent(rawToken);
    const parts = token.split(':');
    if (parts.length !== 4) return null;
    
    const [id, email, expiresAtStr, signatureHex] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);
    
    // Check if token has expired
    if (Date.now() > expiresAt) {
      return null;
    }

    const key = await getCryptoKey(secret);
    const dataStr = `${id}:${email}:${expiresAt}`;
    
    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      hexToBuffer(signatureHex),
      encoder.encode(dataStr)
    );

    if (!verified) {
      return null;
    }

    return { id, email };
  } catch (err) {
    console.error('Session verification error:', err);
    return null;
  }
}
