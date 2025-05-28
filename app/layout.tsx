import type { Metadata } from "next";
import "./globals.css";
import { Providers } from './providers';
import Navbar from "../components/navbar";

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
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
