import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/app/portal.css";
import { AuthProvider } from "@/app/provedores/AuthProvider";

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
        <script defer src="http://localhost:3000/assets/plugins/fontawesome/js/all.min.js"></script>
        <link id="theme-style" rel="stylesheet" href="http://localhost:3000/assets/css/portal.css" />
      </head>

      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}