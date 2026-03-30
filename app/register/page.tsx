
'use client'
import Image from "next/image"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


export default function Home() {

    const [sheetUrl,setSheetUrl] = useState("")

    const handleSave = async() => {
        try{
            const{data:{user},error:userError} = await supabase.auth.getUser()

            if (userError || !user) {
                alert('ログイン情報が取得できません')
                return
            }

            const res = await fetch('/api/save-sheet-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user.id,
                    sheet_url: sheetUrl,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error || '保存に失敗しました')
                return
            }

            alert('保存しました')
        } catch (error) {
            console.error(error)
            alert('通信エラーが発生しました')
        }
    }

    const saveProfile = async () => {
            const { data } = await supabase.auth.getSession()

            const userId = data.session?.user?.id
            const email = data.session?.user?.email
            const refreshToken = data.session?.provider_refresh_token

            if (!userId) return

            await fetch('/api/save-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: userId,
                    email,
                    provider_refresh_token: refreshToken,
                }),
            })
        }

    

    const loadSheetUrl = async () => {
        const { data:userData } = await supabase.auth.getUser()
        const user_id = userData.user?.id
        const { data:profile, error} = await supabase
        .from("profiles")
        .select("settings_sheet_url")
        .eq("id",user_id)
        .single()

        if (error) {
            console.error(error)
            return
        }
        setSheetUrl(profile.settings_sheet_url)
    }

    useEffect(() => {
        saveProfile()
        loadSheetUrl()
    }, [])
    
    return (
        <div className="min-h-screen flex flex-col">
            <header
                className="
                flex flex-col gap-4
                md:flex-row md:justify-between md:items-center
                py-6 px-4 md:px-8 lg:px-16
                "
            >
                <p
                    className="
                    font-black
                    text-[2rem]
                    md:text-[2.5rem]
                    lg:text-[3.5rem]
                    leading-[110%]
                    text-black
                    "
                >
                    INVOICE AUTO
                </p>

                <nav
                    className="
                    flex flex-row md:flex
                    items-center
                    gap-2 lg:gap-10
                    "
                >
                    <a href="/dashboard" className="font-medium text-xs md:text-base underline text-black">
                        ダッシュボード
                    </a>
                    <a href="invoices" className="font-medium text-xs md:text-base underline text-black">
                        請求書確認・送信
                    </a>
                    <a href="register" className="font-medium text-xs md:text-base underline text-black">
                        詳細設定
                    </a>
                    <a href="#" className="font-medium text-xs md:text-base underline text-black">
                        ログアウト
                    </a>
                </nav>
            </header>

            <header className="px-4 md:px-8 lg:px-16 py-3">
                <p
                    className="
                    font-black
                    text-2xl md:text-3xl lg:text-4xl
                    leading-[110%]
                    text-black
                    "
                >
                    請求書確認・送信
                </p>
            </header>


            <div className="flex flex-col items-center w-full max-w-[145rem] px-4 md:px-8 lg:px-16">
                <div className="flex flex-col items-start w-full py-4 md:py-6 gap-3 md:gap-4">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-lg md:text-xl lg:text-2xl leading-[100%] text-black">
                            設定スプレッドシートURL
                        </p>
                        <p className="font-bold text-lg md:text-xl lg:text-2xl leading-[100%] text-[#D32929]">
                            （必須）
                        </p>
                    </div>

                    <input
                        type="text"
                        value={sheetUrl}
                        onChange={(e) => setSheetUrl(e.target.value)}
                        placeholder="例）https://docs.google.com/spreadsheets/d/..."
                        className="
                            w-full h-10 md:h-11
                            px-3
                            border border-[#D9D9D9]
                            rounded
                            text-base
                            placeholder:text-[#B3B3B3]
                            outline-none
                        "
                    />

                    <div className="flex flex-col gap-2">
                        <p className="text-base md:text-lg font-bold leading-[145%] text-black">
                            必ずダウンロードボタンをクリックした後、
                            <span className="text-[#D32929]">「コピーを作成」</span>
                            してから使用してください！
                        </p>
                        <p className="text-base md:text-lg font-bold leading-[145%] text-black">
                            コピーしたスプレッドシートのURLを、上記の欄に入力してください。
                            <br></br>入力後、保存ボタンを押してください。
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <a
                    href="https://docs.google.com/spreadsheets/d/1YSs-pRVAIgR310LRMrVVYWjU921zOcc1sT2gGNZRAs0/edit?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        w-full max-w-[280px]
                        h-[48px] md:h-[56px]
                        flex items-center justify-center
                        bg-white
                        text-black
                        border boder-black
                        rounded-full
                        text-sm md:text-base
                        hover:opacity-80
                        transition
                    "
                >
                    ダウンロード
                </a>

                <button
                    className="
                        w-full max-w-[280px]
                        h-[48px] md:h-[56px]
                        flex items-center justify-center
                        bg-[#010004]
                        text-white
                        rounded-full
                        text-sm md:text-base
                        hover:opacity-80
                        transition
                        cursor-pointer
                    "
                    onClick={handleSave}
                >
                    保存
                </button>
            </div>
        </div>
    )
}

