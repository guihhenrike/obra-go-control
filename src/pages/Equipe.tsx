
import { Users, Plus, Phone, Mail, Edit, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovoFuncionarioForm } from "@/components/forms/NovoFuncionarioForm";
import { EditarFuncionarioForm } from "@/components/forms/EditarFuncionarioForm";
import { EquipeFilters } from "@/components/filters/EquipeFilters";
import { toast } from "sonner";
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

const Equipe = () => {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [filteredFuncionarios, setFilteredFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<any>(null);
  const [cargoFilter, setCargoFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  useEffect(() => {
    filterFuncionarios();
  }, [funcionarios, cargoFilter, searchTerm]);

  const filterFuncionarios = () => {
    let filtered = [...funcionarios];

    // Filtro por cargo
    if (cargoFilter !== "all") {
      filtered = filtered.filter(funcionario => funcionario.funcao === cargoFilter);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(funcionario => 
        funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFuncionarios(filtered);
  };

  const fetchFuncionarios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("funcionarios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800";
      case "Férias":
        return "bg-yellow-100 text-yellow-800";
      case "Inativo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFuncionario(null);
    fetchFuncionarios();
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("funcionarios")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Funcionário excluído com sucesso!");
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error);
      toast.error("Erro ao excluir funcionário");
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      const { error } = await supabase
        .from("funcionarios")
        .update({ status: "Inativo" })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Funcionário desativado com sucesso!");
      fetchFuncionarios();
    } catch (error) {
      console.error("Erro ao desativar funcionário:", error);
      toast.error("Erro ao desativar funcionário");
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovoFuncionarioForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingFuncionario) {
    return (
      <div className="p-6">
        <EditarFuncionarioForm 
          funcionario={editingFuncionario}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingFuncionario(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Equipe</h1>
            <p className="text-gray-600 mt-1">Gerencie sua equipe de trabalho</p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Funcionário
          </Button>
        </div>

        <EquipeFilters
          cargoFilter={cargoFilter}
          searchTerm={searchTerm}
          onCargoFilterChange={setCargoFilter}
          onSearchTermChange={setSearchTerm}
        />

        <div className="text-sm text-gray-500">
          {filteredFuncionarios.length} de {funcionarios.length} funcionários
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando funcionários...</p>
        </div>
      ) : filteredFuncionarios.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {funcionarios.length === 0 ? "Nenhum funcionário cadastrado" : "Nenhum funcionário encontrado"}
          </h3>
          <p className="text-gray-500 mb-4">
            {funcionarios.length === 0 ? "Comece adicionando membros à sua equipe" : "Tente ajustar os filtros"}
          </p>
          {funcionarios.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Funcionário
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFuncionarios.map((funcionario) => (
            <Card key={funcionario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{funcionario.nome}</CardTitle>
                    <CardDescription>{funcionario.funcao}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(funcionario.status)}>
                    {funcionario.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{funcionario.telefone}</span>
                  </div>
                  {funcionario.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{funcionario.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">
                      {funcionario.tipo_remuneracao === 'salario' ? 'Salário:' : 'Diária:'}
                    </span>
                    <span className="text-lg font-bold text-secondary">
                      R$ {funcionario.valor_remuneracao ? Number(funcionario.valor_remuneracao).toFixed(2) : '0,00'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingFuncionario(funcionario)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    
                    {funcionario.status === "Ativo" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-yellow-600 hover:text-yellow-700">
                            <UserX className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Desativar funcionário</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja desativar {funcionario.nome}? Ele será marcado como inativo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeactivate(funcionario.id)}>
                              Desativar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir funcionário</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir {funcionario.nome}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(funcionario.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

export default Equipe;
