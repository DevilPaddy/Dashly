import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 16; // 128 bits for GCM
const KEY_LENGTH = 32; // 256 bits for AES-256

// Validate and load encryption key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// For build time, use a default key if not provided
const DEFAULT_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"; // 64 hex chars = 32 bytes

let SECRET: Buffer;

if (!ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("ENCRYPTION_KEY environment variable is required in production");
    }
    // Use default key for development/build
    console.warn("⚠️  Using default encryption key. Set ENCRYPTION_KEY in production!");
    SECRET = Buffer.from(DEFAULT_KEY, "hex");
} else {
    // Validate key format (should be 32-byte hex string)
    try {
        if (ENCRYPTION_KEY.length === 64) {
            // Hex format (64 hex chars = 32 bytes)
            SECRET = Buffer.from(ENCRYPTION_KEY, "hex");
        } else if (ENCRYPTION_KEY.length === 44) {
            // Base64 format (44 base64 chars = 32 bytes)
            SECRET = Buffer.from(ENCRYPTION_KEY, "base64");
        } else {
            throw new Error("Invalid key length");
        }
        
        if (SECRET.length !== KEY_LENGTH) {
            throw new Error(`Encryption key must be exactly ${KEY_LENGTH} bytes`);
        }
    } catch (error) {
        throw new Error(`Invalid ENCRYPTION_KEY format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Encrypt text using AES-256-GCM
 * Format: iv:authTag:encryptedData (all base64 encoded)
 * @param text - Plain text to encrypt
 * @returns Encrypted string in base64 format
 */
export function encrypt(text: string): string {
    if (!text || typeof text !== 'string') {
        throw new Error("Text to encrypt must be a non-empty string");
    }

    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);

        const encrypted = Buffer.concat([
            cipher.update(text, "utf8"),
            cipher.final(),
        ]);

        const tag = cipher.getAuthTag();

        // Format: iv + tag + encrypted data
        return Buffer.concat([iv, tag, encrypted]).toString("base64");
    } catch (error) {
        throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Decrypt text using AES-256-GCM
 * @param encryptedData - Base64 encoded encrypted data
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
    if (!encryptedData || typeof encryptedData !== 'string') {
        throw new Error("Encrypted data must be a non-empty string");
    }

    try {
        const data = Buffer.from(encryptedData, "base64");

        if (data.length < IV_LENGTH + TAG_LENGTH) {
            throw new Error("Invalid encrypted data format");
        }

        const iv = data.subarray(0, IV_LENGTH);
        const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
        const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH);

        const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, iv);
        decipher.setAuthTag(tag);

        const decrypted = decipher.update(encrypted, undefined, "utf8") + decipher.final("utf8");
        return decrypted;
    } catch (error) {
        throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Generate a new 256-bit encryption key
 * @returns 32-byte key as hex string
 */
export function generateKey(): string {
    return crypto.randomBytes(KEY_LENGTH).toString("hex");
}

/**
 * Validate if a string is properly encrypted
 * @param encryptedData - Data to validate
 * @returns boolean indicating if data appears to be encrypted
 */
export function isEncrypted(encryptedData: string): boolean {
    try {
        const data = Buffer.from(encryptedData, "base64");
        return data.length >= IV_LENGTH + TAG_LENGTH;
    } catch {
        return false;
    }
}
