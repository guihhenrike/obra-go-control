
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("=== Password Reset Function Started ===");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Method not allowed" 
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    console.log("Processing password reset request...");
    
    // Verificar variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    
    console.log("Environment check:", {
      supabaseUrl: !!supabaseUrl,
      supabaseServiceKey: !!supabaseServiceKey,
      resendKey: !!resendKey,
      resendKeyLength: resendKey?.length || 0
    });

    console.log("All env vars:", Object.keys(Deno.env.toObject()));
    console.log("RESEND_API_KEY exists:", !!Deno.env.get('RESEND_API_KEY'));
    console.log("RESEND_API_KEY value start:", Deno.env.get('RESEND_API_KEY')?.substring(0, 10));

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Supabase configuration error" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!resendKey) {
      console.error("Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service not configured" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse request body
    let requestBody;
    try {
      const text = await req.text();
      console.log("Request body text:", text);
      requestBody = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid request body" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { email } = requestBody as PasswordResetRequest;
    console.log("Email for reset:", email);

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email is required" 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Initialize Resend
    const resend = new Resend(resendKey);

    // Check if user exists
    console.log("Checking if user exists...");
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error("Error listing users:", userError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Internal server error" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const userExists = users?.users.find(u => u.email === email);
    console.log("User found:", !!userExists);

    if (!userExists) {
      console.log("User not found, returning success for security");
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

    // Generate reset link
    console.log("Generating password reset link...");
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://obra-go-control.lovable.app';
    const redirectUrl = `${origin}/auth?mode=reset`;
    
    console.log("Redirect URL:", redirectUrl);
    
    const { data: resetData, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (resetError) {
      console.error("Error generating reset link:", resetError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to generate reset link" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    if (!resetData?.properties?.action_link) {
      console.error("No action link generated");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to generate reset link" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Reset link generated successfully");

    // Send email via Resend
    console.log("Sending email via Resend...");
    const emailResponse = await resend.emails.send({
      from: "ObraGo <noreply@obragocontrol.com>",
      to: [email],
      subject: "Recuperação de Senha - ObraGo",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 64px; height: 64px; background-color: #ef4444; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
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

    console.log("Resend response:", emailResponse);

    if (emailResponse.error) {
      console.error("Error sending email:", emailResponse.error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to send email" 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully!");

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
    console.error("=== ERROR in password reset function ===");
    console.error("Error type:", typeof error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    console.error("Full error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Internal server error",
        details: error?.message || "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
