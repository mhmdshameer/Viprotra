import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers";
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
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
