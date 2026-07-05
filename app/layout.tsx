import type { Metadata } from "next";
import "@/app/globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";

export const metadata: Metadata = {
  title: "Alecrim Wallet - Seu gerenciador de transações inteligente",
  description: "Alecrim Wallet - Seu gerenciador de transações inteligente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Alecrim Wallet - o seu gerenciador de transações</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="/responsive-fix.css" />
      </head>

      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}