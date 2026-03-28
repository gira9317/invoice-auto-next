import Image from "next/image";

export default function Home() {
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

            <section
                className="
                flex flex-col items-center
                py-5 px-4 md:px-8 lg:px-16
                gap-6 md:gap-8
                "
            >
                <article
                    className="
                    flex flex-col
                    md:flex-row md:items-center
                    w-full max-w-[50rem]
                    rounded-2xl
                    border border-gray-200
                    overflow-hidden
                    "
                >
                    <div
                        className="
                        flex flex-col
                        justify-between
                        p-5 md:p-6
                        gap-2
                        w-full
                        "
                    >
                        <div
                            className="
                            flex flex-col gap-4
                            items-baseline
                            md:flex-row justify-between
                            "
                        >
                            <p className="font-bold text-l md:text-2xl leading-[145%] text-black">
                                2026年3月
                            </p>

                            <p
                                className="
                                font-bold
                                text-2xl md:text-3xl lg:text-4xl
                                leading-[145%]
                                text-black
                                "
                            >
                                ￥100,000
                            </p>
                        </div>

                        <div
                            className="
                            flex flex-row gap-1
                            md:flex-row md:gap-6
                            "
                        >
                            <p className="font-medium text-base md:text-lg leading-[145%] text-black/55">
                                案件数:10
                            </p>
                            <p className="font-medium text-base md:text-lg leading-[145%] text-black/55">
                                交通費:￥10,000
                            </p>
                        </div>

                        
                        <div className="flex flex-row gap-5 mt-2">
                            <a
                                href="#"
                                className="
                                font-medium
                                text-base md:text-lg
                                leading-[145%]
                                text-black
                                underline
                                "
                            >
                                メール送信 →
                            </a>

                            <a
                                href="#"
                                className="
                                font-medium
                                text-base md:text-lg
                                leading-[145%]
                                text-black
                                underline
                                "
                            >
                                明細確認（スプシ） →
                            </a>
                        </div>
                    </div>
                </article>
            </section>

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