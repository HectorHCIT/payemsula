import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { GlobalAlert } from "@/components/global-alert";
import { AlertProvider } from "@/providers/alert-provider";
import { RecaptchaEnterpriseProvider } from "@/components/recaptcha-enterprise-wrapper";
import { RecaptchaTestingPanel } from "@/components/recaptcha-testing-panel";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const interTingh = Inter_Tight({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emsula",
  description: "Link de pago para Emsula",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${interTingh.variable} antialiased`}
      >
        <RecaptchaEnterpriseProvider>
          <AlertProvider>
            {children}
            <GlobalAlert />
            {process.env.NODE_ENV === 'development' && <RecaptchaTestingPanel />}
          </AlertProvider>
        </RecaptchaEnterpriseProvider>
      </body>
    </html>
  );
}
