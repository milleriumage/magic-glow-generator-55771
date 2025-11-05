import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('MercadoPago webhook received:', body);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // MercadoPago sends notifications about payment updates
    if (body.type === 'payment') {
      const paymentId = body.data?.id;
      
      if (!paymentId) {
        console.error('No payment ID found');
        return new Response('No payment ID', { status: 400, headers: corsHeaders });
      }

      // Fetch payment details from MercadoPago API
      const accessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN');
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error('Failed to fetch payment details');
        return new Response('Payment fetch failed', { status: 500, headers: corsHeaders });
      }

      const payment = await paymentResponse.json();
      console.log('Payment details:', payment);

      const userId = payment.metadata?.user_id;
      const credits = parseInt(payment.metadata?.credits || '0');

      if (payment.status === 'approved' && userId && credits) {
        // Update user credits
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits_balance')
          .eq('id', userId)
          .single();

        if (profile) {
          await supabase
            .from('profiles')
            .update({ credits_balance: profile.credits_balance + credits })
            .eq('id', userId);

          // Record transaction
          await supabase.from('transactions').insert({
            user_id: userId,
            type: 'credit_purchase',
            amount: credits,
            description: `PIX purchase: ${credits} credits`,
          });

          // Record external payment
          await supabase.from('external_payments').insert({
            user_id: userId,
            provider: 'mercado_pago',
            provider_payment_id: String(paymentId),
            status: 'succeeded',
            amount: payment.transaction_amount,
            currency: payment.currency_id.toLowerCase(),
            metadata: { payment },
          });

          console.log(`Credits added for user ${userId}: ${credits}`);
        }
      } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
        // Record failed payment
        if (userId) {
          await supabase.from('external_payments').insert({
            user_id: userId,
            provider: 'mercado_pago',
            provider_payment_id: String(paymentId),
            status: 'failed',
            amount: payment.transaction_amount,
            currency: payment.currency_id.toLowerCase(),
            metadata: { payment },
          });
        }
        console.log(`Payment ${payment.status}: ${paymentId}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing MercadoPago webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
