
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovoOrcamentoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovoOrcamentoForm({ onSuccess, onCancel }: NovoOrcamentoFormProps) {
  const [formData, setFormData] = useState({
    numero: "",
    cliente: "",
    obra: "",
    valor: "",
    validade: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateOrcamentoNumber = () => {
    const timestamp = Date.now();
    const number = `ORC-${timestamp.toString().slice(-6)}`;
    setFormData({ ...formData, numero: number });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("orcamentos")
        .insert({
          user_id: user.id,
          numero: formData.numero,
          cliente: formData.cliente,
          obra: formData.obra,
          valor: parseFloat(formData.valor),
          validade: formData.validade,
          status: "Rascunho"
        });

      if (error) throw error;

      alert("Orçamento criado com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/orcamentos");
      }
    } catch (error) {
      console.error("Erro ao criar orçamento:", error);
      alert("Erro ao criar orçamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Orçamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="numero">Número do Orçamento</Label>
            <div className="flex gap-2">
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                placeholder="Ex: ORC-001"
                required
              />
              <Button type="button" variant="outline" onClick={generateOrcamentoNumber}>
                Gerar
              </Button>
            </div>
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
            <Label htmlFor="obra">Descrição da Obra</Label>
            <Input
              id="obra"
              value={formData.obra}
              onChange={(e) => setFormData({ ...formData, obra: e.target.value })}
              placeholder="Ex: Casa Residencial, Reforma Comercial"
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
              <Label htmlFor="validade">Validade</Label>
              <Input
                id="validade"
                type="date"
                value={formData.validade}
                onChange={(e) => setFormData({ ...formData, validade: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Criando..." : "Criar Orçamento"}
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
