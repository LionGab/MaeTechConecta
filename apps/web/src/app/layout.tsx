import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossa Maternidade - Web",
  description: "Interface web do app Nossa Maternidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
