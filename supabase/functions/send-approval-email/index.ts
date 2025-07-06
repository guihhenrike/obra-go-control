
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName }: ApprovalEmailRequest = await req.json();

    console.log("Enviando email de aprovação para:", userEmail);

    const emailResponse = await resend.emails.send({
      from: "ConstructPRO <onboarding@resend.dev>",
      to: [userEmail],
      subject: "Sua conta foi aprovada! - ConstructPRO",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ConstructPRO</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Sistema de Gestão de Obras</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-top: 0;">🎉 Conta Aprovada!</h2>
            
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Olá <strong>${userName}</strong>,
            </p>
            
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Temos o prazer de informar que sua conta no <strong>ConstructPRO</strong> foi aprovada por um administrador e já está ativa!
            </p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 15px; margin: 20px 0;">
              <p style="color: #155724; margin: 0; font-weight: bold;">✅ Sua conta está agora totalmente ativa</p>
              <p style="color: #155724; margin: 5px 0 0 0;">Você já pode acessar todas as funcionalidades do sistema</p>
            </div>
            
            <p style="color: #495057; font-size: 16px; line-height: 1.6;">
              Agora você pode fazer login e começar a usar o sistema para gerenciar suas obras, equipes, materiais e muito mais!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get("SITE_URL") || "https://constructpro.lovable.app"}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Acessar ConstructPRO
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
            
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
              Se você não solicitou esta conta, pode ignorar este email.
            </p>
            
            <p style="color: #6c757d; font-size: 14px; margin: 10px 0 0 0;">
              Atenciosamente,<br>
              <strong>Equipe ConstructPRO</strong>
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email de aprovação enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Erro ao enviar email de aprovação:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
