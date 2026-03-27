import "./globals.css";
import { Inter } from "next/font/google"
import { ReactNode } from "react";


const inter = Inter({
  subsets: ["latin"],
})

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }:Props) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}