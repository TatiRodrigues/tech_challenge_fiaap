'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!email) {
        setError('Por favor, insira seu email');
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
      setEmail('');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.');
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
            <h2 className="auth-heading text-center mb-3">Recuperar Senha</h2>

            <p className="text-muted text-center mb-4 small">
              Digite seu email para receber um link de recuperação de senha.
            </p>

            <div className="auth-form-container text-start">
              <form className="auth-form forgot-password-form" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="email mb-3">
                  <label className="sr-only" htmlFor="reset-email">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    name="reset-email"
                    type="email"
                    className="form-control reset-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                  />
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show mb-3" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn app-btn-primary w-100 theme-btn mx-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enviando...' : 'Enviar Link'}
                  </button>
                </div>
              </form>

              <div className="auth-option text-center pt-5">
                Lembrou a senha?{' '}
                <Link className="text-link" href="/login">
                  Faça login aqui
                </Link>
                .
              </div>

              <div className="text-center mt-3">
                <Link href="/cadastro" className="text-muted small text-decoration-none">
                  Não tem conta? Cadastre-se
                </Link>
              </div>
            </div>
          </div>

          <footer className="app-auth-footer">
            <div className="container text-center py-3">
              <small className="copyright">
                © 2026 Alecrim Finance - Seu gerenciador de transações inteligente. Todos os direitos reservados.
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
              <h5 className="mb-3 overlay-title">Recuperar Acesso</h5>
              <div>
                Não se preocupe! Enviaremos um email com instruções para você recuperar o acesso à sua conta em poucas etapas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
