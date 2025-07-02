
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovaTransacaoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovaTransacaoForm({ onSuccess, onCancel }: NovaTransacaoFormProps) {
  const [formData, setFormData] = useState({
    descricao: "",
    valor: "",
    tipo: "receita",
    categoria: "",
    obra_id: "",
    data: new Date().toISOString().split('T')[0]
  });
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObras();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("transacoes")
        .insert({
          user_id: user.id,
          descricao: formData.descricao,
          valor: parseFloat(formData.valor),
          tipo: formData.tipo,
          categoria: formData.categoria,
          obra_id: formData.obra_id || null,
          data: formData.data
        });

      if (error) throw error;

      alert("Transação adicionada com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/financeiro");
      }
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      alert("Erro ao adicionar transação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nova Transação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Pagamento Cliente, Compra de Material"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {formData.tipo === "receita" ? (
                  <>
                    <SelectItem value="Recebimento de Cliente">Recebimento de Cliente</SelectItem>
                    <SelectItem value="Pagamento Obra">Pagamento Obra</SelectItem>
                    <SelectItem value="Outros Recebimentos">Outros Recebimentos</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Materiais">Materiais</SelectItem>
                    <SelectItem value="Mão de Obra">Mão de Obra</SelectItem>
                    <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                    <SelectItem value="Outras Despesas">Outras Despesas</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="obra_id">Obra (Opcional)</Label>
              <Select value={formData.obra_id} onValueChange={(value) => setFormData({ ...formData, obra_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar obra" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não associar a uma obra</SelectItem>
                  {obras.map((obra) => (
                    <SelectItem key={obra.id} value={obra.id}>
                      {obra.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Adicionando..." : "Adicionar Transação"}
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
