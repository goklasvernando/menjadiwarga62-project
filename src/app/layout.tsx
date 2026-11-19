import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Menjadi warga +62",
  description: "Simulasi kehidupan warga Indonesia dari lahir sampai tua.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
