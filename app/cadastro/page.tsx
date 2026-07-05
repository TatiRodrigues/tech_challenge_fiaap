'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { registerUser } from '@/store/thunks';
import { AlecrimLogo } from '@/componentes/AlecrimLogo';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.passwordConfirm) {
        setError('As senhas não correspondem');
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        setIsLoading(false);
        return;
      }

      // Valida email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Por favor, insira um email válido');
        setIsLoading(false);
        return;
      }

      // Dispatch Redux Thunk para registrar na API
      const resultAction = await (dispatch as any)(registerUser({
        username: formData.name,  // API usa 'username'
        email: formData.email,
        password: formData.password,
      }));

      if (registerUser.fulfilled.match(resultAction)) {
        setSuccess('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          router.push('/resumo-transacao');
        }, 1500);
      } else {
        throw new Error(resultAction.payload?.message || 'Erro ao realizar cadastro');
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || 'Erro ao realizar cadastro. Tente novamente.';
      setError(errorMessage);
      console.error('Erro no cadastro:', errorMessage);
      console.error('Detalhes completos:', err);
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
            <div className="app-auth-branding mb-3 text-center">
              <div className="d-flex flex-column align-items-center justify-content-center">
                <AlecrimLogo size={60} />
                <div className="mt-2">
                  <h3 style={{ fontWeight: 'bold', color: '#2D7A3E', margin: 0, fontSize: '1.1rem' }}>
                    Alecrim wallet
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.15rem 0 0 0' }}>
                    Seu gerenciador de transações
                  </p>
                </div>
              </div>
            </div>
            <h2 className="auth-heading text-center mb-3">Criar Conta</h2>

            <div className="auth-form-container text-start">
              <form className="auth-form register-form" onSubmit={handleSubmit}>
                {/* Nome */}
                <div className="name mb-3">
                  <label className="sr-only" htmlFor="signup-name">
                    Nome Completo
                  </label>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    className="form-control signup-name"
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    suppressHydrationWarning
                  />
                </div>

                {/* Email */}
                <div className="email mb-3">
                  <label className="sr-only" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    className="form-control signup-email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                    suppressHydrationWarning
                  />
                </div>

                {/* Password */}
                <div className="password mb-3">
                  <label className="sr-only" htmlFor="signup-password">
                    Senha
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    className="form-control signup-password"
                    placeholder="Senha (mín. 6 caracteres)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                    suppressHydrationWarning
                  />
                </div>

                {/* Confirm Password */}
                <div className="password mb-3">
                  <label className="sr-only" htmlFor="signup-password-confirm">
                    Confirmar Senha
                  </label>
                  <input
                    id="signup-password-confirm"
                    name="passwordConfirm"
                    type="password"
                    className="form-control signup-password-confirm"
                    placeholder="Confirme a Senha"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="off"
                    required
                    suppressHydrationWarning
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
                    disabled={isLoading || !!error}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar Conta'}
                  </button>
                </div>
              </form>

              <div className="auth-option text-center pt-2">
                Já tem conta?{' '}
                <Link className="text-link" href="/login">
                  Faça login aqui
                </Link>
                .
              </div>

              <div className="text-center mt-1">
                <Link href="/esqueceu-senha" className="text-muted small text-decoration-none">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>
          </div>

          <footer className="app-auth-footer">
            <div className="container text-center py-3">
              <small className="copyright">
                © 2026 Alecrim wallet - Seu gerenciador de transações inteligente. Todos os direitos reservados.
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
              <h5 className="mb-3 overlay-title">Crie Sua Conta</h5>
              <div>
                Transforme a forma como você gerencia suas finanças. Cadastre-se agora e tenha total visibilidade de suas transações.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
