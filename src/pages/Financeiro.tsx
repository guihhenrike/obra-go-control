
import { DollarSign, Plus, TrendingUp, TrendingDown, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NovaTransacaoForm } from "@/components/forms/NovaTransacaoForm";
import { EditarTransacaoForm } from "@/components/forms/EditarTransacaoForm";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { FinanceiroFilters } from "@/components/filters/FinanceiroFilters";
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

const Financeiro = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [filteredTransacoes, setFilteredTransacoes] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tipoFilter, setTipoFilter] = useState("all");
  const [obraFilter, setObraFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransacoes();
    fetchObras();
  }, []);

  useEffect(() => {
    filterTransacoes();
  }, [transacoes, startDate, endDate, tipoFilter, obraFilter, searchTerm]);

  const fetchObras = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("obras")
        .select("id, nome")
        .eq("user_id", user.id)
        .order("nome");

      if (error) throw error;
      setObras(data || []);
    } catch (error) {
      console.error("Erro ao buscar obras:", error);
    }
  };

  const fetchTransacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("transacoes")
        .select(`
          *,
          obras(nome)
        `)
        .eq("user_id", user.id)
        .order("data", { ascending: false });

      if (error) throw error;
      setTransacoes(data || []);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransacoes = () => {
    let filtered = [...transacoes];

    // Filtro por data
    if (startDate || endDate) {
      filtered = filtered.filter(transacao => {
        const transacaoDate = new Date(transacao.data);
        
        if (startDate && endDate) {
          return transacaoDate >= startDate && transacaoDate <= endDate;
        }
        
        if (startDate) {
          return transacaoDate >= startDate;
        }
        
        if (endDate) {
          return transacaoDate <= endDate;
        }
        
        return true;
      });
    }

    // Filtro por tipo
    if (tipoFilter !== "all") {
      filtered = filtered.filter(transacao => transacao.tipo === tipoFilter);
    }

    // Filtro por obra
    if (obraFilter !== "all") {
      if (obraFilter === "none") {
        filtered = filtered.filter(transacao => !transacao.obra_id);
      } else {
        filtered = filtered.filter(transacao => transacao.obra_id === obraFilter);
      }
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(transacao => 
        (transacao.obras?.nome || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransacoes(filtered);
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getTipoColor = (tipo: string) => {
    return tipo === "receita" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "receita" 
      ? <TrendingUp className="w-4 h-4" />
      : <TrendingDown className="w-4 h-4" />;
  };

  const calcularTotais = () => {
    const receitas = filteredTransacoes
      .filter(t => t.tipo === 'receita')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    const despesas = filteredTransacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((sum, t) => sum + Number(t.valor), 0);
    
    return { receitas, despesas, saldo: receitas - despesas };
  };

  const totais = calcularTotais();

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransacao(null);
    fetchTransacoes();
  };

  const handleDeleteTransacao = async (id: string) => {
    try {
      const { error } = await supabase
        .from("transacoes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Transação excluída com sucesso!");
      fetchTransacoes();
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação");
    }
  };

  if (showForm) {
    return (
      <div className="p-6">
        <NovaTransacaoForm 
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (editingTransacao) {
    return (
      <div className="p-6">
        <EditarTransacaoForm 
          transacao={editingTransacao}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingTransacao(null)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">Financeiro</h1>
            <p className="text-gray-600 mt-1">Controle suas receitas e despesas</p>
          </div>
          <Button 
            className="bg-secondary hover:bg-secondary/90"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <FinanceiroFilters
          tipoFilter={tipoFilter}
          obraFilter={obraFilter}
          searchTerm={searchTerm}
          obras={obras}
          onTipoFilterChange={setTipoFilter}
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
            {filteredTransacoes.length} de {transacoes.length} transações
          </div>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {totais.receitas.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totais.despesas.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totais.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {totais.saldo.toLocaleString('pt-BR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando transações...</p>
        </div>
      ) : filteredTransacoes.length === 0 ? (
        <div className="text-center py-8">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {transacoes.length === 0 ? "Nenhuma transação registrada" : "Nenhuma transação encontrada"}
          </h3>
          <p className="text-gray-500 mb-4">
            {transacoes.length === 0 ? "Comece registrando suas receitas e despesas" : "Tente ajustar os filtros"}
          </p>
          {transacoes.length === 0 && (
            <Button 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Primeira Transação
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTransacoes.map((transacao) => (
            <Card key={transacao.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={`${getTipoColor(transacao.tipo)} flex items-center gap-1`}>
                        {getTipoIcon(transacao.tipo)}
                        {transacao.tipo.charAt(0).toUpperCase() + transacao.tipo.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {transacao.categoria}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTransacao(transacao)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
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
                              <AlertDialogTitle>Excluir transação</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteTransacao(transacao.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <h3 className="font-semibold text-navy mb-1">{transacao.descricao}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {transacao.obras && (
                        <span>Obra: {transacao.obras.nome}</span>
                      )}
                    </div>
                  </div>
                  <div className={`text-xl font-bold ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'}R$ {Number(transacao.valor).toLocaleString('pt-BR')}
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

export default Financeiro;
