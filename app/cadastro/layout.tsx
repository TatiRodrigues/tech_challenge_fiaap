import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadastro — Alecrim Wallet',
  description: 'Crie sua conta Alecrim Wallet gratuitamente e comece a controlar suas finanças.',
};

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page-wrapper app-signup">
      {children}
    </div>
  );
}

