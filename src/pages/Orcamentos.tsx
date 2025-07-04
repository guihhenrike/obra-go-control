
import { FileText, Plus, Send, Eye, Download, Trash2, Share, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovoOrcamentoForm } from "@/components/forms/NovoOrcamentoForm";
import { EditarOrcamentoForm } from "@/components/forms/EditarOrcamentoForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { OrcamentoFilters } from "@/components/filters/OrcamentoFilters";
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

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [filteredOrcamentos, setFilteredOrcamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrcamento, setEditingOrcamento] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrcamentos();
  }, []);

  useEffect(() => {
    filterOrcamentos();
  }, [orcamentos, startDate, endDate, statusFilter, searchTerm]);

  const filterOrcamentos = () => {
    let filtered = [...orcamentos];

    // Filtro por data
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

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(orcamento => orcamento.status === statusFilter);
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(orcamento => 
        orcamento.numero.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
    setEditingOrcamento(null);
    fetchOrcamentos();
  };

  const handleViewBudget = (orcamento: any) => {
    // Criar uma janela modal ou nova página para visualizar o orçamento
    const content = `
      ORÇAMENTO: ${orcamento.numero}
      Cliente: ${orcamento.cliente}
      Obra: ${orcamento.obra}
      Valor: R$ ${orcamento.valor.toLocaleString('pt-BR')}
      Data: ${new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}
      Validade: ${new Date(orcamento.validade).toLocaleDateString('pt-BR')}
      Status: ${orcamento.status}
    `;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Orçamento ${orcamento.numero}</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Orçamento ${orcamento.numero}</h2>
            <pre>${content}</pre>
          </body>
        </html>
      `);
    }
  };

  const handleDownloadBudget = (orcamento: any) => {
    const content = `
ORÇAMENTO: ${orcamento.numero}
Cliente: ${orcamento.cliente}
Obra: ${orcamento.obra}
Valor: R$ ${orcamento.valor.toLocaleString('pt-BR')}
Data: ${new Date(orcamento.data_criacao).toLocaleDateString('pt-BR')}
Validade: ${new Date(orcamento.validade).toLocaleDateString('pt-BR')}
Status: ${orcamento.status}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orcamento-${orcamento.numero}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Orçamento baixado com sucesso!");
  };

  const handleShareBudget = (orcamento: any) => {
    const text = `Orçamento ${orcamento.numero} - Cliente: ${orcamento.cliente} - Valor: R$ ${orcamento.valor.toLocaleString('pt-BR')}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Orçamento ${orcamento.numero}`,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Informações do orçamento copiadas para a área de transferência!");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from("orcamentos")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Orçamento excluído com sucesso!");
      fetchOrcamentos();
    } catch (error) {
      console.error("Erro ao excluir orçamento:", error);
      toast.error("Erro ao excluir orçamento");
    }
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

  if (editingOrcamento) {
    return (
      <div className="p-6">
        <EditarOrcamentoForm 
          orcamento={editingOrcamento}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingOrcamento(null)}
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

        <OrcamentoFilters
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          onStatusFilterChange={setStatusFilter}
          onSearchTermChange={setSearchTerm}
        />

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
            {orcamentos.length === 0 ? "Nenhum orçamento criado" : "Nenhum orçamento encontrado"}
          </h3>
          <p className="text-gray-500 mb-4">
            {orcamentos.length === 0 ? "Comece criando seu primeiro orçamento" : "Tente ajustar os filtros"}
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
                  <div className="flex gap-1 flex-wrap">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingOrcamento(orcamento)}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewBudget(orcamento)}
                      title="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDownloadBudget(orcamento)}
                      title="Baixar"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleShareBudget(orcamento)}
                      title="Compartilhar"
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir orçamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o orçamento {orcamento.numero}? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteBudget(orcamento.id)}
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

export default Orcamentos;
