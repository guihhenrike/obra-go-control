
import { Building2, Calendar, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recentWorks = [
  {
    id: 1,
    name: "Casa Residencial - Silva",
    client: "Maria Silva",
    progress: 75,
    status: "Em Andamento",
    budget: "R$ 120.000",
    team: 8,
    deadline: "2024-02-15"
  },
  {
    id: 2,
    name: "Reforma Comercial - Loja ABC",
    client: "João Santos",
    progress: 45,
    status: "Em Andamento", 
    budget: "R$ 85.000",
    team: 5,
    deadline: "2024-01-30"
  },
  {
    id: 3,
    name: "Apartamento Cobertura",
    client: "Ana Costa",
    progress: 90,
    status: "Finalizando",
    budget: "R$ 200.000",
    team: 12,
    deadline: "2024-01-20"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em Andamento":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Finalizando":
      return "bg-green-100 text-green-800 border-green-200";
    case "Atrasado":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 50) return "bg-blue-500";
  if (progress >= 25) return "bg-yellow-500";
  return "bg-red-500";
};

export function RecentWorks() {
  return (
    <Card className="p-6 card-shadow-lg border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy">Obras Recentes</h3>
        <Button variant="outline" size="sm" className="text-navy border-navy hover:bg-navy hover:text-white">
          Ver Todas
        </Button>
      </div>

      <div className="space-y-4">
        {recentWorks.map((work) => (
          <div key={work.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-navy mb-1">{work.name}</h4>
                <p className="text-sm text-gray-600">Cliente: {work.client}</p>
              </div>
              <Badge className={getStatusColor(work.status)}>
                {work.status}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progresso</span>
                <span className="font-medium text-navy">{work.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(work.progress)}`}
                  style={{ width: `${work.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{work.budget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{work.team} pessoas</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(work.deadline).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
