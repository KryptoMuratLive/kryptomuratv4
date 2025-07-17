import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KryptoMurat - Web3 Platform",
  description: "Die ultimative Web3-Plattform für das Bitcoin Hunt Adventure",
  keywords: ["Web3", "Bitcoin", "Crypto", "Staking", "NFT", "Gaming"],
  authors: [{ name: "KryptoMurat Team" }],
  openGraph: {
    title: "KryptoMurat - Web3 Platform",
    description: "Die ultimative Web3-Plattform für das Bitcoin Hunt Adventure",
    type: "website",
    url: "https://kryptomurat.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "KryptoMurat - Web3 Platform",
    description: "Die ultimative Web3-Plattform für das Bitcoin Hunt Adventure",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
