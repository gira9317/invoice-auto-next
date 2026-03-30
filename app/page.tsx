import GoogleLoginButton from '@/components/GoogleLoginButton';


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="w-full max-w-[700px]">
        <div
          className="
            flex flex-col items-center
            gap-6
            w-full
            mx-auto
          "
        >
          <h1
            className="
              w-full
              text-center
              font-bold
              text-[36px]
              leading-[110%]
              tracking-[-0.02em]
              text-black
              md:text-[44px]
              lg:text-[64px]
            "
          >
            INVOICE AUTO
          </h1>

          <p
            className="
              w-full
              text-center
              font-medium
              text-[18px]
              leading-[145%]
              tracking-[-0.005em]
              text-black/55
              md:text-[22px]
              lg:text-[24px]
              cursor-pointer
            "
          >
            ボタン1つで請求書発行・送信
          </p>
          <div><GoogleLoginButton></GoogleLoginButton></div>
        </div>
      </section>
    </main>
  );
}