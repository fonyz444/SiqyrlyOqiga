import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./main.css";
import { cn } from "@/lib/utils";

const nunito = Nunito({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "MediTale — Healing Stories for Children",
  description: "AI-powered personalized therapeutic stories that help children understand and cope with medical treatments through magical adventures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        nunito.className
      )}>
        {children}
      </body>
    </html>
  );
}
