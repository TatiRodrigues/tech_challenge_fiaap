'use client';

import { useState, useEffect, useMemo } from 'react';
import CardsResumo from '../cards-resumo/page';
import FinancialCharts from '../financial-charts/FinancialCharts';
import DashboardCustomizer, { DashboardWidget } from '../dashboard-customizer/DashboardCustomizer';

interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
}

interface User {
  name?: string;
  email?: string;
}

interface ResumoTransacaoProps {
  user: User | null;
}

export default function ResumoTransacao({ user }: ResumoTransacaoProps) {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedMonth, setSelectedMonth] = useState<string>(
		new Date().toISOString().slice(0, 7) // YYYY-MM
	);
	const [, setEnabledWidgets] = useState<DashboardWidget[]>([]);

	useEffect(() => {
		try {
			const savedTransactions = localStorage.getItem('transactions');
			if (savedTransactions) {
				setTransactions(JSON.parse(savedTransactions));
			} else {
				// Carregar do arquivo JSON public/transactions.json
				fetch('/transactions.json')
					.then(res => res.json())
					.then(data => {
						const transactions = data.transactions || [];
						setTransactions(transactions);
						localStorage.setItem('transactions', JSON.stringify(transactions));
					})
					.catch(err => {
						console.error('Erro ao carregar transações do arquivo:', err);
						setTransactions([]);
					});
			}
		} catch (error) {
			console.error('Erro ao carregar transações:', error);
			setTransactions([]);
		}
		setIsLoading(false);
	}, []);

	const { monthlyData, monthlyTransactions } = useMemo(() => {
		const filtered = transactions.filter(t => {
			const transDate = new Date(t.date).toISOString().slice(0, 7);
			return transDate === selectedMonth;
		});

		const stats = {
			deposits: 0,
			transfers: 0,
			withdrawals: 0,
		};

		filtered.forEach(t => {
			if (t.status === 'Concluído') {
				if (t.type === 'deposito') stats.deposits += t.value;
				else if (t.type === 'transferencia') stats.transfers += t.value;
				else if (t.type === 'saque') stats.withdrawals += t.value;
			}
		});

		// Garantir que são sempre números
		stats.deposits = isNaN(stats.deposits) ? 0 : stats.deposits;
		stats.transfers = isNaN(stats.transfers) ? 0 : stats.transfers;
		stats.withdrawals = isNaN(stats.withdrawals) ? 0 : stats.withdrawals;

		return {
			monthlyData: stats,
			monthlyTransactions: filtered.sort((a, b) => 
				new Date(b.date).getTime() - new Date(a.date).getTime()
			),
		};
	}, [transactions, selectedMonth]);

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL',
		}).format(value);
	};

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const formatTime = (dateStr: string) => {
		const date = new Date(dateStr);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const ampm = hours >= 12 ? 'PM' : 'AM';
		const displayHours = hours % 12 || 12;
		const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
		return `${displayHours}:${displayMinutes} ${ampm}`;
	};

	const getTypeBadge = (type: string) => {
		const types = {
			deposito: { color: 'success', label: 'Depósito', icon: 'bi-arrow-down-circle' },
			transferencia: { color: 'info', label: 'Transferência', icon: 'bi-arrow-left-right' },
			saque: { color: 'warning', label: 'Saque', icon: 'bi-arrow-up-circle' },
		};
		return types[type as keyof typeof types] || types.transferencia;
	};

	const getMonthName = (dateStr: string) => {
		const months = [
			'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
			'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
		];
		try {
			const [year, month] = dateStr.split('-');
			const monthIndex = parseInt(month) - 1;
			if (monthIndex >= 0 && monthIndex < 12) {
				return `${months[monthIndex]} de ${year}`;
			}
			return dateStr;
		} catch (error) {
			return dateStr;
		}
	};

	if (isLoading) {
		return (
			<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Carregando...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container-xl">
			{/* Título */}
			<p className="app-page-title text-muted mb-4">Bem-vindo(a), <span className="text-success">{(user?.name || 'Usuário').charAt(0).toUpperCase() + (user?.name || 'Usuário').slice(1)}</span>!<br/>Aqui está o resumo de suas transações</p>

			{/* Cards de Resumo */}
			<CardsResumo transactions={transactions} />

			{/* Gráficos Financeiros */}
			<div className="mb-4">
				<FinancialCharts transactions={transactions.map(t => ({
					id: t.id.toString(),
					type: t.type as 'deposito' | 'transferencia' | 'saque',
					value: t.value,
					date: t.date,
					description: t.description,
				}))} />
			</div>

			<div className="row g-4 mb-4">
				{/* Resumo Mensal */}
				<div className="col-12 col-lg-4">
					<div className="app-card shadow-sm h-100">
						<div className="app-card-header p-4 border-bottom">
							<h5 className="app-card-title mb-0">
								<i className="bi bi-calendar-month me-2"></i>
							Resumo Mensal
							</h5>
						</div>
						<div className="app-card-body p-4">
							<div className="mb-4">
								<label htmlFor="monthSelector" className="form-label fw-500">
									Selecione o mês:
								</label>
								<input
									id="monthSelector"
									type="month"
									className="form-control form-control-lg"
									value={selectedMonth}
									onChange={(e) => setSelectedMonth(e.target.value)}
								/>
							</div>

							<div className="mb-3">
								<small className="text-muted d-block mb-2">Mês selecionado:</small>
								<p className="text-capitalize mb-4">{getMonthName(selectedMonth)}</p>
							</div>

							<hr />

							{/* Estatísticas do mês */}
							<div className="mb-3">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<span className="text-muted">
										<i className="bi bi-arrow-down-circle text-success me-2"></i>
										Depósitos:
									</span>
									<strong className="text-success">{formatCurrency(monthlyData.deposits)}</strong>
								</div>
								<div className="d-flex justify-content-between align-items-center mb-2">
									<span className="text-muted">
										<i className="bi bi-arrow-left-right text-info me-2"></i>
										Transferências:
									</span>
									<strong className="text-info">-{formatCurrency(monthlyData.transfers)}</strong>
								</div>
								<div className="d-flex justify-content-between align-items-center">
									<span className="text-muted">
										<i className="bi bi-arrow-up-circle text-warning me-2"></i>
										Saques:
									</span>
									<strong className="text-warning">-{formatCurrency(monthlyData.withdrawals)}</strong>
								</div>

								<hr className="my-3" />

								<div className="d-flex justify-content-between align-items-center">
									<span className="fw-500">Total do mês:</span>
									<span className={`h5 mb-0 ${(monthlyData.deposits - monthlyData.transfers - monthlyData.withdrawals) >= 0 ? 'text-success' : 'text-danger'}`}>
										{formatCurrency(monthlyData.deposits - monthlyData.transfers - monthlyData.withdrawals)}
									</span>
								</div>
							</div>

							<div className="mt-4">
								<small className="text-muted">
									<i className="bi bi-info-circle me-1"></i>
									Transações neste mês: <strong>{monthlyTransactions.length}</strong>
								</small>
							</div>
						</div>
					</div>
				</div>

				{/* Timeline de Transações */}
				<div className="col-12 col-lg-8">
					<div className="app-card shadow-sm">
						<div className="app-card-header p-4 border-bottom">
							<h5 className="app-card-title mb-0">
								<i className="bi bi-clock-history me-2"></i>
								Timeline de Transações - {getMonthName(selectedMonth)}
							</h5>
						</div>
						<div className="app-card-body p-4">
							{monthlyTransactions.length === 0 ? (
								<div className="text-center py-5">
									<i className="bi bi-inbox text-muted" style={{ fontSize: '2rem' }}></i>
									<p className="text-muted mt-3">
										Nenhuma transação neste mês.
									</p>
								</div>
							) : (
								<div className="timeline">
									{monthlyTransactions.map((transaction, index) => {
										const badge = getTypeBadge(transaction.type);
										return (
											<div key={transaction.id} className="timeline-item mb-4">
												<div className="d-flex gap-3">
													{/* Timeline ponto */}
													<div className="timeline-marker" style={{ minWidth: '40px', textAlign: 'center' }}>
														<div
															className={`rounded-circle d-flex align-items-center justify-content-center bg-${badge.color} text-white`}
															style={{ width: '40px', height: '40px' }}
														>
															<i className={`bi ${badge.icon}`}></i>
														</div>
														{index < monthlyTransactions.length - 1 && (
															<div
																style={{
																	height: '30px',
																	borderLeft: '2px solid #e9ecef',
																	margin: '5px auto 0',
																}}
															/>
														)}
													</div>

													{/* Conteúdo */}
													<div className="flex-grow-1">
														<div className="d-flex justify-content-between align-items-start">
															<div>
																<h6 className="mb-1">
																	<span className={`badge bg-${badge.color}`}>
																		{badge.label}
																	</span>
																</h6>
																<p className="mb-1 fw-500">{transaction.description}</p>
																<small className="text-muted">
																	{formatDate(transaction.date)} às {formatTime(transaction.date)}
																</small>
															</div>
															<div className="text-right">
																<p className={`h6 mb-0 ${(transaction.type === 'saque' || transaction.type === 'transferencia') ? 'text-danger' : 'text-success'}`}>
																	{(transaction.type === 'saque' || transaction.type === 'transferencia') ? '-' : '+'}
																	{' '}
																	{formatCurrency(transaction.value)}
																</p>
																<small className={`badge ${transaction.status === 'Concluído' ? 'bg-success' : 'bg-warning'}`}>
																	{transaction.status}
																</small>
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Dashboard Customizer */}
			<DashboardCustomizer onWidgetsChange={setEnabledWidgets} />
		</div>
	);
};