'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'


export default function Home() {

    const [totalAmount, setTotalAmount] = useState(0)
    const [sheetUrl, setSheetUrl] = useState("")

    const calcurated_income = 10 //ロード関数実装後置き換え
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    const day = today.getDate()
    
    

    const loadCalcurateIncome = async () => {
    const { data: profile } = await supabase.auth.getUser()
    const userId = profile?.user?.id

    const res = await fetch('/api/calcurate-income', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            yearMonth: `${year}-${String(month).padStart(2, "0")}`,
        }),
    })

    const data = await res.json()

    if (!res.ok) {
        console.error(data.error)
        return
    }

    console.log("合計金額:", data.totalAmount)
    console.log("シートURL:", data.sheetUrl)

    
    setTotalAmount(data.totalAmount)
    setSheetUrl(data.sheetUrl)
}

    

    useEffect(() => {
    loadCalcurateIncome();
    }, [])

    return (
        <div className="min-h-screen">
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

            <header className="px-4 py-3 md:px-8 lg:px-16">
                <p className="font-black text-[2rem] leading-[110%] text-black md:text-[2.25rem] lg:text-[2.5rem]">
                ダッシュボード
                </p>
            </header>

            <main className="flex flex-col gap-6 px-4 py-5 md:px-8 lg:px-16">
                <a 
                    href={sheetUrl || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full max-w-5xl mx-auto text-inherit"
                >
                <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 md:flex-row">
                    <Image
                    className="h-[220px] w-full object-cover md:h-auto md:w-[160px] md:shrink-0"
                    src="/icon/osatsu_money_yamadumi.png"
                    alt="収入アイコン"
                    width={160}
                    height={167}
                    />

                    <div className="flex flex-col justify-center gap-4 p-5 md:p-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="m-0 font-bold text-xl leading-[145%] text-black md:text-2xl">
                        今月の収入 ¥{(totalAmount ?? 0).toLocaleString()}
                        </h2>
                        <p className="m-0 font-medium text-base leading-[145%] text-black/55 md:text-lg">
                        {year}年{month}月{day}日までの収益
                        </p>
                    </div>

                    <p className="m-0 font-medium text-base leading-[145%] text-black md:text-lg">
                        今月の請求書スプレッドシートを見る →
                    </p>
                    </div>
                </article>
                </a>

                <a href="/invoices" className="block w-full max-w-5xl mx-auto text-inherit">
                <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 md:flex-row">
                    <Image
                    className="h-[220px] w-full object-cover md:h-auto md:w-[160px] md:shrink-0"
                    src="/icon/computer_email.png"
                    alt="メールアイコン"
                    width={160}
                    height={167}
                    />

                    <div className="flex flex-col justify-center gap-4 p-5 md:p-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="m-0 font-bold text-xl leading-[145%] text-black md:text-2xl">
                        請求書を確認・送付
                        </h2>
                        <p className="m-0 font-medium text-base leading-[145%] text-black/55 md:text-lg">
                        送信・履歴・ステータス確認
                        </p>
                    </div>

                    <p className="m-0 font-medium text-base leading-[145%] text-black md:text-lg">
                        請求書の確認・送付 →
                    </p>
                    </div>
                </article>
                </a>

                <a href="#" className="block w-full max-w-5xl mx-auto text-inherit">
                <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 md:flex-row">
                    <Image
                    className="h-[220px] w-full object-cover md:h-auto md:w-[160px] md:shrink-0"
                    src="/icon/haguruma_gear_set.png"
                    alt="設定アイコン"
                    width={160}
                    height={167}
                    />

                    <div className="flex flex-col justify-center gap-4 p-5 md:p-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="m-0 font-bold text-xl leading-[145%] text-black md:text-2xl">
                        詳細設定
                        </h2>
                        <p className="m-0 font-medium text-base leading-[145%] text-black/55 md:text-lg">
                        商品ごとの料金設定、銀行口座や住所変更等、請求書に必要な情報を変更
                        </p>
                    </div>

                    <p className="m-0 font-medium text-base leading-[145%] text-black md:text-lg">
                        設定スプレッドシートを開く →
                    </p>
                    </div>
                </article>
                </a>
            </main>

            <footer className="
                mt-auto
                flex flex-col gap-6
                px-4 py-10
                md:flex-row md:items-center md:justify-between md:px-8 lg:px-16
            ">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
                    <p className="font-semibold text-lg md:text-xl leading-[145%] text-black">
                        INVOICE AUTO
                    </p>
                    <p className="font-medium text-sm md:text-base leading-[145%] text-black/55">
                        Support by sy13.exe@gmail.com
                    </p>
                </div>

                <nav className="flex items-center gap-4">
                    <a
                        href="https://instagram.com"
                        className="flex items-center justify-center"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img
                            src="/icon/Instagram_Glyph_Black.png"
                            alt="Instagram"
                            className="w-6 h-6"
                        />
                    </a>
                </nav>
            </footer>
        </div>
    );
}
