'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/provedores/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      await login(email, password);
      router.push('/resumo-transacao');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row g-0 app-auth-wrapper">
      {/* Left Column - Form */}
      <div className="col-12 col-md-7 col-lg-6 auth-main-col text-center p-5">
        <div className="d-flex flex-column align-content-end">
          <div className="app-auth-body mx-auto">
            <div className="app-auth-branding mb-4">
              <a className="app-logo" href="/">
                <i className="bi bi-wallet2 me-2" style={{ fontSize: '2rem', color: '#667eea' }}></i>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                  Transações
                </span>
              </a>
            </div>
            <h2 className="auth-heading text-center mb-5">Login</h2>

            <div className="auth-form-container text-start">
              <form className="auth-form login-form" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="email mb-3">
                  <label className="sr-only" htmlFor="signin-email">
                    Email
                  </label>
                  <input
                    id="signin-email"
                    name="signin-email"
                    type="email"
                    className="form-control signin-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                  />
                </div>

                {/* Password */}
                <div className="password mb-3">
                  <label className="sr-only" htmlFor="signin-password">
                    Senha
                  </label>
                  <input
                    id="signin-password"
                    name="signin-password"
                    type="password"
                    className="form-control signin-password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                  <div className="extra mt-3 row justify-content-between">
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="RememberPassword"
                        />
                        <label className="form-check-label" htmlFor="RememberPassword">
                          Lembrar
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="forgot-password text-end">
                        <Link href="/esqueceu-senha">Esqueceu a senha?</Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn app-btn-primary w-100 theme-btn mx-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </button>
                </div>
              </form>

              <div className="auth-option text-center pt-5">
                Não tem conta? Cadastre-se{' '}
                <Link className="text-link" href="/cadastro">
                  aqui
                </Link>
                .
              </div>
            </div>
          </div>

          <footer className="app-auth-footer">
            <div className="container text-center py-3">
              <small className="copyright">
                © 2026 Gerenciador de Transações. Todos os direitos reservados.
              </small>
            </div>
          </footer>
        </div>
      </div>

      {/* Right Column - Background */}
      <div className="col-12 col-md-5 col-lg-6 h-100 auth-background-col">
        <div className="auth-background-holder"></div>
        <div className="auth-background-mask"></div>
        <div className="auth-background-overlay p-3 p-lg-5">
          <div className="d-flex flex-column align-content-end h-100">
            <div className="h-100"></div>
            <div className="overlay-content p-3 p-lg-4 rounded">
              <h5 className="mb-3 overlay-title">Controle Financeiro Pessoal</h5>
              <div>
                Gerencie suas transações, acompanhe seus gastos e ganhos, e tenha uma visão clara da sua situação financeira.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
