import {ClerkProvider} from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LocaleProvider } from "@/lib/i18n/context";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "EasyBus — Tra cứu tuyến xe buýt TP.HCM",
  description:
    "Tra cứu tuyến, trạm dừng và lộ trình xe buýt TP. Hồ Chí Minh theo thời gian thực.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="h-full font-sans">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <LocaleProvider>
            <TooltipProvider delay={200}>{children}</TooltipProvider>
          </LocaleProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}