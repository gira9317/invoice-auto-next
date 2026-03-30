import crypto from 'crypto'

const ENCRYPTION_KEY_HEX = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY_HEX) {
    throw new Error('ENCRYPTION_KEY is not set')
}

const key = Buffer.from(ENCRYPTION_KEY_HEX, 'hex')

if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex chars)')
}

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(12) 
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final()
    ])

    const authTag = cipher.getAuthTag()

    return [
        iv.toString('hex'),
        authTag.toString('hex'),
        encrypted.toString('hex')
    ].join(':')
}

export function decrypt(payload: string): string {
    const parts = payload.split(':')

    if (parts.length !== 3) {
        throw new Error('Invalid encrypted payload format')
    }

    const [ivHex, authTagHex, encryptedHex] = parts

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const encrypted = Buffer.from(encryptedHex, 'hex')

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ])

    return decrypted.toString('utf8')
}