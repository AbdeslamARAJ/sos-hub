import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SOS Hub - Food Traceability",
  description: "Supply chain traceability and food safety management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
