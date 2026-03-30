'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home(){
    const router = useRouter()

    useEffect(() => {
        const getUser = async() => {
            const { data } = await supabase.auth.getSession()
            const user_id = data.session?.user?.id
            const google_refresh_token = data.session?.provider_refresh_token
            const email = data.session?.user?.email

            await fetch('/api/save-profile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id:user_id,
                    email:email,
                    provider_refresh_token:google_refresh_token
                })
            })
        }
        router.push('/register')
        getUser()
    },[])
    return<div>データ送信中...</div>
}