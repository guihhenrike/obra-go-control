
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, UserCheck, UserX, Clock, Search } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchProfiles();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(data?.role === "admin");
    } catch (error) {
      console.error("Erro ao verificar status admin:", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData: any = { 
        role: newRole,
        updated_at: new Date().toISOString()
      };

      if (newRole === "user") {
        updateData.approved_by = user?.id;
        updateData.approved_at = new Date().toISOString();
        updateData.subscription_status = "active";
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Usuário ${newRole === "user" ? "aprovado" : "atualizado"} com sucesso`
      });

      fetchProfiles();
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o usuário",
        variant: "destructive"
      });
    }
  };

  const updateSubscriptionStatus = async (userId: string, status: string) => {
    try {
      const updateData: any = { 
        subscription_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === "active") {
        // Definir data de expiração para 1 mês
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        updateData.subscription_expires_at = expiryDate.toISOString();
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status da assinatura atualizado"
      });

      fetchProfiles();
    } catch (error) {
      console.error("Erro:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a assinatura",
        variant: "destructive"
      });
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "pending" && profile.role === "pending") ||
                         (statusFilter === "active" && profile.role === "user") ||
                         (statusFilter === "blocked" && profile.role === "blocked") ||
                         (statusFilter === "admin" && profile.role === "admin");

    return matchesSearch && matchesStatus;
  });

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <UserX className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
              <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (role: string, subscriptionStatus?: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
      case "user":
        return subscriptionStatus === "active" ? 
          <Badge className="bg-green-100 text-green-800">Ativo</Badge> :
          <Badge className="bg-yellow-100 text-yellow-800">Pendente Pagamento</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Aguardando Aprovação</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPendingCount = () => profiles.filter(p => p.role === "pending").length;
  const getActiveCount = () => profiles.filter(p => p.role === "user" && p.subscription_status === "active").length;
  const getOverdueCount = () => profiles.filter(p => p.subscription_status === "overdue").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-navy dark:text-white">Administração</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie usuários e assinaturas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{getPendingCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getActiveCount()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{getOverdueCount()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="blocked">Bloqueados</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie aprovações, roles e status de assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <div className="space-y-4">
              {filteredProfiles.map((profile) => (
                <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{profile.name || "Nome não informado"}</h3>
                      {getStatusBadge(profile.role, profile.subscription_status || undefined)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{profile.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Criado em: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                    </p>
                    {profile.subscription_expires_at && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Expira em: {new Date(profile.subscription_expires_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {profile.role === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateUserRole(profile.id, "user")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateUserRole(profile.id, "blocked")}
                        >
                          Bloquear
                        </Button>
                      </>
                    )}

                    {profile.role === "user" && (
                      <>
                        {profile.subscription_status !== "active" && (
                          <Button
                            size="sm"
                            onClick={() => updateSubscriptionStatus(profile.id, "active")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Ativar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSubscriptionStatus(profile.id, "overdue")}
                        >
                          Marcar Atraso
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateUserRole(profile.id, "blocked")}
                        >
                          Bloquear
                        </Button>
                      </>
                    )}

                    {profile.role === "blocked" && (
                      <Button
                        size="sm"
                        onClick={() => updateUserRole(profile.id, "user")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Desbloquear
                      </Button>
                    )}

                    {profile.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateUserRole(profile.id, "admin")}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        Tornar Admin
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {filteredProfiles.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
