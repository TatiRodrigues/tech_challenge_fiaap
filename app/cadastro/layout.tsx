export const dynamic = 'force-dynamic';

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="login-page-wrapper">
      {children}
    </div>
  );
}
