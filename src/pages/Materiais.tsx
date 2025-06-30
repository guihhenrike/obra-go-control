
import { Package, Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovoMaterialForm } from "@/components/forms/NovoMaterialForm";

const Materiais = () => {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMateriais();
  }, []);

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

  const handleFormSuccess = () => {
    setShowForm(false);
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

  return (
    <div className="p-6 space-y-6">
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

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando materiais...</p>
        </div>
      ) : materiais.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum material cadastrado</h3>
          <p className="text-gray-500 mb-4">Comece adicionando materiais ao seu estoque</p>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Primeiro Material
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {materiais.map((material) => (
            <Card key={material.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{material.nome}</CardTitle>
                    <CardDescription>
                      {material.obras ? material.obras.nome : "Material geral"}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(material.status)} flex items-center gap-1`}>
                    {getStatusIcon(material.status)}
                    {material.status}
                  </Badge>
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
    </div>
  );
};

export default Materiais;
