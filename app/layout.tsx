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
        <link rel="stylesheet" href="/bootstrap-icons.css" />
        <link rel="stylesheet" href="/responsive-fix.css" />
      </head>

      <body>
        <a href="#main-content" className="skip-to-content">
          Pular para o conteúdo principal
        </a>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}