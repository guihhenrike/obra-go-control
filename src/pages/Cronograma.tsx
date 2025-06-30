
import { Calendar, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaEtapaForm } from "@/components/forms/NovaEtapaForm";

const Cronograma = () => {
  const [etapas, setEtapas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchEtapas();
  }, []);

  const fetchEtapas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("etapas")
        .select(`
          *,
          obras(nome)
        `)
        .eq("user_id", user.id)
        .order("data_inicio", { ascending: true });

      if (error) throw error;
      setEtapas(data || []);
    } catch (error) {
      console.error("Erro ao buscar etapas:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchEtapas();
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovaEtapaForm 
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
          <h1 className="text-3xl font-bold text-navy">Cronograma</h1>
          <p className="text-gray-600 mt-1">Planejamento e acompanhamento das etapas</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-secondary/90"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Etapa
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando etapas...</p>
        </div>
      ) : etapas.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma etapa cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece criando etapas para suas obras</p>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Etapa
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {etapas.map((etapa) => (
            <Card key={etapa.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{etapa.nome}</CardTitle>
                    <CardDescription>
                      {etapa.obras ? etapa.obras.nome : "Obra não especificada"}
                    </CardDescription>
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
                    <p className="font-semibold">
                      {new Date(etapa.data_inicio).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Previsão Fim</span>
                    <p className="font-semibold">
                      {new Date(etapa.data_fim).toLocaleDateString('pt-BR')}
                    </p>
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
      )}
    </div>
  );
};

export default Cronograma;
