
import { Building2, Calendar, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em Andamento":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Concluída":
      return "bg-green-100 text-green-800 border-green-200";
    case "Atrasada":
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
  const navigate = useNavigate();
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObras();
  }, []);

  const fetchObras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("obras")  
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setObras(data || []);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/obras');
  };

  return (
    <Card className="p-6 card-shadow-lg border-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-navy">Obras Recentes</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-navy border-navy hover:bg-navy hover:text-white"
          onClick={handleViewAll}
        >
          Ver Todas
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando obras...</p>
        </div>
      ) : obras.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma obra cadastrada</h4>
          <p className="text-gray-500 mb-4">Comece criando sua primeira obra</p>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={handleViewAll}
          >
            Criar Obra
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {obras.map((obra) => (
            <div key={obra.id} className="p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-navy mb-1">{obra.nome}</h4>
                  <p className="text-sm text-gray-600">Cliente: {obra.cliente}</p>
                </div>
                <Badge className={getStatusColor(obra.status)}>
                  {obra.status}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-medium text-navy">{obra.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(obra.progresso)}`}
                    style={{ width: `${obra.progresso}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>R$ {obra.orcamento.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(obra.previsao_fim).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
