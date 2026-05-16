import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KharchaOne — Plain-language Money Dashboard",
  description: "Understand UPI, cards, wallets, cashback, and subscriptions in plain English.",
  icons: {
    icon: "/icon-192.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
