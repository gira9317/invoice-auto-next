import Image from "next/image"

export default function Home() {
    return (
        <div>
            <header className="flex flex-row justify-between items-center py-6 px-16 self-stretch">
                <p className="font-black text-[3.50rem] leading-[110%] text-[#000000]">
                INVOICE AUTO
                </p>
                <nav className="flex flex-row items-center gap-10">
                <a href="#" className="font-medium text-base leading-[145%] text-center underline text-[#000000]">
                    ダッシュボード
                </a>
                <a href="#" className="font-medium text-base leading-[145%] text-center underline text-[#000000]">
                    請求書確認・送信
                </a>
                <a href="#" className="font-medium text-base leading-[145%] text-center underline text-[#000000]">
                    詳細設定
                </a>
                <a href="#" className="font-medium text-base leading-[145%] text-center underline text-[#000000]">
                    ログアウト
                </a>
                </nav>
            </header>

            <header className="flex justify-between items-center py-3 px-16">
                <p className="font-black text-4xl leading-[110%] text-[#000000]">
                請求書確認・送信
                </p>
            </header>

            <section className="flex flex-col items-center py-5 px-16 gap-8">
                <article className="box-border flex items-center w-full max-w-[50rem] min-h-[12.13rem] rounded-2xl border border-gray-200">
                <div className="flex flex-col justify-between items-start p-6 gap-[0.31rem] w-full">
                    <div className="flex justify-between items-center gap-2 mb-3 w-full">
                    <p className="font-bold text-2xl leading-[145%] text-[#000000]">
                        2026年3月
                    </p>
                    <p className="font-bold text-4xl leading-[145%] text-[#000000]">
                        ￥100,000
                    </p>
                    </div>

                    <div className="flex items-start gap-[1.13rem] mb-2">
                    <p className="font-medium text-lg leading-[145%] text-black/55">
                        案件数:10
                    </p>
                    <p className="font-medium text-lg leading-[145%] text-black/55">
                        交通費:￥10,000
                    </p>
                    </div>

                    <a href="#" className="font-medium text-lg leading-[145%] mt-1 text-[#000000]">
                    メールを送信する →
                    </a>

                    <a href="#" className="font-medium text-lg leading-[145%] mt-1 text-[#000000]">
                    スプレッドシートを見る →
                    </a>
                </div>
                </article>
            </section>
        </div>
    )
}