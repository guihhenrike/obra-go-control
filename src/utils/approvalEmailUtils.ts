
import { supabase } from "@/integrations/supabase/client";

export const sendApprovalEmail = async (userEmail: string, userName: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-approval-email', {
      body: {
        userEmail,
        userName
      }
    });

    if (error) {
      console.error('Erro ao enviar email de aprovação:', error);
      throw error;
    }

    console.log('Email de aprovação enviado com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro ao invocar função de email:', error);
    throw error;
  }
};
