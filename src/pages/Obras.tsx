
import { Building2, Plus, Calendar, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaObraForm } from "@/components/forms/NovaObraForm";

const Obras = () => {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setObras(data || []);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    } finally {
      setLoading(false);
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchObras();
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

  return (
    <div className="p-6 space-y-6">
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

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando obras...</p>
        </div>
      ) : obras.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma obra cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece criando sua primeira obra</p>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeira Obra
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {obras.map((obra) => (
            <Card key={obra.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-navy">{obra.nome}</CardTitle>
                    <CardDescription>{obra.endereco}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(obra.status)}>
                    {obra.status}
                  </Badge>
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
    </div>
  );
};

export default Obras;
