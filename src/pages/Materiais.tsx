import { Package, Plus, ShoppingCart, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Materiais = () => {
  const navigate = useNavigate();

  const materiais = [
    {
      id: 1,
      nome: "Cimento CP-III 50kg",
      quantidade: 50,
      valor: 25.90,
      fornecedor: "Construmax",
      status: "Em Estoque",
      obra: "Casa Residencial - João Silva"
    },
    {
      id: 2,
      nome: "Tijolo Cerâmico 6 furos",
      quantidade: 1000,
      valor: 0.45,
      fornecedor: "Cerâmica Sol",
      status: "Pendente",
      obra: "Casa Residencial - João Silva"
    },
    {
      id: 3,
      nome: "Tinta Acrílica Branca 18L",
      quantidade: 5,
      valor: 89.90,
      fornecedor: "Tinta Fácil",
      status: "Comprado",
      obra: "Reforma Comercial - Loja ABC"
    }
  ];

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

  const handleAddMaterial = () => {
    alert("Funcionalidade de adicionar material será implementada em breve!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Materiais</h1>
          <p className="text-gray-600 mt-1">Controle de estoque e compras</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-secondary/90"
          onClick={handleAddMaterial}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Material
        </Button>
      </div>

      <div className="grid gap-6">
        {materiais.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-navy">{material.nome}</CardTitle>
                  <CardDescription>{material.obra}</CardDescription>
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
    </div>
  );
};

export default Materiais;
