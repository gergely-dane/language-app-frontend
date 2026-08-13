import "./globals.css";

import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Spline_Sans_Mono } from "next/font/google";

import { AppProvider } from "@/app/provider";
import { BaseContentLayout } from "@/components/layouts/base-content-layout";
import { BottomNavbar } from "@/features/navigation/components/bottom-navbar/bottom-navbar";
import { Navbar } from "@/features/navigation/components/navbar";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { getI18nConfig } from "@/i18n/request";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const splineSansMono = Spline_Sans_Mono({
  variable: "--font-spline-mono",
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
        className={`${instrumentSans.variable} ${splineSansMono.variable} ${fraunces.variable} antialiased`}
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
