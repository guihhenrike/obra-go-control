
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovoMaterialFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovoMaterialForm({ onSuccess, onCancel }: NovoMaterialFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: "",
    valor: "",
    fornecedor: "",
    obra_id: "",
    status: "Pendente"
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
        .from("materiais")
        .insert({
          user_id: user.id,
          nome: formData.nome,
          quantidade: parseInt(formData.quantidade),
          valor: parseFloat(formData.valor),
          fornecedor: formData.fornecedor,
          obra_id: formData.obra_id || null,
          status: formData.status
        });

      if (error) throw error;

      alert("Material adicionado com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/materiais");
      }
    } catch (error) {
      console.error("Erro ao adicionar material:", error);
      alert("Erro ao adicionar material. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Material</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome do Material</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Ex: Cimento CP-III 50kg"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="obra_id">Obra (Opcional)</Label>
            <Select value={formData.obra_id} onValueChange={(value) => setFormData({ ...formData, obra_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar obra" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma obra específica</SelectItem>
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
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="valor">Valor Unitário (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                value={formData.fornecedor}
                onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Comprado">Comprado</SelectItem>
                  <SelectItem value="Em Estoque">Em Estoque</SelectItem>
                  <SelectItem value="Esgotado">Esgotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Adicionando..." : "Adicionar Material"}
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
