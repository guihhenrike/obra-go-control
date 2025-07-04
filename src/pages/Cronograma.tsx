
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaEtapaForm } from "@/components/forms/NovaEtapaForm";
import { EditarEtapaForm } from "@/components/forms/EditarEtapaForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Cronograma = () => {
  const [etapas, setEtapas] = useState<any[]>([]);
  const [filteredEtapas, setFilteredEtapas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEtapa, setEditingEtapa] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchEtapas();
  }, []);

  useEffect(() => {
    filterEtapas();
  }, [etapas, startDate, endDate]);

  const filterEtapas = () => {
    let filtered = [...etapas];

    if (startDate || endDate) {
      filtered = filtered.filter(etapa => {
        const etapaDate = new Date(etapa.data_inicio);
        
        if (startDate && endDate) {
          return etapaDate >= startDate && etapaDate <= endDate;
        }
        
        if (startDate) {
          return etapaDate >= startDate;
        }
        
        if (endDate) {
          return etapaDate <= endDate;
        }
        
        return true;
      });
    }

    setFilteredEtapas(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

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

  const updateEtapaStatus = async (etapaId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("etapas")
        .update({ 
          status: newStatus,
          progresso: newStatus === "Concluída" ? 100 : undefined
        })
        .eq("id", etapaId);

      if (error) throw error;
      
      setEtapas(prev => prev.map(etapa => 
        etapa.id === etapaId 
          ? { ...etapa, status: newStatus, progresso: newStatus === "Concluída" ? 100 : etapa.progresso }
          : etapa
      ));

      toast.success(`Etapa ${newStatus.toLowerCase()} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status da etapa:", error);
      toast.error("Erro ao atualizar status da etapa");
    }
  };

  const handleDeleteEtapa = async (id: string) => {
    try {
      const { error } = await supabase
        .from("etapas")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Etapa excluída com sucesso!");
      fetchEtapas();
    } catch (error) {
      console.error("Erro ao excluir etapa:", error);
      toast.error("Erro ao excluir etapa");
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
    setEditingEtapa(null);
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

  if (editingEtapa) {
    return (
      <div className="p-6">
        <EditarEtapaForm 
          etapa={editingEtapa}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingEtapa(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
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

        <div className="flex items-center gap-4">
          <DateRangeFilter 
            onDateRangeChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
          />
          <div className="text-sm text-gray-500">
            {filteredEtapas.length} de {etapas.length} etapas
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando etapas...</p>
        </div>
      ) : filteredEtapas.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {etapas.length === 0 ? "Nenhuma etapa cadastrada" : "Nenhuma etapa encontrada no período"}
          </h3>
          <p className="text-gray-500 mb-4">
            {etapas.length === 0 ? "Comece criando etapas para suas obras" : "Tente ajustar o filtro de data"}
          </p>
          {etapas.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Etapa
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEtapas.map((etapa) => (
            <Card key={etapa.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{etapa.nome}</CardTitle>
                    <CardDescription>
                      {etapa.obras ? etapa.obras.nome : "Obra não especificada"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(etapa.status)} flex items-center gap-1`}>
                      {getStatusIcon(etapa.status)}
                      {etapa.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingEtapa(etapa)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {etapa.status !== "Concluída" && (
                          <DropdownMenuItem onClick={() => updateEtapaStatus(etapa.id, "Concluída")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Concluir Etapa
                          </DropdownMenuItem>
                        )}
                        {etapa.status !== "Pendente" && (
                          <DropdownMenuItem onClick={() => updateEtapaStatus(etapa.id, "Pendente")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Marcar como Pendente
                          </DropdownMenuItem>
                        )}
                        {etapa.status !== "Em Andamento" && (
                          <DropdownMenuItem onClick={() => updateEtapaStatus(etapa.id, "Em Andamento")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Retomar Etapa
                          </DropdownMenuItem>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir Etapa
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir etapa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a etapa "{etapa.nome}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteEtapa(etapa.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
