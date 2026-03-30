
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { decrypt } from '@/lib/crypto'

export async function getGoogleAccessToken(userId: string) {
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('google_refresh_token_encrypted')
        .eq('id', userId)
        .single()

    if (profileError || !profile?.google_refresh_token_encrypted) {
        throw new Error('refresh_token が保存されていません')
    }

    const google_refresh_token = decrypt(profile.google_refresh_token_encrypted)

    const body = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: google_refresh_token,
    })

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error('Google access_token の取得に失敗しました')
    }

    return tokenData.access_token as string
}