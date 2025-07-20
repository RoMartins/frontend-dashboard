import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { salesApi } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, Award, Target } from 'lucide-react';
import { SalesByDay, TopClients } from '../types';

const Dashboard: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesByDay[]>([]);
  const [topClients, setTopClients] = useState<TopClients | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [salesByDay, clientsStats] = await Promise.all([
        salesApi.getSalesByDay(),
        salesApi.getTopClients(),
      ]);

      setSalesData(salesByDay);
      setTopClients(clientsStats);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const totalSales = salesData.reduce((sum, day) => sum + day.total, 0);
  const averageDailySales = totalSales / salesData.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            <p className="text-xs text-muted-foreground">
              Últimos {salesData.length} dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageDailySales)}</div>
            <p className="text-xs text-muted-foreground">Por dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maior Venda</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Math.max(...salesData.map((d) => d.total)))}
            </div>
            <p className="text-xs text-muted-foreground">Melhor dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.length}</div>
            <p className="text-xs text-muted-foreground">Com vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Vendas por Dia */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={formatDate} />
              <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Vendas']}
                labelFormatter={(label: string) => `Data: ${formatDate(label)}`}
              />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Clientes */}
      {topClients && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                Maior Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {topClients.highestVolumeClient.name}
              </div>
              <div className="text-sm text-gray-600">
                {topClients.highestVolumeClient.email}
              </div>
              <div className="mt-2 text-sm text-blue-600 font-medium">
                Cliente com maior volume total de vendas
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Maior Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {topClients.highestAverageClient.name}
              </div>
              <div className="text-sm text-gray-600">
                {topClients.highestAverageClient.email}
              </div>
              <div className="mt-2 text-sm text-green-600 font-medium">
                Cliente com maior valor médio por venda
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-500" />
                Maior Frequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {topClients.highestFrequencyClient.name}
              </div>
              <div className="text-sm text-gray-600">
                {topClients.highestFrequencyClient.email}
              </div>
              <div className="mt-2 text-sm text-purple-600 font-medium">
                Cliente com maior frequência de compras
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
