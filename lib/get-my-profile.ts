import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function getMyProfile(userId: string) {
    return await supabaseAdmin
        .from('profiles')
        .select('id, email, settings_sheet_url')
        .eq('id', userId)
        .single()
    }