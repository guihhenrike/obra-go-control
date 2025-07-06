
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useEquipeOptions() {
  const [funcoes, setFuncoes] = useState<string[]>([]);
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar funções únicas
      const { data: funcoesData } = await supabase
        .from("funcionarios")
        .select("funcao")
        .eq("user_id", user.id);

      // Buscar status únicos
      const { data: statusData } = await supabase
        .from("funcionarios")
        .select("status")
        .eq("user_id", user.id);

      if (funcoesData) {
        const uniqueFuncoes = [...new Set(funcoesData.map(item => item.funcao))].filter(Boolean);
        setFuncoes(uniqueFuncoes);
      }

      if (statusData) {
        const uniqueStatus = [...new Set(statusData.map(item => item.status))].filter(Boolean);
        setStatus(uniqueStatus);
      }
    } catch (error) {
      console.error("Erro ao buscar opções da equipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return { funcoes, status, loading, refetch: fetchOptions };
}
