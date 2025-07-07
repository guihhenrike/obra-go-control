
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
    console.log("Iniciando processo de recuperação de senha");
    
    const { email }: PasswordResetRequest = await req.json();
    console.log("Email recebido:", email);

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar se o usuário existe
    const { data: user, error: userError } = await supabase.auth.admin.listUsers();
    const userExists = user?.users.find(u => u.email === email);

    if (!userExists) {
      console.log("Usuário não encontrado:", email);
      // Por segurança, vamos retornar sucesso mesmo se o usuário não existir
      return new Response(
        JSON.stringify({ success: true, message: "Se o email existir, um link de recuperação será enviado." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Gerar token de recuperação
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${req.headers.get('origin') || 'https://obra-go-control.lovable.app'}/auth?mode=reset`
      }
    });

    if (resetError) {
      console.error("Erro ao gerar link de recuperação:", resetError);
      throw resetError;
    }

    console.log("Link de recuperação gerado com sucesso");

    // Enviar email via Resend
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
              <a href="${resetData.properties?.action_link}" 
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

    console.log("Email enviado com sucesso:", emailResponse);

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
    console.error("Erro na função de recuperação de senha:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno do servidor. Tente novamente." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
