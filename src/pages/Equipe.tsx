import { Users, Plus, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Equipe = () => {
  const navigate = useNavigate();

  const funcionarios = [
    {
      id: 1,
      nome: "Carlos Silva",
      funcao: "Pedreiro",
      telefone: "(11) 99999-9999",
      email: "carlos@email.com",
      diaria: 120,
      status: "Ativo"
    },
    {
      id: 2,
      nome: "João Santos",
      funcao: "Eletricista",
      telefone: "(11) 88888-8888",
      email: "joao@email.com",
      diaria: 150,
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Ana Costa",
      funcao: "Pintora",
      telefone: "(11) 77777-7777",
      email: "ana@email.com",
      diaria: 100,
      status: "Férias"
    }
  ];

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

  const handleAddEmployee = () => {
    // For now, just show an alert - you can implement a modal or form later
    alert("Funcionalidade de adicionar funcionário será implementada em breve!");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy">Equipe</h1>
          <p className="text-gray-600 mt-1">Gerencie sua equipe de trabalho</p>
        </div>
        <Button 
          className="bg-secondary hover:bg-secondary/90"
          onClick={handleAddEmployee}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {funcionarios.map((funcionario) => (
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
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{funcionario.email}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Diária:</span>
                  <span className="text-lg font-bold text-secondary">
                    R$ {funcionario.diaria}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Equipe;
