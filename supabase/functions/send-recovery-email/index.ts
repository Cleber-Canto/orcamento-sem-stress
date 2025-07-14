import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, resetUrl } = await req.json()

    if (!email) {
      throw new Error('Email é obrigatório')
    }

    const { data, error } = await resend.emails.send({
      from: 'Controle Financeiro <onboarding@resend.dev>',
      to: [email],
      subject: 'Recuperação de Senha - Controle Financeiro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Controle Financeiro</h1>
            <h2 style="color: #374151; font-size: 24px; margin-bottom: 20px;">Recuperação de Senha</h2>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
              Olá! Recebemos uma solicitação para redefinir a senha da sua conta.
            </p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Para redefinir sua senha, clique no botão abaixo:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl || '#'}" 
                 style="background: #2563eb; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 6px; font-size: 16px; 
                        font-weight: 500; display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Se você não solicitou a redefinição de senha, pode ignorar este email com segurança.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px;">
              Este email foi enviado automaticamente. Por favor, não responda.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de recuperação enviado com sucesso!' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})