import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { decrypt } from '@/lib/crypto'

// DBからリフレッシュトークン取得
export async function GET() {
    try {
        const supabase = await createClient()

        const {
        data: { user },
        error,
        } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        }

        const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('google_refresh_token_encrypted')
        .eq('id', user.id)
        .single()

        if (profileError || !profile?.google_refresh_token_encrypted) {
            return NextResponse.json(
                { error: 'refresh_token が保存されていません' },
                { status: 404 }
            )
        }

        // 復号化
        const google_refresh_token = decrypt(profile.google_refresh_token_encrypted)

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: google_refresh_token,
            }),
        })

        const tokenData = await tokenResponse.json()

        if (!tokenResponse.ok) {
            return NextResponse.json(
                {
                error: 'Google access_token の取得に失敗しました',
                details: tokenData,
                },
                { status: 400 }
            )
        }

        const google_access_token = tokenData.access_token

        if (!google_access_token) {
            return NextResponse.json(
                { error: 'access_token が取得できませんでした' },
                { status: 400 }
            )
        }

        return NextResponse.json({
            access_token: google_access_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type,
        })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: 'server error' }, { status: 500 })
    }
    }