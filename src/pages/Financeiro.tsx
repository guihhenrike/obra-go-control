
import { DollarSign, TrendingUp, TrendingDown, Calculator, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaTransacaoForm } from "@/components/forms/NovaTransacaoForm";

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [resumo, setResumo] = useState({
    totalReceitas: 0,
    totalDespesas: 0,
    lucroLiquido: 0,
    margem: 0
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTransacoes();
  }, []);

  const fetchTransacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("transacoes")
        .select(`
          *,
          obras(nome)
        `)
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) throw error;
      
      setTransacoes(data || []);
      
      // Calcular resumo financeiro
      const receitas = data?.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0) || 0;
      const despesas = data?.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0) || 0;
      const lucro = receitas - despesas;
      const margem = receitas > 0 ? (lucro / receitas) * 100 : 0;

      setResumo({
        totalReceitas: receitas,
        totalDespesas: despesas,
        lucroLiquido: lucro,
        margem: margem
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchTransacoes();
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovaTransacaoForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Financeiro</h1>
          <p className="text-gray-600 mt-1">Controle financeiro das suas obras</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-secondary/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {resumo.totalReceitas.toLocaleString('pt-BR')}
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
              R$ {resumo.totalDespesas.toLocaleString('pt-BR')}
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
            <div className={`text-2xl font-bold ${resumo.lucroLiquido >= 0 ? 'text-secondary' : 'text-red-600'}`}>
              R$ {resumo.lucroLiquido.toLocaleString('pt-BR')}
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
            <div className={`text-2xl font-bold ${resumo.margem >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {resumo.margem.toFixed(1)}%
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando transações...</p>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma transação registrada</h3>
              <p className="text-gray-500 mb-4">Comece adicionando suas receitas e despesas</p>
              <Button 
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => setShowForm(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeira Transação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {transacoes.slice(0, 10).map((transacao) => (
                <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transacao.descricao}</p>
                    <p className="text-sm text-gray-500">
                      {transacao.categoria} • {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      {transacao.obras && ` • ${transacao.obras.nome}`}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'}R$ {transacao.valor.toLocaleString('pt-BR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;
