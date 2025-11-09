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

    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError?.message || 'No user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please login to continue' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { type, id } = await req.json();

    console.log('Creating checkout session:', { type, id, userId: user.id });

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let metadata: any = { user_id: user.id };

    if (type === 'credit_package') {
      // Get credit package details
      const { data: pkg, error: pkgError } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('id', id)
        .single();

      if (pkgError || !pkg) {
        console.error('Package error:', pkgError);
        return new Response(
          JSON.stringify({ error: 'Package not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create or get Stripe price for this product
      const prices = await stripe.prices.list({
        product: pkg.stripe_product_id,
        active: true,
        limit: 1,
      });

      let priceId: string;
      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      } else {
        // Create price if it doesn't exist
        const price = await stripe.prices.create({
          product: pkg.stripe_product_id,
          unit_amount: Math.round(pkg.price * 100), // Convert to cents
          currency: 'usd',
        });
        priceId = price.id;
      }

      lineItems = [{ price: priceId, quantity: 1 }];
      metadata.credits = pkg.credits + pkg.bonus;
      metadata.type = 'credit_package';

    } else if (type === 'subscription') {
      // Get subscription plan details
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (planError || !plan) {
        console.error('Plan error:', planError);
        return new Response(
          JSON.stringify({ error: 'Plan not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create or get Stripe price for this subscription
      const prices = await stripe.prices.list({
        product: plan.stripe_product_id,
        active: true,
        type: 'recurring',
        limit: 1,
      });

      let priceId: string;
      if (prices.data.length > 0) {
        priceId = prices.data[0].id;
      } else {
        // Create recurring price if it doesn't exist
        const price = await stripe.prices.create({
          product: plan.stripe_product_id,
          unit_amount: Math.round(plan.price * 100),
          currency: plan.currency.toLowerCase(),
          recurring: { interval: 'month' },
        });
        priceId = price.id;
      }

      lineItems = [{ price: priceId, quantity: 1 }];
      metadata.plan_id = plan.id;
      metadata.credits = plan.credits;
      metadata.type = 'subscription';
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: type === 'subscription' ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin') || 'https://cpggicxvmgyljvoxlpnu.supabase.co'}/`,
      cancel_url: `${req.headers.get('origin') || 'https://cpggicxvmgyljvoxlpnu.supabase.co'}/`,
      metadata,
    });

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
