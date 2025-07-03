import { Package, Plus, ShoppingCart, AlertTriangle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovoMaterialForm } from "@/components/forms/NovoMaterialForm";
import { EditarMaterialForm } from "@/components/forms/EditarMaterialForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { MaterialFilters } from "@/components/filters/MaterialFilters";
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

const Materiais = () => {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [filteredMateriais, setFilteredMateriais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [obraFilter, setObraFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMateriais();
    fetchObras();
  }, []);

  useEffect(() => {
    filterMateriais();
  }, [materiais, startDate, endDate, statusFilter, obraFilter, searchTerm]);

  const fetchObras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("obras")
        .select("id, nome")
        .eq("user_id", user.id);

      if (error) throw error;
      setObras(data || []);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    }
  };

  const filterMateriais = () => {
    let filtered = [...materiais];

    // Filtro por data
    if (startDate || endDate) {
      filtered = filtered.filter(material => {
        const materialDate = new Date(material.created_at);
        
        if (startDate && endDate) {
          return materialDate >= startDate && materialDate <= endDate;
        }
        
        if (startDate) {
          return materialDate >= startDate;
        }
        
        if (endDate) {
          return materialDate <= endDate;
        }
        
        return true;
      });
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(material => material.status === statusFilter);
    }

    // Filtro por obra
    if (obraFilter !== "all") {
      if (obraFilter === "none") {
        filtered = filtered.filter(material => !material.obra_id);
      } else {
        filtered = filtered.filter(material => material.obra_id === obraFilter);
      }
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(material => 
        material.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMateriais(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const fetchMateriais = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("materiais")
        .select(`
          *,
          obras(nome)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMateriais(data || []);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-green-100 text-green-800";
      case "Comprado":
        return "bg-blue-100 text-blue-800";
      case "Pendente":
        return "bg-yellow-100 text-yellow-800";
      case "Esgotado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return <Package className="w-4 h-4" />;
      case "Comprado":
        return <ShoppingCart className="w-4 h-4" />;
      case "Pendente":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const handleEditMaterial = (material: any) => {
    setEditingMaterial(material);
    setShowEditForm(true);
  };

  const handleDeleteClick = (material: any) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const deleteMaterial = async (materialId: string) => {
    try {
      const { error } = await supabase
        .from("materiais")
        .delete()
        .eq("id", materialId);

      if (error) throw error;
      
      setMateriais(prev => prev.filter(material => material.id !== materialId));
      console.log("Material excluído com sucesso!");
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir material:", error);
      alert("Erro ao excluir material");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setShowEditForm(false);
    setEditingMaterial(null);
    fetchMateriais();
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovoMaterialForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (showEditForm && editingMaterial) {
    return (
      <div className="p-6">
        <EditarMaterialForm 
          material={editingMaterial}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowEditForm(false);
            setEditingMaterial(null);
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
            <h1 className="text-3xl font-bold text-navy">Materiais</h1>
            <p className="text-gray-600 mt-1">Controle de estoque e compras</p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Material
          </Button>
        </div>

        <MaterialFilters
          statusFilter={statusFilter}
          obraFilter={obraFilter}
          searchTerm={searchTerm}
          obras={obras}
          onStatusFilterChange={setStatusFilter}
          onObraFilterChange={setObraFilter}
          onSearchTermChange={setSearchTerm}
        />

        <div className="flex items-center gap-4">
          <DateRangeFilter 
            onDateRangeChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
          />
          <div className="text-sm text-gray-500">
            {filteredMateriais.length} de {materiais.length} materiais
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando materiais...</p>
        </div>
      ) : filteredMateriais.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {materiais.length === 0 ? "Nenhum material cadastrado" : "Nenhum material encontrado"}
          </h3>
          <p className="text-gray-500 mb-4">
            {materiais.length === 0 ? "Comece adicionando materiais ao seu estoque" : "Tente ajustar os filtros"}
          </p>
          {materiais.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Material
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredMateriais.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{material.nome}</CardTitle>
                    <CardDescription>
                      {material.obras ? material.obras.nome : "Material geral"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(material.status)} flex items-center gap-1`}>
                      {getStatusIcon(material.status)}
                      {material.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                      title="Editar material"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(material)}
                      className="text-red-600 hover:text-red-700"
                      title="Excluir material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Quantidade</span>
                    <p className="font-semibold">{material.quantidade.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Valor Unitário</span>
                    <p className="font-semibold">R$ {material.valor.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Valor Total</span>
                    <p className="font-semibold text-secondary">
                      R$ {(material.quantidade * material.valor).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Fornecedor</span>
                    <p className="font-semibold">{material.fornecedor}</p>
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
              Tem certeza que deseja excluir o material "{materialToDelete?.nome}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => materialToDelete && deleteMaterial(materialToDelete.id)}
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

export default Materiais;
