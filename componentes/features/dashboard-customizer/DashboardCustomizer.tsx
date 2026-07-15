'use client';

import { useState, useEffect } from 'react';

export interface DashboardWidget {
  id: string;
  type: 'charts' | 'goals' | 'alerts' | 'calendar' | 'budget' | 'insights';
  title: string;
  icon: string;
  enabled: boolean;
}

interface DashboardCustomizerProps {
  onWidgetsChange: (widgets: DashboardWidget[]) => void;
  defaultWidgets?: DashboardWidget[];
}

const AVAILABLE_WIDGETS: DashboardWidget[] = [
  {
    id: 'charts',
    type: 'charts',
    title: 'Gráficos Financeiros',
    icon: 'bi-pie-chart',
    enabled: true,
  },
  {
    id: 'goals',
    type: 'goals',
    title: 'Metas de Economia',
    icon: 'bi-target',
    enabled: false,
  },
  {
    id: 'alerts',
    type: 'alerts',
    title: 'Alertas de Gastos',
    icon: 'bi-bell',
    enabled: false,
  },
  {
    id: 'calendar',
    type: 'calendar',
    title: 'Calendário de Transações',
    icon: 'bi-calendar',
    enabled: false,
  },
  {
    id: 'budget',
    type: 'budget',
    title: 'Orçamento Mensal',
    icon: 'bi-wallet',
    enabled: false,
  },
  {
    id: 'insights',
    type: 'insights',
    title: 'Insights Automáticos',
    icon: 'bi-lightbulb',
    enabled: false,
  },
];

export default function DashboardCustomizer({
  onWidgetsChange,
  defaultWidgets = AVAILABLE_WIDGETS,
}: DashboardCustomizerProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Save to localStorage
  useEffect(() => {
    if (isSaved) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
      onWidgetsChange(widgets);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  }, [isSaved, widgets, onWidgetsChange]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (error) {
        console.warn('Error loading dashboard widgets:', error);
      }
    }
  }, []);

  // Abrir via evento do header (engrenagem)
  useEffect(() => {
    const handler = () => setShowCustomizer(true);
    window.addEventListener('open-dashboard-customizer', handler);
    return () => window.removeEventListener('open-dashboard-customizer', handler);
  }, []);

  const toggleWidget = (widgetId: string) => {
    setWidgets((prev) =>
      prev.map((w) =>
        w.id === widgetId ? { ...w, enabled: !w.enabled } : w
      )
    );
  };

  const resetToDefaults = () => {
    setWidgets(AVAILABLE_WIDGETS);
    setIsSaved(true);
  };

  const handleSave = () => {
    setIsSaved(true);
  };

  const enabledCount = widgets.filter((w) => w.enabled).length;

  return (
    <>
      {/* Customizer Button */}
      <div className="position-fixed" style={{ bottom: '2rem', right: '2rem', zIndex: 999 }}>
        <button
          className="btn btn-primary rounded-circle shadow-lg"
          onClick={() => setShowCustomizer(!showCustomizer)}
          title="Personalizar Dashboard"
          style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
        >
          <i className="bi bi-sliders"></i>
        </button>
      </div>

      {/* Customizer Modal */}
      {showCustomizer && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1000 }}>
          <div
            className="position-absolute bg-white rounded shadow-lg"
            style={{
              right: '2rem',
              top: '2rem',
              width: '350px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div className="border-bottom p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  <i className="bi bi-sliders me-2"></i>
                  Personalizar Dashboard
                </h6>
                <button
                  className="btn-close"
                  onClick={() => setShowCustomizer(false)}
                  aria-label="Fechar"
                ></button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-muted small mb-3">
                Escolha os widgets que deseja ver no seu dashboard
              </p>

              <div className="mb-4">
                {widgets.map((widget) => (
                  <div key={widget.id} className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`widget-${widget.id}`}
                        checked={widget.enabled}
                        onChange={() => toggleWidget(widget.id)}
                      />
                      <label
                        className="form-check-label flex-grow-1"
                        htmlFor={`widget-${widget.id}`}
                      >
                        <i className={`bi ${widget.icon} me-2`}></i>
                        {widget.title}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="alert alert-info alert-sm small mb-3">
                <i className="bi bi-info-circle me-2"></i>
                {enabledCount} widget(s) ativado(s)
              </div>

              {/* Buttons */}
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaved}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {isSaved ? 'Salvo!' : 'Salvar Alterações'}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={resetToDefaults}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Restaurar Padrões
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowCustomizer(false)}
                >
                  <i className="bi bi-x me-2"></i>
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
