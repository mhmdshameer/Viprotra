import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viprotra",
  description: "Video progress tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
