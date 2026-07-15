import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar Senha — Alecrim Wallet',
  description: 'Recupere o acesso à sua conta Alecrim Wallet.',
};

export default function EsqueceuSenhaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page-wrapper app-reset-password">
      {children}
    </div>
  );
}

