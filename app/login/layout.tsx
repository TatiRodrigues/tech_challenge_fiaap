import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Alecrim Wallet',
  description: 'Acesse sua conta Alecrim Wallet para gerenciar suas transações financeiras.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page-wrapper app-login">
      {children}
    </div>
  );
}

