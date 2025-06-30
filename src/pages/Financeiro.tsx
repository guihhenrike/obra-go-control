
import { DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Financeiro = () => {
  const resumoFinanceiro = {
    totalReceitas: 230000,
    totalDespesas: 185000,
    lucroLiquido: 45000,
    margem: 19.6
  };

  const transacoes = [
    {
      id: 1,
      descricao: "Pagamento - Casa João Silva",
      valor: 50000,
      tipo: "receita",
      data: "15/03/2024",
      categoria: "Recebimento de Cliente"
    },
    {
      id: 2,
      descricao: "Compra de Cimento",
      valor: -1295,
      tipo: "despesa",
      data: "14/03/2024",
      categoria: "Materiais"
    },
    {
      id: 3,
      descricao: "Pagamento Funcionários",
      valor: -3600,
      tipo: "despesa",
      data: "13/03/2024",
      categoria: "Mão de Obra"
    },
    {
      id: 4,
      descricao: "Pagamento - Reforma Loja ABC",
      valor: 25000,
      tipo: "receita",
      data: "12/03/2024",
      categoria: "Recebimento de Cliente"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Financeiro</h1>
        <p className="text-gray-600 mt-1">Controle financeiro das suas obras</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumoFinanceiro.totalReceitas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Recebimentos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {resumoFinanceiro.totalDespesas.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Gastos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">
              R$ {resumoFinanceiro.lucroLiquido.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Para este período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margem</CardTitle>
            <Calculator className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {resumoFinanceiro.margem}%
            </div>
            <p className="text-xs text-muted-foreground">
              Margem de lucro
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transacoes.map((transacao) => (
              <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{transacao.descricao}</p>
                  <p className="text-sm text-gray-500">{transacao.categoria} • {transacao.data}</p>
                </div>
                <div className={`font-bold text-lg ${
                  transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transacao.tipo === 'receita' ? '+' : ''}R$ {Math.abs(transacao.valor).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;
