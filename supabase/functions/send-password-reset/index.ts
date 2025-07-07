
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("=== Iniciando processo de recuperação de senha ===");
    
    // Verificar se temos as variáveis de ambiente necessárias
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    
    console.log("Verificando variáveis de ambiente:", {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
      resendKey: !!resendKey
    });

    if (!supabaseUrl || !supabaseServiceKey || !resendKey) {
      console.error("Variáveis de ambiente faltando");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Configuração do servidor incompleta" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const { email }: PasswordResetRequest = await req.json();
    console.log("Email recebido para recuperação:", email);

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o usuário existe
    console.log("Verificando se usuário existe...");
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Erro ao listar usuários:", userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro interno do servidor" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const userExists = users?.users.find(u => u.email === email);
    console.log("Usuário encontrado:", !!userExists);

    if (!userExists) {
      console.log("Usuário não encontrado, mas retornando sucesso por segurança");
      // Por segurança, vamos retornar sucesso mesmo se o usuário não existir
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Se o email existir, um link de recuperação será enviado." 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Gerar token de recuperação
    console.log("Gerando link de recuperação...");
    const origin = req.headers.get('origin') || 'https://obra-go-control.lovable.app';
    const redirectUrl = `${origin}/auth?mode=reset`;
    
    console.log("URL de redirecionamento:", redirectUrl);
    
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (resetError) {
      console.error("Erro ao gerar link de recuperação:", resetError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao gerar link de recuperação" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!resetData?.properties?.action_link) {
      console.error("Link de recuperação não foi gerado");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao gerar link de recuperação" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Link de recuperação gerado com sucesso");

    // Enviar email via Resend
    console.log("Enviando email via Resend...");
    const emailResponse = await resend.emails.send({
      from: "ObraGo <noreply@obragocontrol.com>",
      to: [email],
      subject: "Recuperação de Senha - ObraGo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 64px; height: 64px; background-color: #1e40af; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <span style="color: white; font-size: 24px;">🏗️</span>
            </div>
            <h1 style="color: #1e3a8a; margin: 0;">Recuperação de Senha</h1>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
              Olá,
            </p>
            <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
              Recebemos uma solicitação para redefinir a senha da sua conta no <strong>ObraGo</strong>.
            </p>
            <p style="margin: 0 0 30px 0; color: #374151; font-size: 16px;">
              Clique no botão abaixo para redefinir sua senha:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetData.properties.action_link}" 
                 style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px;">
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.
            </p>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
              Este link expira em 1 hora por motivos de segurança.
            </p>
          </div>
          
          <div style="text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2024 ObraGo - Sistema de Gestão de Obras</p>
          </div>
        </div>
      `,
    });

    console.log("Resposta do Resend:", emailResponse);

    if (emailResponse.error) {
      console.error("Erro ao enviar email:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao enviar email. Tente novamente." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email enviado com sucesso!");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email de recuperação enviado com sucesso!",
        emailId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("=== ERRO GERAL na função ===");
    console.error("Tipo do erro:", typeof error);
    console.error("Nome do erro:", error?.name);
    console.error("Mensagem:", error?.message);
    console.error("Stack:", error?.stack);
    console.error("Erro completo:", JSON.stringify(error, null, 2));
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor. Tente novamente em alguns minutos.",
        details: error?.message || "Erro desconhecido"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
