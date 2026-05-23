import type { Metadata } from "next";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import PrivyProviderWrapper from "@/components/PrivyProviderWrapper";
import RouteBackgroundCrossfade from "@/components/RouteBackgroundCrossfade";

export const metadata: Metadata = {
  title: "Awebo.wtf",
  description: "Launch and trade tokens on L1X",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/awebo_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistPixelSquare.variable} font-sans`}>
      <body>
        <PrivyProviderWrapper>
          <RouteBackgroundCrossfade />
          {children}
        </PrivyProviderWrapper>
      </body>
    </html>
  );
}
