import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@/app/portal.css";
import { AuthProvider } from "@/app/provedores/AuthProvider";

export const metadata: Metadata = {
  title: "Gerenciador de Transações",
  description: "Controle financeiro pessoal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Gerenciador de Transações</title>
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