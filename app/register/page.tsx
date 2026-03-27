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
                詳細設定
                </p>
            </header>

            <div className="flex flex-col items-center w-full max-w-[145rem] px-16">
                <div className="flex flex-col items-start w-full py-6 gap-4">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-2xl leading-[100%] text-black">氏名</p>
                        <p className="font-bold text-2xl leading-[100%] text-[#D32929]">（必須）</p>
                    </div>
                    <input
                        type="text"
                        placeholder="例）山田太郎"
                        className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[4px] text-base placeholder:text-[#B3B3B3] outline-none"
                        />
                </div>

                <div className="flex flex-col items-start w-full py-6 gap-4">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-2xl leading-[100%] text-black">設定スプレッドシートURL</p>
                        <p className="font-bold text-2xl leading-[100%] text-[#D32929]">（必須）</p>
                    </div>

                    <input
                    type="text"
                    placeholder="例）https://docs.google.com/spreadsheets/d/..."
                    className="w-full h-10 px-3 border border-[#D9D9D9] rounded-[4px] text-base placeholder:text-[#B3B3B3] outline-none"
                    />

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-bold leading-[145%] text-black">
                            必ず以下のボタンをクリックした後、
                            <span className="text-[#D32929]">「コピーを作成」</span>
                            してから使用してください！
                        </p>
                        <p className="text-lg font-bold leading-[145%] text-black">
                            コピーしたスプレッドシートのURLを、上記の欄に入力してください。
                        </p>
                    </div>
                </div>
            </div>
            <a
                href="https://docs.google.com/spreadsheets/d/1YSs-pRVAIgR310LRMrVVYWjU921zOcc1sT2gGNZRAs0/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-auto flex items-center justify-center w-[280px] h-[56px] bg-[#010004] text-white rounded-full"
                >
                ダウンロード
            </a>
        </div>
    )
}

