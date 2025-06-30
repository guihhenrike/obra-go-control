
import { FileText, Plus, Send, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Orcamentos = () => {
  const orcamentos = [
    {
      id: 1,
      numero: "ORC-001",
      cliente: "João Silva",
      obra: "Casa Residencial",
      valor: 150000,
      data: "10/03/2024",
      validade: "10/04/2024",
      status: "Aceito"
    },
    {
      id: 2,
      numero: "ORC-002",
      cliente: "Maria Santos",
      obra: "Reforma Comercial",
      valor: 80000,
      data: "12/03/2024",
      validade: "12/04/2024",
      status: "Enviado"
    },
    {
      id: 3,
      numero: "ORC-003",
      cliente: "Pedro Oliveira",
      obra: "Ampliação Residencial",
      valor: 95000,
      data: "14/03/2024",
      validade: "14/04/2024",
      status: "Rascunho"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aceito":
        return "bg-green-100 text-green-800";
      case "Enviado":
        return "bg-blue-100 text-blue-800";
      case "Rascunho":
        return "bg-gray-100 text-gray-800";
      case "Recusado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Orçamentos</h1>
          <p className="text-gray-600 mt-1">Crie e gerencie seus orçamentos</p>
        </div>
        <Button className="bg-secondary hover:bg-secondary/90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid gap-6">
        {orcamentos.map((orcamento) => (
          <Card key={orcamento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-navy">{orcamento.numero}</CardTitle>
                  <CardDescription>{orcamento.cliente} • {orcamento.obra}</CardDescription>
                </div>
                <Badge className={getStatusColor(orcamento.status)}>
                  {orcamento.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Valor</span>
                  <p className="font-bold text-lg text-secondary">
                    R$ {orcamento.valor.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Data</span>
                  <p className="font-semibold">{orcamento.data}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Validade</span>
                  <p className="font-semibold">{orcamento.validade}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orcamentos;
