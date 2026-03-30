import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { encrypt } from "@/lib/crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const{id,email,provider_refresh_token} = body
        
        if (!id || !email) {
            return NextResponse.json(
                { success: false, message: 'id or email is missing' },
                { status: 400 }
            )
        }
        const encryptedRefreshToken = provider_refresh_token ? encrypt(provider_refresh_token) : null

        const { error } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id,
            email,
            google_refresh_token_encrypted:encryptedRefreshToken
        }
    )

    if (error) {
        console.error(error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
    return NextResponse.json({ success: true })
} catch (e) {
    console.error(e)
    return NextResponse.json({ success: false }, { status: 500 })
    }
}