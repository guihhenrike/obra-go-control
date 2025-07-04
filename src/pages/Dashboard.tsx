
import { Building2, Users, Package, DollarSign, Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentWorks } from "@/components/dashboard/RecentWorks";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    obras: 0,
    funcionarios: 0,
    receita: 0,
    materiaisPendentes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar contadores
      const [obrasRes, funcionariosRes, transacoesRes, materiaisRes] = await Promise.all([
        supabase.from("obras").select("*", { count: 'exact' }).eq("user_id", user.id),
        supabase.from("funcionarios").select("*", { count: 'exact' }).eq("user_id", user.id).eq("status", "Ativo"),
        supabase.from("transacoes").select("valor, tipo").eq("user_id", user.id),
        supabase.from("materiais").select("*", { count: 'exact' }).eq("user_id", user.id).eq("status", "Pendente")
      ]);

      const receitas = transacoesRes.data?.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0) || 0;

      setStats({
        obras: obrasRes.count || 0,
        funcionarios: funcionariosRes.count || 0,
        receita: receitas,
        materiaisPendentes: materiaisRes.count || 0
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = () => {
    navigate('/cronograma');
  };

  const handleAddTask = () => {
    navigate('/cronograma');
  };

  const handleNewWork = () => {
    navigate('/obras');
  };

  const handleAddEmployee = () => {
    navigate('/equipe');
  };

  const handleBuyMaterial = () => {
    navigate('/materiais');
  };

  const handleNewBudget = () => {
    navigate('/orcamentos');
  };

  return (
    <div className="p-6 space-y-6 bg-light-gray min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do seu negócio de construção</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Obras Ativas"
          value={loading ? "..." : stats.obras.toString()}
          subtitle={`${stats.obras} obras cadastradas`}
          icon={<Building2 className="w-6 h-6" />}
          trend={{ value: "+0", isPositive: true }}
          color="navy"
          onClick={() => navigate('/obras')}
        />
        <StatsCard
          title="Funcionários"
          value={loading ? "..." : stats.funcionarios.toString()}
          subtitle={`${stats.funcionarios} ativos`}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: "+0", isPositive: true }}
          color="blue"
          onClick={() => navigate('/equipe')}
        />
        <StatsCard
          title="Receita Total"
          value={loading ? "..." : `R$ ${stats.receita.toLocaleString('pt-BR')}`}
          subtitle="Receitas registradas"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: "+0%", isPositive: true }}
          color="green"
          onClick={() => navigate('/financeiro')}
        />
        <StatsCard
          title="Materiais Pendentes"
          value={loading ? "..." : stats.materiaisPendentes.toString()}
          subtitle={`${stats.materiaisPendentes} para comprar`}
          icon={<Package className="w-6 h-6" />}
          trend={{ value: "+0", isPositive: true }}
          color="orange"
          onClick={() => navigate('/materiais')}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Works - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentWorks />
        </div>

        {/* Quick Tasks */}
        <div className="lg:col-span-1">
          <Card className="p-6 card-shadow-lg border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Próximas Ações</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-navy border-navy hover:bg-navy hover:text-white"
                onClick={handleViewSchedule}
              >
                Ver Agenda
              </Button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border-blue-200">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm leading-tight">Cadastrar nova obra</p>
                    <p className="text-xs text-gray-500 mt-1">Adicione obras ao sistema</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-green-50 text-green-600 border-green-200">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm leading-tight">Adicionar funcionários</p>
                    <p className="text-xs text-gray-500 mt-1">Monte sua equipe</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600 border-yellow-200">
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm leading-tight">Controlar materiais</p>
                    <p className="text-xs text-gray-500 mt-1">Gerencie seu estoque</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-600 border-red-200">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy text-sm leading-tight">Registrar transações</p>
                    <p className="text-xs text-gray-500 mt-1">Controle financeiro</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white"
              onClick={handleAddTask}
            >
              Ver Cronograma
            </Button>
          </Card>
        </div>
      </div>

      {/* Financial Charts */}
      <FinancialChart />

      {/* Quick Actions */}
      <Card className="p-6 card-shadow-lg border-0">
        <h3 className="text-lg font-semibold text-navy mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="h-16 bg-navy hover:bg-navy/90 text-white flex-col gap-2"
            onClick={handleNewWork}
          >
            <Building2 className="w-5 h-5" />
            Nova Obra
          </Button>
          <Button 
            className="h-16 bg-secondary hover:bg-secondary/90 text-white flex-col gap-2"
            onClick={handleAddEmployee}
          >
            <Users className="w-5 h-5" />
            Add Funcionário
          </Button>
          <Button 
            className="h-16 bg-light-blue hover:bg-light-blue/90 text-white flex-col gap-2"
            onClick={handleBuyMaterial}
          >
            <Package className="w-5 h-5" />
            Comprar Material
          </Button>
          <Button 
            className="h-16 bg-green-500 hover:bg-green-600 text-white flex-col gap-2"
            onClick={handleNewBudget}
          >
            <DollarSign className="w-5 h-5" />
            Novo Orçamento
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
