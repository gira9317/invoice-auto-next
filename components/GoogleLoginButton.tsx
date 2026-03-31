'use client'

import { supabase } from '@/lib/supabase'

export default function GoogleLoginButton(){
    return(
    <button
            className="
                flex items-center justify-center
                gap-2
                px-6 py-3
                bg-black
                text-white
                rounded-xl
                font-medium
                mx-auto
                hover:opacity-80
                transition
                cursor-pointer
            "
            onClick={() =>
                supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: 'http://localhost:3000/auth/callback',
                        scopes:`https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive`,
                        queryParams: {
                            access_type: 'offline',
                            prompt: 'consent'
                        }
                    }
                })
            }
        >
            Googleログイン
        </button>
    )
}