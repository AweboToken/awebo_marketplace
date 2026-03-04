import type { Metadata } from "next";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";

export const metadata: Metadata = {
  title: "Awebo.wtf",
  description: "Launch and trade tokens on L1X",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistPixelSquare.variable}>
      <body>
        <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
      </body>
    </html>
  );
}
