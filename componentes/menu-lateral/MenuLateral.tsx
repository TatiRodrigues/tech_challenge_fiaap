'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/thunks';

export default function MenuLateral() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  const handleLogout = async () => {
    try {
      await (dispatch as any)(logoutUser());
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
    router.push('/login');
  };

  return (
    <div className="sidepanel-inner d-flex flex-column">
      {/* Close Button for Mobile */}
      <button
        id="sidepanel-close"
        className="sidepanel-close d-xl-none"
        aria-label="Fechar menu lateral"
        style={{
          background: 'none',
          border: 'none',
          fontSize: '2rem',
          cursor: 'pointer',
          padding: '0.5rem 1rem',
          textAlign: 'right',
        }}
        onClick={() => {
          const sidepanel = document.getElementById('app-sidepanel');
          if (sidepanel) {
            sidepanel.classList.add('sidepanel-hidden');
            sidepanel.classList.remove('sidepanel-visible');
          }
        }}
      >
        <span aria-hidden="true">×</span>
      </button>

      {/* Logo */}
      <div className="app-branding">
        <a className="app-logo" href="/" aria-label="Alecrim Wallet - página inicial">
          <i className="bi bi-wallet2 me-2" style={{ fontSize: '1.5rem', color: '#667eea' }} aria-hidden="true"></i>
          <span className="logo-text" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#667eea' }}>
            Transações
          </span>
        </a>
      </div>

      {/* Navigation Menu */}
      <nav id="app-nav-main" className="app-nav app-nav-main flex-grow-1" aria-label="Navegação principal">
        <ul className="app-menu list-unstyled accordion" role="list">
          <li className="nav-item" role="listitem">
            <a
              className={`nav-link ${isActive('resumo-transacao') ? 'active' : ''}`}
              href="/resumo-transacao"
              aria-current={isActive('resumo-transacao') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                <i className="bi bi-graph-up"></i>
              </span>
              <span className="nav-link-text">Resumo</span>
            </a>
          </li>

          <li className="nav-item" role="listitem">
            <a
              className={`nav-link ${isActive('listar-transacoes') ? 'active' : ''}`}
              href="/listar-transacoes"
              aria-current={isActive('listar-transacoes') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                <i className="bi bi-list-check"></i>
              </span>
              <span className="nav-link-text">Transações</span>
            </a>
          </li>

          <li className="nav-item" role="listitem">
            <a
              className={`nav-link ${isActive('nova-transacao') ? 'active' : ''}`}
              href="/nova-transacao"
              aria-current={isActive('nova-transacao') ? 'page' : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                <i className="bi bi-plus-circle"></i>
              </span>
              <span className="nav-link-text">Nova Transação</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="app-sidepanel-footer">
        <nav className="app-nav app-nav-footer" aria-label="Ações do usuário">
          <ul className="app-menu footer-menu list-unstyled">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link w-100 text-start"
                onClick={handleLogout}
                style={{ textDecoration: 'none' }}
              >
                <i className="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
