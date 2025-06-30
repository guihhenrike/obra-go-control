
import { Building2, Users, Package, DollarSign, Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentWorks } from "@/components/dashboard/RecentWorks";
import { FinancialChart } from "@/components/dashboard/FinancialChart";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const upcomingTasks = [
  {
    id: 1,
    title: "Entrega de materiais - Obra Silva",
    date: "Hoje, 14:00",
    priority: "high",
    type: "material"
  },
  {
    id: 2,
    title: "Pagamento equipe - Obra ABC",
    date: "Amanhã, 09:00", 
    priority: "high",
    type: "payment"
  },
  {
    id: 3,
    title: "Inspeção elétrica - Cobertura",
    date: "23/01, 10:00",
    priority: "medium",
    type: "inspection"
  },
  {
    id: 4,
    title: "Reunião cliente - Projeto novo",
    date: "25/01, 15:30",
    priority: "low",
    type: "meeting"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "text-red-600 bg-red-50 border-red-200";
    case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "low": return "text-green-600 bg-green-50 border-green-200";
    default: return "text-gray-600 bg-gray-50 border-gray-200";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "material": return <Package className="w-4 h-4" />;
    case "payment": return <DollarSign className="w-4 h-4" />;
    case "inspection": return <CheckCircle className="w-4 h-4" />;
    case "meeting": return <Users className="w-4 h-4" />;
    default: return <Calendar className="w-4 h-4" />;
  }
};

const Dashboard = () => {
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
          value="12"
          subtitle="3 finalizando este mês"
          icon={<Building2 className="w-6 h-6" />}
          trend={{ value: "+2", isPositive: true }}
          color="navy"
        />
        <StatsCard
          title="Funcionários"
          value="45"
          subtitle="38 ativos hoje"
          icon={<Users className="w-6 h-6" />}
          trend={{ value: "+5", isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Receita Mensal"
          value="R$ 58.400"
          subtitle="Janeiro 2024"
          icon={<TrendingUp className="w-6 h-6" />}
          trend={{ value: "+12%", isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Materiais Pendentes"
          value="8"
          subtitle="R$ 15.200 em compras"
          icon={<Package className="w-6 h-6" />}
          trend={{ value: "-3", isPositive: true }}
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Works - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RecentWorks />
        </div>

        {/* Upcoming Tasks */}
        <div className="lg:col-span-1">
          <Card className="p-6 card-shadow-lg border-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy">Próximas Tarefas</h3>
              <Button variant="outline" size="sm" className="text-navy border-navy hover:bg-navy hover:text-white">
                Ver Agenda
              </Button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg ${getPriorityColor(task.priority)}`}>
                      {getTypeIcon(task.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy text-sm leading-tight">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{task.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-white">
              Adicionar Tarefa
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
          <Button className="h-16 bg-navy hover:bg-navy/90 text-white flex-col gap-2">
            <Building2 className="w-5 h-5" />
            Nova Obra
          </Button>
          <Button className="h-16 bg-secondary hover:bg-secondary/90 text-white flex-col gap-2">
            <Users className="w-5 h-5" />
            Add Funcionário
          </Button>
          <Button className="h-16 bg-light-blue hover:bg-light-blue/90 text-white flex-col gap-2">
            <Package className="w-5 h-5" />
            Comprar Material
          </Button>
          <Button className="h-16 bg-green-500 hover:bg-green-600 text-white flex-col gap-2">
            <DollarSign className="w-5 h-5" />
            Novo Orçamento
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
