'use client';

import { useMemo, useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposito' | 'transferencia' | 'saque';
  value: number;
  date: string;
  description: string;
}

interface FinancialChartProps {
  transactions: Transaction[];
}

type PeriodFilter = 'month' | '3months' | '6months' | 'all';

// ── SVG Donut Chart ──────────────────────────────────────────────────────────
function DonutChart({ income, expenses, transfers }: { income: number; expenses: number; transfers: number }) {
  const total = income + expenses + transfers;
  if (total === 0) return <div className="text-center text-muted py-4">Sem dados para o período</div>;

  const incomeP = (income / total) * 360;
  const expensesP = (expenses / total) * 360;

  const incomeArc  = describeArc(110, 110, 85, 0, incomeP);
  const expensesArc = describeArc(110, 110, 85, incomeP, incomeP + expensesP);
  const transfersArc = describeArc(110, 110, 85, incomeP + expensesP, 360);

  const formatPct = (v: number) => total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '0%';

  return (
    <div className="d-flex flex-column align-items-center">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15"/>
          </filter>
        </defs>
        {income > 0 && <path d={incomeArc} fill="#22c55e" stroke="white" strokeWidth="3" filter="url(#shadow)" />}
        {expenses > 0 && <path d={expensesArc} fill="#ef4444" stroke="white" strokeWidth="3" filter="url(#shadow)" />}
        {transfers > 0 && <path d={transfersArc} fill="#3b82f6" stroke="white" strokeWidth="3" filter="url(#shadow)" />}
        <circle cx="110" cy="110" r="55" fill="white" />
        <text x="110" y="104" textAnchor="middle" fontSize="13" fill="#6b7280" fontWeight="500">Saldo</text>
        <text x="110" y="124" textAnchor="middle" fontSize="15" fill={income - expenses - transfers >= 0 ? '#22c55e' : '#ef4444'} fontWeight="700">
          {formatPct(income)}
        </text>
      </svg>
      <div className="d-flex gap-4 mt-1">
        {[
          { color: '#22c55e', label: 'Receitas', value: income },
          { color: '#ef4444', label: 'Despesas', value: expenses },
          { color: '#3b82f6', label: 'Transfer.', value: transfers },
        ].map(({ color, label, value }) => (
          <div key={label} className="text-center">
            <div className="small d-flex align-items-center gap-1 mb-1">
              <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }}></span>
              <span className="text-muted">{label}</span>
            </div>
            <strong style={{ fontSize: '0.8rem' }}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SVG Monthly Trend Bar Chart ───────────────────────────────────────────────
function MonthlyTrendChart({ monthlyData }: { monthlyData: { month: string; income: number; expenses: number }[] }) {
  if (monthlyData.length === 0) return <div className="text-center text-muted py-4">Sem dados</div>;

  const maxValue = Math.max(...monthlyData.flatMap(m => [m.income, m.expenses]), 1);
  const chartH = 140;
  const barW = 18;
  const gap = 10;
  const groupW = barW * 2 + gap + 16;
  const totalW = Math.max(300, monthlyData.length * groupW + 40);
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="overflow-x-auto">
      <svg width={totalW} height={chartH + 50} className="w-100">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(p => (
          <line key={p} x1="30" y1={chartH - p * chartH} x2={totalW - 10} y2={chartH - p * chartH}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 2" />
        ))}
        {/* Y axis label */}
        <text x="28" y={chartH} textAnchor="end" fontSize="9" fill="#9ca3af">0</text>
        <text x="28" y={chartH - chartH * 0.5} textAnchor="end" fontSize="9" fill="#9ca3af">
          {fmt(maxValue * 0.5)}
        </text>

        {monthlyData.map((m, i) => {
          const x = 35 + i * groupW;
          const incomeH = (m.income / maxValue) * chartH;
          const expensesH = (m.expenses / maxValue) * chartH;
          return (
            <g key={m.month}>
              {/* Income bar */}
              <rect x={x} y={chartH - incomeH} width={barW} height={incomeH} fill="#22c55e" rx="3" opacity="0.85">
                <title>Receitas: {fmt(m.income)}</title>
              </rect>
              {/* Expenses bar */}
              <rect x={x + barW + gap} y={chartH - expensesH} width={barW} height={expensesH} fill="#ef4444" rx="3" opacity="0.85">
                <title>Despesas: {fmt(m.expenses)}</title>
              </rect>
              {/* Month label */}
              <text x={x + barW + gap / 2} y={chartH + 14} textAnchor="middle" fontSize="10" fill="#6b7280">
                {m.month}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line x1="30" y1={chartH} x2={totalW - 10} y2={chartH} stroke="#d1d5db" strokeWidth="1" />
      </svg>
      <div className="d-flex justify-content-center gap-4 mt-2">
        {[
          { color: '#22c55e', label: 'Receitas' },
          { color: '#ef4444', label: 'Despesas' },
        ].map(({ color, label }) => (
          <span key={label} className="small d-flex align-items-center gap-1">
            <span style={{ width: 12, height: 12, borderRadius: 2, background: color, display: 'inline-block' }}></span>
            <span className="text-muted">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── SVG Daily Bar Chart (last N days) ────────────────────────────────────────
function DailyBarChart({ byDay }: { byDay: Record<string, { income: number; expenses: number }> }) {
  const days = Object.entries(byDay).slice(-14);
  if (days.length === 0) return <div className="text-center text-muted py-4">Sem dados</div>;

  const maxValue = Math.max(...days.map(([, d]) => Math.max(d.income, d.expenses)), 1);
  const chartH = 120;
  const barW = 14;
  const gap = 6;
  const groupW = barW * 2 + gap + 10;
  const totalW = Math.max(300, days.length * groupW + 30);
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="overflow-x-auto">
      <svg width={totalW} height={chartH + 40} className="w-100">
        {[0.5, 1].map(p => (
          <line key={p} x1="20" y1={chartH - p * chartH} x2={totalW - 10} y2={chartH - p * chartH}
            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 2" />
        ))}
        {days.map(([day, data], i) => {
          const x = 22 + i * groupW;
          const incomeH = (data.income / maxValue) * chartH;
          const expensesH = (data.expenses / maxValue) * chartH;
          return (
            <g key={day}>
              <rect x={x} y={chartH - incomeH} width={barW} height={incomeH} fill="#22c55e" rx="2" opacity="0.85">
                <title>{new Date(day).toLocaleDateString('pt-BR')} — Receitas: {fmt(data.income)}</title>
              </rect>
              <rect x={x + barW + gap} y={chartH - expensesH} width={barW} height={expensesH} fill="#ef4444" rx="2" opacity="0.85">
                <title>{new Date(day).toLocaleDateString('pt-BR')} — Despesas: {fmt(data.expenses)}</title>
              </rect>
              <text x={x + barW + gap / 2} y={chartH + 13} textAnchor="middle" fontSize="9" fill="#9ca3af">
                {new Date(day + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              </text>
            </g>
          );
        })}
        <line x1="20" y1={chartH} x2={totalW - 10} y2={chartH} stroke="#d1d5db" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FinancialCharts({ transactions }: FinancialChartProps) {
  const [period, setPeriod] = useState<PeriodFilter>('month');

  const now = new Date();

  const periodLabel: Record<PeriodFilter, string> = {
    month: 'Este mês',
    '3months': 'Últimos 3 meses',
    '6months': 'Últimos 6 meses',
    all: 'Tudo',
  };

  const filteredTransactions = useMemo(() => {
    if (period === 'all') return transactions;
    const cutoff = new Date();
    if (period === 'month') {
      cutoff.setDate(1);
      cutoff.setHours(0, 0, 0, 0);
    } else if (period === '3months') {
      cutoff.setMonth(cutoff.getMonth() - 3);
    } else {
      cutoff.setMonth(cutoff.getMonth() - 6);
    }
    return transactions.filter(t => new Date(t.date) >= cutoff);
  }, [transactions, period]);

  const chartData = useMemo(() => {
    const data = { income: 0, expenses: 0, transfers: 0, byDay: {} as Record<string, { income: number; expenses: number }> };
    filteredTransactions.forEach(tx => {
      const dateKey = new Date(tx.date).toISOString().split('T')[0];
      if (!data.byDay[dateKey]) data.byDay[dateKey] = { income: 0, expenses: 0 };
      if (tx.type === 'deposito') {
        data.income += tx.value;
        data.byDay[dateKey].income += tx.value;
      } else if (tx.type === 'saque') {
        data.expenses += tx.value;
        data.byDay[dateKey].expenses += tx.value;
      } else {
        data.transfers += tx.value;
      }
    });
    return data;
  }, [filteredTransactions]);

  // Monthly aggregation for trend chart
  const monthlyData = useMemo(() => {
    const monthMap: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0 };
      if (tx.type === 'deposito') monthMap[key].income += tx.value;
      else if (tx.type === 'saque') monthMap[key].expenses += tx.value;
    });
    const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, v]) => ({
        month: MONTHS_PT[parseInt(key.split('-')[1]) - 1],
        income: v.income,
        expenses: v.expenses,
      }));
  }, [transactions]);

  const balance = chartData.income - chartData.expenses - chartData.transfers;
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="row g-4">
      {/* Period Selector */}
      <div className="col-12">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="text-muted small fw-500 me-2">
            <i className="bi bi-calendar3 me-1"></i>Período:
          </span>
          {(Object.keys(periodLabel) as PeriodFilter[]).map(p => (
            <button
              key={p}
              type="button"
              className={`btn btn-sm ${period === p ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPeriod(p)}
            >
              {periodLabel[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="col-12">
        <div className="row g-3">
          {[
            { label: 'RECEITAS', value: chartData.income, color: 'success', icon: 'bi-arrow-down-circle' },
            { label: 'DESPESAS', value: chartData.expenses, color: 'danger', icon: 'bi-arrow-up-circle' },
            { label: 'TRANSFERÊNCIAS', value: chartData.transfers, color: 'info', icon: 'bi-arrow-left-right' },
            { label: 'SALDO', value: balance, color: balance >= 0 ? 'success' : 'danger', icon: 'bi-wallet2' },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className="col-6 col-md-3">
              <div className="app-card shadow-sm h-100">
                <div className={`app-card-header p-3 border-bottom border-${color} border-2`}>
                  <small className={`text-${color} fw-500 d-flex align-items-center gap-1`}>
                    <i className={`bi ${icon}`}></i> {label}
                  </small>
                </div>
                <div className="app-card-body p-3 text-center">
                  <h5 className={`text-${color} mb-0`}>{fmt(value)}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart */}
      <div className="col-12 col-lg-5">
        <div className="app-card shadow-sm h-100">
          <div className="app-card-header p-4 border-bottom">
            <h6 className="app-card-title mb-0">
              <i className="bi bi-pie-chart me-2"></i>
              Distribuição — {periodLabel[period]}
            </h6>
          </div>
          <div className="app-card-body p-4 d-flex justify-content-center align-items-center">
            <DonutChart
              income={chartData.income}
              expenses={chartData.expenses}
              transfers={chartData.transfers}
            />
          </div>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="col-12 col-lg-7">
        <div className="app-card shadow-sm h-100">
          <div className="app-card-header p-4 border-bottom">
            <h6 className="app-card-title mb-0">
              <i className="bi bi-bar-chart me-2"></i>
              Movimentação Diária — {periodLabel[period]}
            </h6>
          </div>
          <div className="app-card-body p-4">
            <DailyBarChart byDay={chartData.byDay} />
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      {monthlyData.length > 1 && (
        <div className="col-12">
          <div className="app-card shadow-sm">
            <div className="app-card-header p-4 border-bottom">
              <h6 className="app-card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Tendência Mensal — Últimos {monthlyData.length} meses
              </h6>
            </div>
            <div className="app-card-body p-4">
              <MonthlyTrendChart monthlyData={monthlyData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SVG arc helpers ───────────────────────────────────────────────────────────
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
  if (endAngle - startAngle >= 359.99) endAngle = startAngle + 359.99;
  const start = polar(cx, cy, r, endAngle);
  const end   = polar(cx, cy, r, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
