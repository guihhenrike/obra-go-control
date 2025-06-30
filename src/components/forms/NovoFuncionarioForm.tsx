
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface NovoFuncionarioFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovoFuncionarioForm({ onSuccess, onCancel }: NovoFuncionarioFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    funcao: "",
    telefone: "",
    email: "",
    diaria: "",
    status: "Ativo"
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
        .from("funcionarios")
        .insert({
          user_id: user.id,
          nome: formData.nome,
          funcao: formData.funcao,
          telefone: formData.telefone,
          email: formData.email,
          diaria: parseFloat(formData.diaria),
          status: formData.status
        });

      if (error) throw error;

      alert("Funcionário adicionado com sucesso!");
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/equipe");
      }
    } catch (error) {
      console.error("Erro ao adicionar funcionário:", error);
      alert("Erro ao adicionar funcionário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Novo Funcionário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="funcao">Função</Label>
            <Input
              id="funcao"
              value={formData.funcao}
              onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
              placeholder="Ex: Pedreiro, Eletricista, Pintora"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diaria">Diária (R$)</Label>
              <Input
                id="diaria"
                type="number"
                step="0.01"
                value={formData.diaria}
                onChange={(e) => setFormData({ ...formData, diaria: e.target.value })}
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
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Férias">Férias</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
              {loading ? "Adicionando..." : "Adicionar Funcionário"}
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
