import "./globals.css";

import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";

import { AppProvider } from "@/app/provider";
import { BaseContentLayout } from "@/components/layouts/base-content-layout";
import { BottomNavbar } from "@/features/navigation/components/bottom-navbar/bottom-navbar";
import { Navbar } from "@/features/navigation/components/navbar";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { getI18nConfig } from "@/i18n/request";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kartei",
  description: "",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const i18nConfig = await getI18nConfig();

  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}
      >
        <AppProvider i18nConfig={i18nConfig}>
          <Navbar />
          <BottomNavbar />

          <div className="flex">
            <Sidebar />

            <div className="min-w-0 flex-1">
              <BaseContentLayout>{children}</BaseContentLayout>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
