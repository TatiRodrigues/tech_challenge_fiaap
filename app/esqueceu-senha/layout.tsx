export const dynamic = 'force-dynamic';

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
