
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovaObraFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovaObraForm({ onSuccess, onCancel }: NovaObraFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cliente: "",
    endereco: "",
    data_inicio: "",
    previsao_fim: "",
    orcamento: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("obras")
        .insert({
          user_id: user.id,
          nome: formData.nome,
          cliente: formData.cliente,
          endereco: formData.endereco,
          data_inicio: formData.data_inicio,
          previsao_fim: formData.previsao_fim,
          orcamento: parseFloat(formData.orcamento),
          progresso: 0,
          status: "Em Andamento"
        });

      if (error) throw error;

      alert("Obra criada com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/obras");
      }
    } catch (error) {
      console.error("Erro ao criar obra:", error);
      alert("Erro ao criar obra. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Obra</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Obra</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cliente">Cliente</Label>
            <Input
              id="cliente"
              value={formData.cliente}
              onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              required
            />
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
              <Label htmlFor="previsao_fim">Previsão de Fim</Label>
              <Input
                id="previsao_fim"
                type="date"
                value={formData.previsao_fim}
                onChange={(e) => setFormData({ ...formData, previsao_fim: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="orcamento">Orçamento (R$)</Label>
            <Input
              id="orcamento"
              type="number"
              step="0.01"
              value={formData.orcamento}
              onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Criando..." : "Criar Obra"}
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
