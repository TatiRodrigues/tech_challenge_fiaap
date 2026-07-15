'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import Header from "@/componentes/header/Header";
import MenuLateral from "@/componentes/menu-lateral/MenuLateral";
import Rodape from "@/componentes/rodape/Rodape";

export default function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Executa apenas no cliente após hidratação
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Verificar se há token no localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('bankingApiToken') : null;
    console.log('[LayoutAutenticado] Checking token - found:', !!token);

    if (token) {
      // Carregar user do localStorage se estiver salvo
      const savedUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      if (savedUser && !user) {
        try {
          const userData = JSON.parse(savedUser);
          console.log('[LayoutAutenticado] Loading user from localStorage:', userData);
          dispatch(setUser(userData));
        } catch (e) {
          console.error('[LayoutAutenticado] Error parsing saved user:', e);
        }
      }
      setIsAuthorized(true);
    } else {
      console.log('[LayoutAutenticado] No token found, redirecting to login');
      router.push('/login');
    }
  }, [isHydrated, router, dispatch, user]);

  // Se não foi hidratado ou não autenticado, mostra loading
  if (!isHydrated || !isAuthorized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Validando autenticação...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Skip navigation — visível ao receber foco via teclado */}
      <a href="#main-content" className="skip-to-content">
        Pular para o conteúdo principal
      </a>

      <Header />

      <div
        id="app-sidepanel"
        className="app-sidepanel sidepanel-visible"
        role="navigation"
        aria-label="Menu lateral"
      >
        <div id="sidepanel-drop" className="sidepanel-drop"></div>
        <MenuLateral />
      </div>

      <div className="app-wrapper">
        <div className="app-content pt-3 p-md-3 p-lg-4">
          <div className="container-xl">
            <main id="main-content" tabIndex={-1} aria-label="Conteúdo principal">{children}</main>
          </div>
        </div>

        <footer className="app-footer" role="contentinfo">
          <div className="container text-center py-3">
            <Rodape />
          </div>
        </footer>
      </div>
    </div>
  );
}
