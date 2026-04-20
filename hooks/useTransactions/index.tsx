import { useState, useEffect } from 'react';

export interface Transaction {
  id: number;
  type: 'deposito' | 'transferencia' | 'saque';
  description: string;
  value: number;
  date: string;
  status: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); 

  useEffect(() => {
    fetch('/transactions.json')
      .then(res => res.json())
      .then(data => {
        const lista = data.transactions || data.transacoes || [];
        setTransactions(lista);
      })
      .catch(err => {
        console.error("Erro ao carregar:", err);
        setTransactions([]);
      });
  }, []);

  const deleteTransactions = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const editTransactions = (id: number) => {
    // Lógica de edição aqui
    console.log("Editar ID:", id);
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,     
    setSearchTerm,   
    transactions: filteredTransactions, 
    editTransactions,
    deleteTransactions,
  };
}