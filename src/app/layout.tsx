import type { Metadata } from "next";

import "./globals.css";

import { StoreProvider } from "./components/layout/StoreProvider";
import { AuthProvider } from "./components/layout/AuthProvider";
import { EventProvider } from "./components/layout/EventProvider";

import { Toaster } from "sonner";

import { DevModeSwitch } from "./components/layout/DevModeSwitch";

export const metadata: Metadata = {
  title: "Santos Cup",
  description: "Official Santos Cup Tournament App",

  manifest: "/manifest.json",

  themeColor: "#062B55",

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
        <StoreProvider>
          <AuthProvider>
            <EventProvider>
              <Toaster
                position="top-center"
                richColors
              />

              <DevModeSwitch />

              {children}
            </EventProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}