import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Toaster } from "sonner";
import { AuthProvider } from "./components/auth/AuthProvider";

export const viewport: Viewport = {
  themeColor: "#062B55",
};

export const metadata: Metadata = {
  title: "Santos Cup",
  description: "Official Santos Cup Tournament App",

  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Santos Cup",
  },

  icons: {
    apple: "/icons/icon-192.png",
    icon: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <AuthProvider>
          <Toaster position="top-center" richColors />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}