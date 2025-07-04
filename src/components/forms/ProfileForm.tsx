
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
}

export function ProfileForm() {
  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar dados do perfil na tabela profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormData({
          id: user.id,
          name: profile.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          company: user.user_metadata?.company || "",
          role: profile.role || ""
        });
      } else {
        // Fallback para user metadata se não encontrar profile
        setFormData({
          id: user.id,
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          company: user.user_metadata?.company || "",
          role: ""
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Atualizar user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          phone: formData.phone,
          company: formData.company
        }
      });

      if (userError) throw userError;

      // Atualizar perfil na tabela profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!"
      });

      // Recarregar a página para atualizar o header
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "user":
        return "Usuário";
      case "pending":
        return "Pendente de Aprovação";
      case "blocked":
        return "Bloqueado";
      default:
        return "Não definido";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">O email não pode ser alterado</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da sua empresa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Nível de Acesso</Label>
            <Input
              id="role"
              value={getRoleDisplay(formData.role)}
              disabled
              className="bg-gray-100 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">O nível de acesso é definido pelo administrador</p>
          </div>
          
          <Button type="submit" disabled={loading} className="bg-secondary hover:bg-secondary/90">
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
