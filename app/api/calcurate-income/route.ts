import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { decrypt } from '@/lib/crypto'
import { createInvoiceSheetFromTemplate } from '@/lib/create-invoice-sheet-from-template'

function extractSheetId(url: string) {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    return match?.[1] ?? null
}

// 請求書作成
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { userId, yearMonth } = body

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        if (!yearMonth) {
            return NextResponse.json({ error: 'yearMonth is required' }, { status: 400 })
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('email, settings_sheet_url, google_refresh_token_encrypted')
            .eq('id', userId)
            .single()

        if (profileError || !profile) {
            return NextResponse.json({ error: 'profile not found' }, { status: 404 })
        }

        if (!profile.settings_sheet_url) {
            return NextResponse.json({ error: 'sheet url not found' }, { status: 400 })
        }

        if (!profile.google_refresh_token_encrypted) {
            return NextResponse.json({ error: 'refresh token not found' }, { status: 400 })
        }

        if (!profile.email) {
            return NextResponse.json({ error: 'email not found' }, { status: 400 })
        }

        const refreshToken = decrypt(profile.google_refresh_token_encrypted)

        const sheetUrl = profile.settings_sheet_url
        const sheetId = extractSheetId(sheetUrl)

        if (!sheetId) {
            return NextResponse.json(
                { error: 'スプレッドシートIDが取得できません' },
                { status: 400 }
            )
        }

        const result = await createInvoiceSheetFromTemplate({
            spreadsheetId: sheetId,
            refreshToken,
            yearMonth,
            email: profile.email,
        })

        return NextResponse.json({
            success: true,
            spreadsheetId: result.spreadsheetId,
            fileName: result.fileName,
            sheetUrl: result.url,
            totalAmount: result.grandTotal,
            rowCount: result.rowCount,
        })
    } catch (error) {
        console.error('create-invoice-sheet error:', error)
        return NextResponse.json(
            { error: '請求書の作成に失敗しました' },
            { status: 500 }
        )
    }
}