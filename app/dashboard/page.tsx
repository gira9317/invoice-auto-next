import Image from "next/image"

export default function Home(){
    return(
        <div>
            <header className="flex flex-row justify-between items-center py-6  px-16  order-0 self-stretch">
                <p className="not-italic font-black text-[3.50rem] leading-none leading-[110%] items-center text-[#000000] order-0">INVOICE AUTO</p>
                <nav className="flex flex-row items-center p-0 gap-10 order-1">
                    <a href="#" className="not-italic font-medium text-base leading-[145%] items-center text-center underline capitalize text-[#000000] order-0">ダッシュボード</a>
                    <a href="/invoices" className="not-italic font-medium text-base leading-[145%] items-center text-center underline capitalize text-[#000000] order-1">請求書確認・送信</a>
                    <a href="#" className="not-italic font-medium text-base leading-[145%] items-center text-center underline capitalize text-[#000000] order-2">詳細設定</a>
                    <a href="#" className="not-italic font-medium text-base leading-[145%] items-center text-center underline capitalize text-[#000000] order-3">ログアウト</a>
                </nav>
            </header>
            <header className="flex justify-between items-center py-3  px-16  order-1 self-stretch">
                <p className="not-italic font-black text-4xl leading-[110%] items-center text-[#000000] order-0">ダッシュボード</p>
            </header>

            <section className="flex flex-col items-center py-5  px-16  gap-8 w-full max-w-7xl my-0  m-auto  box-border">
                <a href="#" className="block w-full max-w-[50.00rem] text-inherit">
                    <article className="box-border flex flex-row items-center w-full min-h-[10.44rem] rounded-2xl overflow-hidden border border-gray-200">
                        <Image
                            className="w-[160px] h-[167px] object-cover shrink-0"
                            src="/icon/osatsu_money_yamadumi.png"
                            alt="収入アイコン"
                            width={160}
                            height={167}
                            />

                        <div className="flex flex-col justify-center items-start p-6 gap-6">
                            <div className="flex flex-col gap-2">
                                <h2 className="m-0 font-bold text-2xl leading-[1.45] text-[#000000]">今月の収入 ￥100,000</h2>
                                <p className="m-0 font-medium text-lg leading-[1.45] text-black/[0.55]">◯月◯日までの収益</p>
                            </div>

                            <p className="m-0 font-medium text-lg leading-[1.45] text-[#000000]">
                                今月の請求書スプレッドシートを見る →
                            </p>
                        </div>
                    </article>
                </a>
            </section>

            <section className="flex flex-col items-center py-5  px-16  gap-8 w-full max-w-7xl my-0  m-auto  box-border">
                <a href="/invoices" className="block w-full max-w-[50.00rem] text-inherit">
                    <article className="box-border flex flex-row items-center w-full min-h-[10.44rem] rounded-2xl overflow-hidden border border-gray-200">
                        <Image
                            className="w-[160px] h-[167px] object-cover shrink-0"
                            src="/icon/computer_email.png"
                            alt="メールアイコン"
                            width={160}
                            height={167}
                            />

                        <div className="flex flex-col justify-center items-start p-6 gap-6">
                            <div className="flex flex-col gap-2">
                                <h2 className="m-0 font-bold text-2xl leading-[1.45] text-[#000000]">請求書を確認・送付</h2>
                                <p className="m-0 font-medium text-lg leading-[1.45] text-black/[0.55]">送信・履歴・ステータス確認</p>
                            </div>

                            <p className="m-0 font-medium text-lg leading-[1.45] text-[#000000]">
                                請求書の確認・送付 →
                            </p>
                        </div>
                    </article>
                </a>
            </section>

            <section className="flex flex-col items-center py-5  px-16  gap-8 w-full max-w-7xl my-0  m-auto  box-border">
                <a href="#" className="block w-full max-w-[50.00rem] text-inherit">
                    <article className="box-border flex flex-row items-center w-full min-h-[10.44rem] rounded-2xl overflow-hidden border border-gray-200">
                        <Image
                            className="w-[160px] h-[167px] object-cover shrink-0"
                            src="/icon/haguruma_gear_set.png"
                            alt="設定アイコン"
                            width={160}
                            height={167}
                            />

                        <div className="flex flex-col justify-center items-start p-6 gap-6">
                            <div className="flex flex-col gap-2">
                                <h2 className="m-0 font-bold text-2xl leading-[1.45] text-[#000000]">詳細設定</h2>
                                <p className="m-0 font-medium text-lg leading-[1.45] text-black/[0.55]">商品ごとの料金設定、銀行口座や住所変更等、請求書に必要な情報を変更</p>
                            </div>

                            <p className="m-0 font-medium text-lg leading-[1.45] text-[#000000]">
                                設定スプレッドシートを開く →
                            </p>
                        </div>
                    </article>
                </a>
            </section>

            <footer className="box-border flex flex-row justify-between items-center p-16 gap-[7.50rem]">
                <div className="flex-row justify-center items-center p-0 gap-8">
                    <div className="flex flex-row items-center p-0 gap-8">
                        <p className="not-italic font-semibold text-xl leading-[145%] items-center text-center text-[#000000]">INVOICE AUTO</p>
                            <nav className="flex-row items-start p-0 gap-8">
                                <p className="not-italic font-medium text-base leading-[145%] items-center text-black/[0.55]">Support by sy13.exe@gmail.com</p>
                            </nav>
                    </div>
                </div>
                <nav className="flex items-center gap-4">
                    <a href="https://instagram.com" className="flex justify-center items-center" target="_blank">
                        <img
                            src="/icon/Instagram_Glyph_Black.png"
                            alt="Instagram"
                            className="w-6 h-6"
                            />
                    </a>
                </nav>
            </footer>
        </div> 
    )
}
    