import { FileText, Plus, Send, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovoOrcamentoForm } from "@/components/forms/NovoOrcamentoForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [filteredOrcamentos, setFilteredOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  useEffect(() => {
    filterOrcamentos();
  }, [orcamentos, startDate, endDate]);

  const filterOrcamentos = () => {
    let filtered = [...orcamentos];

    if (startDate || endDate) {
      filtered = filtered.filter(orcamento => {
        const orcamentoDate = new Date(orcamento.data_criacao);
        
        if (startDate && endDate) {
          return orcamentoDate >= startDate && orcamentoDate <= endDate;
        }
        
        if (startDate) {
          return orcamentoDate >= startDate;
        }
        
        if (endDate) {
          return orcamentoDate <= endDate;
        }
        
        return true;
      });
    }

    setFilteredOrcamentos(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const fetchOrcamentos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrcamentos(data || []);
    } catch (error) {
      console.error("Erro ao buscar orçamentos:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchOrcamentos();
  };

  const handleViewBudget = (id: string) => {
    alert(`Visualizar orçamento ${id} - funcionalidade será implementada em breve!`);
  };

  const handleDownloadBudget = (id: string) => {
    alert(`Download orçamento ${id} - funcionalidade será implementada em breve!`);
  };

  const handleSendBudget = (id: string) => {
    alert(`Enviar orçamento ${id} - funcionalidade será implementada em breve!`);
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovoOrcamentoForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Orçamentos</h1>
            <p className="text-gray-600 mt-1">Crie e gerencie seus orçamentos</p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <DateRangeFilter 
            onDateRangeChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
          />
          <div className="text-sm text-gray-500">
            {filteredOrcamentos.length} de {orcamentos.length} orçamentos
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando orçamentos...</p>
        </div>
      ) : filteredOrcamentos.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {orcamentos.length === 0 ? "Nenhum orçamento criado" : "Nenhum orçamento encontrado no período"}
          </h3>
          <p className="text-gray-500 mb-4">
            {orcamentos.length === 0 ? "Comece criando seu primeiro orçamento" : "Tente ajustar o filtro de data"}
          </p>
          {orcamentos.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Orçamento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredOrcamentos.map((orcamento) => (
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
                    <p className="font-semibold">
                      {new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Validade</span>
                    <p className="font-semibold">
                      {new Date(orcamento.validade).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewBudget(orcamento.id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadBudget(orcamento.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSendBudget(orcamento.id)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
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

export default Orcamentos;
