
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

interface EditarOrcamentoFormProps {
  orcamento: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditarOrcamentoForm({ orcamento, onSuccess, onCancel }: EditarOrcamentoFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: orcamento.numero || "",
    cliente: orcamento.cliente || "",
    obra: orcamento.obra || "",
    valor: orcamento.valor || "",
    validade: orcamento.validade || "",
    status: orcamento.status || "Rascunho"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("orcamentos")
        .update({
          numero: formData.numero,
          cliente: formData.cliente,
          obra: formData.obra,
          valor: parseFloat(formData.valor),
          validade: formData.validade,
          status: formData.status
        })
        .eq("id", orcamento.id);

      if (error) throw error;

      toast.success("Orçamento atualizado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      toast.error("Erro ao atualizar orçamento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-navy">Editar Orçamento</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Orçamento</CardTitle>
          <CardDescription>Atualize as informações do orçamento</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero">Número do Orçamento</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => handleChange("numero", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                    <SelectItem value="Enviado">Enviado</SelectItem>
                    <SelectItem value="Aceito">Aceito</SelectItem>
                    <SelectItem value="Recusado">Recusado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => handleChange("cliente", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="obra">Obra</Label>
              <Input
                id="obra"
                value={formData.obra}
                onChange={(e) => handleChange("obra", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => handleChange("valor", e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="validade">Validade</Label>
                <Input
                  id="validade"
                  type="date"
                  value={formData.validade}
                  onChange={(e) => handleChange("validade", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
