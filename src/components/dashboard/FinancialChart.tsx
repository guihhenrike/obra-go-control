
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function FinancialChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar transações dos últimos 6 meses
      const { data: transacoes } = await supabase
        .from("transacoes")
        .select("*")
        .eq("user_id", user.id)
        .gte("data", new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Processar dados mensais
      const monthsData = {};
      const categoryData = {};
      
      transacoes?.forEach(transacao => {
        const date = new Date(transacao.data);
        const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
        
        if (!monthsData[monthKey]) {
          monthsData[monthKey] = { month: monthKey, receita: 0, gastos: 0, lucro: 0 };
        }

        if (transacao.tipo === 'receita') {
          monthsData[monthKey].receita += transacao.valor;
        } else {
          monthsData[monthKey].gastos += transacao.valor;
          
          // Agrupar por categoria para o gráfico de pizza
          if (!categoryData[transacao.categoria]) {
            categoryData[transacao.categoria] = 0;
          }
          categoryData[transacao.categoria] += transacao.valor;
        }
        
        monthsData[monthKey].lucro = monthsData[monthKey].receita - monthsData[monthKey].gastos;
      });

      // Converter dados mensais para array
      const monthlyArray = Object.values(monthsData);
      setMonthlyData(monthlyArray);

      // Converter categorias para array de gastos
      const totalGastos = Object.values(categoryData).reduce((sum, value) => sum + value, 0);
      const expenseArray = Object.entries(categoryData).map(([name, value], index) => ({
        name,
        value: totalGastos > 0 ? Math.round((value / totalGastos) * 100) : 0,
        color: ['#1F3C88', '#F28C28', '#2D9CDB', '#10B981', '#8B5CF6', '#F59E0B'][index % 6]
      }));
      
      setExpenseData(expenseArray);

    } catch (error) {
      console.error("Erro ao buscar dados financeiros:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 card-shadow-lg border-0">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Card>
        <Card className="p-6 card-shadow-lg border-0">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Receitas vs Gastos */}
      <Card className="p-6 card-shadow-lg border-0">
        <h3 className="text-lg font-semibold text-navy mb-4">Receitas vs Gastos</h3>
        <div className="h-64">
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    `R$ ${value.toLocaleString('pt-BR')}`, 
                    ''
                  ]}
                  labelStyle={{ color: '#1F3C88' }}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="receita" 
                  fill="#2D9CDB" 
                  name="Receita"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="gastos" 
                  fill="#F28C28" 
                  name="Gastos"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Nenhuma transação encontrada. Adicione receitas e despesas para ver os gráficos.</p>
            </div>
          )}
        </div>
      </Card>

      {/* Distribuição de Gastos */}
      <Card className="p-6 card-shadow-lg border-0">
        <h3 className="text-lg font-semibold text-navy mb-4">Distribuição de Gastos</h3>
        <div className="h-64">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, '']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Adicione despesas para ver a distribuição por categoria.</p>
            </div>
            )}
        </div>
        {expenseData.length > 0 && (
          <div className="mt-4 space-y-2">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-navy">{item.value}%</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
