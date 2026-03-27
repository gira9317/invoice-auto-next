export default function Home(){
  return(
    <section className="flex flex-col justify-center items-center py-28  px-16  gap-12 min-h-screen box-border">
        <div className="flex flex-col items-center gap-8 text-center">
            <h1 className="m-0 font-bold text-[4.00rem] leading-[110%] text-[#000000]">INVOICE AUTO</h1>
            <p className="m-0 font-medium text-2xl leading-[145%] text-black/[0.55]">ボタン1つで請求書発行・送信</p>
        </div>

    <div className="flex flex-row flex-wrap items-center gap-4">
        <button className="py-3  px-4  rounded-xl border border-gray-300 bg-black font-medium text-lg leading-[145%] text-[#ffffff]">ログイン</button>
        <button className="py-3  px-4  rounded-xl border border-gray-300 font-medium text-lg leading-[145%] text-[#000000]">登録</button>
    </div>
    </section>
  )
}