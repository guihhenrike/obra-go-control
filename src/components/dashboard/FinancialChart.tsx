
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyData = [
  { month: "Set", receita: 45000, gastos: 32000, lucro: 13000 },
  { month: "Out", receita: 52000, gastos: 38000, lucro: 14000 },
  { month: "Nov", receita: 48000, gastos: 35000, lucro: 13000 },
  { month: "Dez", receita: 61000, gastos: 42000, lucro: 19000 },
  { month: "Jan", receita: 58000, gastos: 41000, lucro: 17000 },
];

const expenseData = [
  { name: "Mão de Obra", value: 45, color: "#1F3C88" },
  { name: "Materiais", value: 35, color: "#F28C28" },
  { name: "Equipamentos", value: 12, color: "#2D9CDB" },
  { name: "Outros", value: 8, color: "#10B981" }
];

export function FinancialChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Receitas vs Gastos */}
      <Card className="p-6 card-shadow-lg border-0">
        <h3 className="text-lg font-semibold text-navy mb-4">Receitas vs Gastos</h3>
        <div className="h-64">
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
        </div>
      </Card>

      {/* Distribuição de Gastos */}
      <Card className="p-6 card-shadow-lg border-0">
        <h3 className="text-lg font-semibold text-navy mb-4">Distribuição de Gastos</h3>
        <div className="h-64">
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
        </div>
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
      </Card>
    </div>
  );
}
