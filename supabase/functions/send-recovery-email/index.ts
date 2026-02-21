import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'

console.log('🚀 Iniciando edge function send-recovery-email...');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      throw new Error('Email é obrigatório')
    }

    // Use Supabase's built-in password recovery instead of Resend
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Use supabase.auth.resetPasswordForEmail() on the client side.' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
