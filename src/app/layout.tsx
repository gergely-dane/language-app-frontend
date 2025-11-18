import { AppProvider } from "@/app/provider";
import { BaseContentLayout } from "@/components/layouts/base-content-layout";
import { Navbar } from "@/features/navigation/components/navbar";
import getI18nConfig from "@/i18n/request";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Language App",
  description: "",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // @ts-ignore
  const i18nConfig = await getI18nConfig();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider i18nConfig={i18nConfig}>
          <Navbar />
          <BaseContentLayout>{children}</BaseContentLayout>
        </AppProvider>
      </body>
    </html>
  );
};

export default RootLayout;
