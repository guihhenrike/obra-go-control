
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Cronograma = () => {
  const etapas = [
    {
      id: 1,
      nome: "Fundação",
      obra: "Casa Residencial - João Silva",
      inicio: "15/01/2024",
      fim: "30/01/2024",
      status: "Concluída",
      progresso: 100,
      responsavel: "Carlos Silva"
    },
    {
      id: 2,
      nome: "Estrutura",
      obra: "Casa Residencial - João Silva",
      inicio: "01/02/2024",
      fim: "28/02/2024",
      status: "Em Andamento",
      progresso: 75,
      responsavel: "João Santos"
    },
    {
      id: 3,
      nome: "Instalações Elétricas",
      obra: "Casa Residencial - João Silva",
      inicio: "01/03/2024",
      fim: "15/03/2024",
      status: "Pendente",
      progresso: 0,
      responsavel: "João Santos"
    },
    {
      id: 4,
      nome: "Acabamento",
      obra: "Reforma Comercial - Loja ABC",
      inicio: "10/03/2024",
      fim: "25/03/2024",
      status: "Em Andamento",
      progresso: 60,
      responsavel: "Ana Costa"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800";
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Atrasada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluída":
        return <CheckCircle className="w-4 h-4" />;
      case "Em Andamento":
        return <Clock className="w-4 h-4" />;
      case "Atrasada":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy">Cronograma</h1>
        <p className="text-gray-600 mt-1">Planejamento e acompanhamento das etapas</p>
      </div>

      <div className="grid gap-6">
        {etapas.map((etapa) => (
          <Card key={etapa.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-navy">{etapa.nome}</CardTitle>
                  <CardDescription>{etapa.obra}</CardDescription>
                </div>
                <Badge className={`${getStatusColor(etapa.status)} flex items-center gap-1`}>
                  {getStatusIcon(etapa.status)}
                  {etapa.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Data Início</span>
                  <p className="font-semibold">{etapa.inicio}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Previsão Fim</span>
                  <p className="font-semibold">{etapa.fim}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Responsável</span>
                  <p className="font-semibold">{etapa.responsavel}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{etapa.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-secondary h-3 rounded-full transition-all"
                    style={{ width: `${etapa.progresso}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Cronograma;
