import { Building2, Plus, Calendar, DollarSign, Users, MoreVertical, Check, Clock, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaObraForm } from "@/components/forms/NovaObraForm";
import { EditarObraForm } from "@/components/forms/EditarObraForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
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
} from "@/components/ui/alert-dialog";

const Obras = () => {
  const [obras, setObras] = useState<any[]>([]);
  const [filteredObras, setFilteredObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingObra, setEditingObra] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [obraToDelete, setObraToDelete] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchObras();
  }, []);

  useEffect(() => {
    filterObras();
  }, [obras, startDate, endDate]);

  const filterObras = () => {
    let filtered = [...obras];

    if (startDate || endDate) {
      filtered = filtered.filter(obra => {
        const obraDate = new Date(obra.data_inicio);
        
        if (startDate && endDate) {
          return obraDate >= startDate && obraDate <= endDate;
        }
        
        if (startDate) {
          return obraDate >= startDate;
        }
        
        if (endDate) {
          return obraDate <= endDate;
        }
        
        return true;
      });
    }

    setFilteredObras(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const fetchObras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setObras(data || []);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateObraStatus = async (obraId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("obras")
        .update({ 
          status: newStatus,
          progresso: newStatus === "Concluída" ? 100 : undefined
        })
        .eq("id", obraId);

      if (error) throw error;
      
      // Atualizar a lista local
      setObras(prev => prev.map(obra => 
        obra.id === obraId 
          ? { ...obra, status: newStatus, progresso: newStatus === "Concluída" ? 100 : obra.progresso }
          : obra
      ));

      console.log(`Obra ${newStatus.toLowerCase()} com sucesso!`);
    } catch (error) {
      console.error("Erro ao atualizar status da obra:", error);
      alert("Erro ao atualizar status da obra");
    }
  };

  const deleteObra = async (obraId: string) => {
    try {
      const { error } = await supabase
        .from("obras")
        .delete()
        .eq("id", obraId);

      if (error) throw error;
      
      // Remover da lista local
      setObras(prev => prev.filter(obra => obra.id !== obraId));
      
      console.log("Obra excluída com sucesso!");
      setDeleteDialogOpen(false);
      setObraToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir obra:", error);
      alert("Erro ao excluir obra");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800";
      case "Concluída":
        return "bg-green-100 text-green-800";
      case "Atrasada":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setShowEditForm(false);
    setEditingObra(null);
    fetchObras();
  };

  const handleEditObra = (obra: any) => {
    setEditingObra(obra);
    setShowEditForm(true);
  };

  const handleDeleteClick = (obra: any) => {
    setObraToDelete(obra);
    setDeleteDialogOpen(true);
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovaObraForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (showEditForm && editingObra) {
    return (
      <div className="p-6">
        <EditarObraForm 
          obra={editingObra}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowEditForm(false);
            setEditingObra(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Obras</h1>
            <p className="text-gray-600 mt-1">Gerencie todas as suas obras ativas</p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Obra
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <DateRangeFilter 
            onDateRangeChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
          />
          <div className="text-sm text-gray-500">
            {filteredObras.length} de {obras.length} obras
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando obras...</p>
        </div>
      ) : filteredObras.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {obras.length === 0 ? "Nenhuma obra cadastrada" : "Nenhuma obra encontrada no período"}
          </h3>
          <p className="text-gray-500 mb-4">
            {obras.length === 0 ? "Comece criando sua primeira obra" : "Tente ajustar o filtro de data"}
          </p>
          {obras.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Obra
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredObras.map((obra) => (
            <Card key={obra.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{obra.nome}</CardTitle>
                    <CardDescription>{obra.endereco}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(obra.status)}>
                      {obra.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditObra(obra)}
                      title="Editar obra"
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
                        {obra.status !== "Concluída" && (
                          <DropdownMenuItem onClick={() => updateObraStatus(obra.id, "Concluída")}>
                            <Check className="mr-2 h-4 w-4" />
                            Concluir Obra
                          </DropdownMenuItem>
                        )}
                        {obra.status !== "Pendente" && (
                          <DropdownMenuItem onClick={() => updateObraStatus(obra.id, "Pendente")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Marcar como Pendente
                          </DropdownMenuItem>
                        )}
                        {obra.status !== "Em Andamento" && (
                          <DropdownMenuItem onClick={() => updateObraStatus(obra.id, "Em Andamento")}>
                            <Building2 className="mr-2 h-4 w-4" />
                            Retomar Obra
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(obra)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir Obra
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{obra.cliente}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {new Date(obra.data_inicio).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      R$ {obra.orcamento.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{obra.progresso}% concluído</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{obra.progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all"
                      style={{ width: `${obra.progresso}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a obra "{obraToDelete?.nome}"? 
              Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => obraToDelete && deleteObra(obraToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Obras;
