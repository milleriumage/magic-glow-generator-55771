// @ts-nocheck
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      console.error('No signature found');
      return new Response('No signature', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret || '');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook Error', { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const credits = parseInt(session.metadata?.credits || '0');
        
        if (!userId || !credits) {
          console.error('Missing metadata:', session.metadata);
          break;
        }

        // Update user credits
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ credits_balance: supabase.rpc('increment_credits', { user_id: userId, amount: credits }) })
          .eq('id', userId);

        if (updateError) {
          console.error('Error updating credits:', updateError);
        }

        // Record transaction
        await supabase.from('transactions').insert({
          user_id: userId,
          type: 'credit_purchase',
          amount: credits,
          description: `Stripe purchase: ${credits} credits`,
        });

        // Record external payment
        await supabase.from('external_payments').insert({
          user_id: userId,
          provider: 'stripe',
          provider_payment_id: session.id,
          status: 'succeeded',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          metadata: { session },
        });

        console.log(`Credits added for user ${userId}: ${credits}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.user_id;
        const planId = subscription.metadata?.plan_id;

        if (!userId || !planId) {
          console.error('Missing subscription metadata');
          break;
        }

        const status = subscription.status === 'active' ? 'active' : 
                      subscription.status === 'canceled' ? 'canceled' : 'past_due';

        // Upsert subscription
        await supabase.from('user_subscriptions').upsert({
          user_id: userId,
          plan_id: planId,
          status,
          stripe_subscription_id: subscription.id,
          renews_on: new Date(subscription.current_period_end * 1000).toISOString(),
        });

        console.log(`Subscription ${event.type} for user ${userId}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await supabase
          .from('user_subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id);

        console.log(`Subscription canceled: ${subscription.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
