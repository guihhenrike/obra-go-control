
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditarFuncionarioFormProps {
  funcionario: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditarFuncionarioForm({ funcionario, onSuccess, onCancel }: EditarFuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: funcionario.nome,
    email: funcionario.email || "",
    telefone: funcionario.telefone,
    funcao: funcionario.funcao,
    valor_remuneracao: funcionario.valor_remuneracao,
    tipo_remuneracao: funcionario.tipo_remuneracao || "diaria",
    status: funcionario.status
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("funcionarios")
        .update({
          ...formData,
          email: formData.email || null
        })
        .eq("id", funcionario.id);

      if (error) throw error;

      toast.success("Funcionário atualizado com sucesso!");
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error);
      toast.error("Erro ao atualizar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-navy">Editar Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="funcao">Função</Label>
              <Input
                id="funcao"
                value={formData.funcao}
                onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo_remuneracao">Tipo de Remuneração</Label>
              <Select value={formData.tipo_remuneracao} onValueChange={(value) => setFormData({...formData, tipo_remuneracao: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="salario">Salário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor_remuneracao">
                {formData.tipo_remuneracao === 'diaria' ? 'Valor da Diária (R$)' : 'Salário Mensal (R$)'}
              </Label>
              <Input
                id="valor_remuneracao"
                type="number"
                step="0.01"
                value={formData.valor_remuneracao}
                onChange={(e) => setFormData({...formData, valor_remuneracao: parseFloat(e.target.value)})}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Férias">Férias</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
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
  );
}
