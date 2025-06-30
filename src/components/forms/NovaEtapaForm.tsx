
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovaEtapaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovaEtapaForm({ onSuccess, onCancel }: NovaEtapaFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    obra_id: "",
    data_inicio: "",
    data_fim: "",
    responsavel: "",
    status: "Pendente"
  });
  const [obras, setObras] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObras();
    fetchFuncionarios();
  }, []);

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

  const fetchFuncionarios = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("funcionarios")
        .select("id, nome")
        .eq("user_id", user.id)
        .eq("status", "Ativo");

      if (error) throw error;
      setFuncionarios(data || []);
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("etapas")
        .insert({
          user_id: user.id,
          nome: formData.nome,
          obra_id: formData.obra_id,
          data_inicio: formData.data_inicio,
          data_fim: formData.data_fim,
          responsavel: formData.responsavel,
          status: formData.status,
          progresso: 0
        });

      if (error) throw error;

      alert("Etapa criada com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/cronograma");
      }
    } catch (error) {
      console.error("Erro ao criar etapa:", error);
      alert("Erro ao criar etapa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Etapa</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Etapa</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Fundação, Estrutura, Acabamento"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="obra_id">Obra</Label>
            <Select value={formData.obra_id} onValueChange={(value) => setFormData({ ...formData, obra_id: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar obra" />
              </SelectTrigger>
              <SelectContent>
                {obras.map((obra) => (
                  <SelectItem key={obra.id} value={obra.id}>
                    {obra.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="data_fim">Data de Fim</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Select value={formData.responsavel} onValueChange={(value) => setFormData({ ...formData, responsavel: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar responsável" />
                </SelectTrigger>
                <SelectContent>
                  {funcionarios.map((funcionario) => (
                    <SelectItem key={funcionario.id} value={funcionario.nome}>
                      {funcionario.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Atrasada">Atrasada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Criando..." : "Criar Etapa"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
