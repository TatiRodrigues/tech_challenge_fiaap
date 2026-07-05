'use client';

import { useMemo } from 'react';

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

interface ChartData {
  income: number;
  expenses: number;
  transfers: number;
  byDay: Record<string, { income: number; expenses: number }>;
}

// Simple SVG Pie Chart Component
function PieChart({
  income,
  expenses,
  transfers,
}: {
  income: number;
  expenses: number;
  transfers: number;
}) {
  const total = income + expenses + transfers;
  if (total === 0) return <div className="text-center text-muted">Sem dados</div>;

  const incomePercent = (income / total) * 100;
  const expensesPercent = (expenses / total) * 100;
  const transfersPercent = (transfers / total) * 100;

  let incomeEnd = (incomePercent / 100) * 360;
  let expensesEnd = incomeEnd + (expensesPercent / 100) * 360;
  let transfersEnd = expensesEnd + (transfersPercent / 100) * 360;

  const incomeArc = describeArc(150, 150, 100, 0, incomeEnd);
  const expensesArc = describeArc(150, 150, 100, incomeEnd, expensesEnd);
  const transfersArc = describeArc(150, 150, 100, expensesEnd, transfersEnd);

  return (
    <div className="text-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        <path d={incomeArc} fill="#28a745" stroke="white" strokeWidth="2" />
        <path d={expensesArc} fill="#dc3545" stroke="white" strokeWidth="2" />
        <path d={transfersArc} fill="#17a2b8" stroke="white" strokeWidth="2" />

        {/* Center circle for donut effect */}
        <circle cx="150" cy="150" r="60" fill="white" />
        <text
          x="150"
          y="150"
          textAnchor="middle"
          dy="0.3em"
          className="fw-bold"
          fontSize="16"
        >
          {incomePercent.toFixed(0)}%
        </text>
      </svg>

      <div className="d-flex justify-content-center gap-4 mt-3">
        <div>
          <div className="small text-success">
            <i className="bi bi-circle-fill me-2"></i>
            Receitas
          </div>
          <strong>R$ {income.toFixed(2)}</strong>
        </div>
        <div>
          <div className="small text-danger">
            <i className="bi bi-circle-fill me-2"></i>
            Despesas
          </div>
          <strong>R$ {expenses.toFixed(2)}</strong>
        </div>
        <div>
          <div className="small text-info">
            <i className="bi bi-circle-fill me-2"></i>
            Transferências
          </div>
          <strong>R$ {transfers.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
}

// Simple SVG Bar Chart Component
function BarChart({ byDay }: { byDay: Record<string, { income: number; expenses: number }> }) {
  const days = Object.entries(byDay).slice(-7); // Last 7 days
  if (days.length === 0) return <div className="text-center text-muted">Sem dados</div>;

  const maxValue = Math.max(
    ...days.map(([, data]) => Math.max(data.income, data.expenses))
  );

  const scale = maxValue > 0 ? 100 / maxValue : 1;

  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(400, days.length * 60)} height="250" className="w-100">
        {days.map(([day, data], idx) => {
          const x = idx * 60 + 20;
          const incomHeight = data.income * scale;
          const expenseHeight = data.expenses * scale;

          return (
            <g key={day}>
              {/* Income Bar */}
              <rect
                x={x}
                y={150 - incomHeight}
                width="20"
                height={incomHeight}
                fill="#28a745"
              />

              {/* Expense Bar */}
              <rect
                x={x + 25}
                y={150 - expenseHeight}
                width="20"
                height={expenseHeight}
                fill="#dc3545"
              />

              {/* Day label */}
              <text x={x + 10} y="170" textAnchor="middle" fontSize="12" fill="#666">
                {new Date(day).toLocaleDateString('pt-BR', { day: '2-digit' })}
              </text>
            </g>
          );
        })}

        {/* Y-axis */}
        <line x1="15" y1="10" x2="15" y2="150" stroke="#ccc" strokeWidth="1" />

        {/* X-axis */}
        <line x1="15" y1="150" x2={Math.max(400, days.length * 60) - 10} y2="150" stroke="#ccc" strokeWidth="1" />
      </svg>

      <div className="d-flex justify-content-center gap-4 mt-3">
        <div>
          <div className="small text-success">
            <i className="bi bi-square-fill me-2"></i>
            Receitas
          </div>
        </div>
        <div>
          <div className="small text-danger">
            <i className="bi bi-square-fill me-2"></i>
            Despesas
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FinancialCharts({ transactions }: FinancialChartProps) {
  const chartData = useMemo<ChartData>(() => {
    const data: ChartData = {
      income: 0,
      expenses: 0,
      transfers: 0,
      byDay: {},
    };

    transactions.forEach((tx) => {
      const dateKey = new Date(tx.date).toISOString().split('T')[0];

      if (!data.byDay[dateKey]) {
        data.byDay[dateKey] = { income: 0, expenses: 0 };
      }

      if (tx.type === 'deposito') {
        data.income += tx.value;
        data.byDay[dateKey].income += tx.value;
      } else if (tx.type === 'saque') {
        data.expenses += tx.value;
        data.byDay[dateKey].expenses += tx.value;
      } else if (tx.type === 'transferencia') {
        data.transfers += tx.value;
      }
    });

    return data;
  }, [transactions]);

  const total = chartData.income - chartData.expenses - chartData.transfers;

  return (
    <div className="row g-4">
      {/* Summary Cards */}
      <div className="col-12">
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <div className="app-card shadow-sm bg-light">
              <div className="p-3 border-bottom border-success border-2">
                <small className="text-success fw-500">RECEITAS</small>
              </div>
              <div className="p-3 text-center">
                <h5 className="text-success mb-0">
                  R$ {chartData.income.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="app-card shadow-sm bg-light">
              <div className="p-3 border-bottom border-danger border-2">
                <small className="text-danger fw-500">DESPESAS</small>
              </div>
              <div className="p-3 text-center">
                <h5 className="text-danger mb-0">
                  R$ {chartData.expenses.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="app-card shadow-sm bg-light">
              <div className="p-3 border-bottom border-info border-2">
                <small className="text-info fw-500">TRANSFERÊNCIAS</small>
              </div>
              <div className="p-3 text-center">
                <h5 className="text-info mb-0">
                  R$ {chartData.transfers.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-3">
            <div className="app-card shadow-sm bg-light">
              <div className="p-3 border-bottom border-primary border-2">
                <small className="text-primary fw-500">SALDO</small>
              </div>
              <div className="p-3 text-center">
                <h5 className={`mb-0 ${total >= 0 ? 'text-success' : 'text-danger'}`}>
                  R$ {total.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="col-12 col-lg-6">
        <div className="app-card shadow-sm">
          <div className="app-card-header p-4 border-bottom">
            <h6 className="app-card-title mb-0">
              <i className="bi bi-pie-chart me-2"></i>
              Distribuição Financeira
            </h6>
          </div>
          <div className="app-card-body p-4">
            <PieChart
              income={chartData.income}
              expenses={chartData.expenses}
              transfers={chartData.transfers}
            />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="col-12 col-lg-6">
        <div className="app-card shadow-sm">
          <div className="app-card-header p-4 border-bottom">
            <h6 className="app-card-title mb-0">
              <i className="bi bi-bar-chart me-2"></i>
              Últimos 7 Dias
            </h6>
          </div>
          <div className="app-card-body p-4">
            <BarChart byDay={chartData.byDay} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to describe SVG arc
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'L',
    x,
    y,
    'Z',
  ].join(' ');
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
