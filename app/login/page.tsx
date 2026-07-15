'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/thunks';
import { AlecrimLogo } from '@/componentes/AlecrimLogo';
import { healthCheckService } from '@/app/servicos/health-check';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Limpar os campos ao montar o componente
    setEmail('');
    setPassword('');
    setError('');

    // Verificar conectividade com a API ao montar
    const checkConnectivity = async () => {
      console.log('[LoginPage] Verificando conectividade com a API...');
      const health = await healthCheckService.checkApiHealth();
      if (!health.isOnline) {
        console.warn('[LoginPage] API não está acessível:', health.error);
        setError(`⚠️ Servidor indisponível: ${health.error || 'Não foi possível conectar ao servidor'}`);
      }
    };

    checkConnectivity();
  }, []);

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

      // Valida email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Por favor, insira um email válido');
        setIsLoading(false);
        return;
      }

      // Dispatch Redux Thunk para login na API
      console.log('[LoginPage] Dispatching loginUser thunk with email:', email);
      const resultAction = await (dispatch as any)(loginUser({ email, password }));
      
      if (loginUser.fulfilled.match(resultAction)) {
        console.log('[LoginPage] Login successful, redirecting to /resumo-transacao');
        router.push('/resumo-transacao');
      } else {
        // payload é string quando vem de rejectWithValue(string)
        const errorMsg = typeof resultAction.payload === 'string'
          ? resultAction.payload
          : (resultAction.payload as any)?.message || 'Erro ao fazer login';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      console.warn('[LoginPage] Falha no login:', err?.message || err);
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
                    Alecrim Wallet
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: '#595959', margin: '0.15rem 0 0 0' }}>
                    Seu gerenciador de transações
                  </p>
                </div>
              </div>
            </div>
            <h2 className="auth-heading text-center mb-3">Login</h2>

            <div className="auth-form-container text-start">
              <form
                className="auth-form login-form"
                method="post"
                onSubmit={handleSubmit}
                aria-label="Formulário de login"
                noValidate
              >
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-500" htmlFor="signin-email">
                    Email
                  </label>
                  <input
                    id="signin-email"
                    type="email"
                    className="form-control"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                    aria-required="true"
                    suppressHydrationWarning
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-500" htmlFor="signin-password">
                    Senha
                  </label>
                  <input
                    id="signin-password"
                    type="password"
                    className="form-control"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    suppressHydrationWarning
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
                <div aria-live="assertive" aria-atomic="true">
                  {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <i className="bi bi-exclamation-circle me-2" aria-hidden="true"></i>
                      {error}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className={`btn w-100 theme-btn mx-auto ${isLoading ? 'app-btn-secondary' : 'app-btn-primary'}`}
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Entrando...
                      </>
                    ) : 'Entrar'}
                  </button>
                </div>
              </form>

              <div className="auth-option text-center pt-5">
                Não tem uma conta? Cadastre-se aqui{' '}
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
                © 2026 Alecrim Wallet - Seu gerenciador de transações inteligente. Todos os direitos reservados.
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
              <h5 className="mb-3 overlay-title">Alecrim Wallet</h5>
              <div>
                Seu companheiro financeiro inteligente. Controle, monitore e compreenda cada transação do seu dia a dia.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
