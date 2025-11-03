
# Supabase Schema for Funfans Platform

This document outlines the complete database schema, security policies, and setup instructions required to run the Funfans application backend on Supabase.

## 1. Authentication

No special table creation is needed for authentication, as Supabase handles it with its built-in `auth.users` table.

**Setup Steps:**
1.  Navigate to **Authentication -> Providers** in your Supabase dashboard.
2.  Enable the **Email** provider. You can also enable social providers like Google or Apple if desired.
3.  Go to **Authentication -> Settings** to configure email templates for confirmation, password resets, etc.

---

## 2. Database Tables

Execute the following SQL in the **SQL Editor** in your Supabase dashboard to create all the necessary tables and relationships.

```sql
-- Create custom ENUM types for better data integrity
CREATE TYPE public.user_role AS ENUM ('user', 'creator', 'developer');
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'reward', 'subscription', 'refund', 'credit_purchase', 'payout');
CREATE TYPE public.media_type AS ENUM ('image', 'video');
CREATE TYPE public.payout_status AS ENUM ('pending', 'completed', 'failed');

-- Table to store public user data, extending the auth.users table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  profile_picture_url TEXT,
  vitrine_slug TEXT UNIQUE,
  credits_balance INT NOT NULL DEFAULT 1000,
  earned_balance INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for subscription plans offered
CREATE TABLE public.subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  credits INT NOT NULL,
  features TEXT[] NOT NULL,
  stripe_product_id TEXT
);

-- Table to track user subscriptions
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- e.g., 'active', 'canceled', 'past_due'
  renews_on TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for all content posts created by users
CREATE TABLE public.content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price INT NOT NULL CHECK (price >= 0),
  blur_level INT NOT NULL DEFAULT 5,
  tags TEXT[],
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for external payment provider records (Stripe, Mercado Pago, etc.)
CREATE TABLE public.external_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'stripe', 'mercado_pago', 'livepix'
  provider_payment_id TEXT NOT NULL,
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed'
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  metadata JSONB, -- To store raw webhook data or other info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_payment_id)
);

-- Table for all credit transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount INT NOT NULL,
  description TEXT,
  related_content_id UUID REFERENCES public.content_items(id),
  external_payment_id UUID REFERENCES public.external_payments(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Table to link content items to media files in Storage
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  media_type media_type NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

-- Join table to track which users have purchased (unlocked) which content
CREATE TABLE public.unlocked_content (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, content_item_id)
);

-- Join table for the follower/following relationship
CREATE TABLE public.followers (
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Join table for likes
CREATE TABLE public.likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, content_item_id)
);

-- Join table for shares
CREATE TABLE public.shares (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  shared_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, content_item_id)
);

-- Table for emoji reactions on content
CREATE TABLE public.reactions (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, content_item_id)
);

-- Table for creator withdrawal requests
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_credits INT NOT NULL,
  amount_usd NUMERIC(10, 2) NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

---

## 3. Storage

Media files should be stored in Supabase Storage for security and scalability.

**Setup Steps:**
1.  Navigate to **Storage** in your Supabase dashboard.
2.  Create a new bucket named `profile-pictures`. Make this bucket **public** so profile images can be easily accessed.
3.  Create another new bucket named `content-media`. Keep this bucket **private**. Access will be granted via Row Level Security policies.

---

## 4. Row Level Security (RLS)

RLS is essential to protect user data. You must enable it for each table and then add policies.

**Setup Steps:**
1.  Go to **Authentication -> Policies**.
2.  For each table listed below, click "Enable RLS".
3.  Then, for each table, create new policies by pasting the provided SQL into the **SQL Editor**.

```sql
-- PROFILES
-- 1. Users can see all profiles.
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
-- 2. Users can only update their own profile.
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- CONTENT ITEMS
-- 1. Allow authenticated users to view non-hidden content.
CREATE POLICY "Allow read access to content" ON public.content_items FOR SELECT USING (auth.role() = 'authenticated' AND is_hidden = false);
-- 2. Allow creators to manage their own content.
CREATE POLICY "Allow creators to manage their own content" ON public.content_items FOR ALL USING (auth.uid() = creator_id);

-- MEDIA
-- 1. Allow users who have unlocked content to view its media.
CREATE POLICY "Allow unlocked users to view media" ON public.media FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM unlocked_content
    WHERE content_item_id = media.content_item_id AND user_id = auth.uid()
  )
);
-- 2. Allow creators to manage their own media.
CREATE POLICY "Allow creators to manage their own media" ON public.media FOR ALL USING (
  EXISTS (
    SELECT 1 FROM content_items
    WHERE id = media.content_item_id AND creator_id = auth.uid()
  )
);

-- UNLOCKED_CONTENT
-- 1. Users can only view their own unlocked records.
CREATE POLICY "Allow users to view their own unlocked content" ON public.unlocked_content FOR SELECT USING (auth.uid() = user_id);

-- TRANSACTIONS
-- 1. Users can only view their own transactions.
CREATE POLICY "Allow users to view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- EXTERNAL_PAYMENTS
-- 1. Users can only see their own payment records.
CREATE POLICY "Allow users to view their own external payments" ON public.external_payments FOR SELECT USING (auth.uid() = user_id);

-- LIKES, SHARES, REACTIONS, FOLLOWERS
-- 1. Allow authenticated users full access to social features.
CREATE POLICY "Allow full access for authenticated users on likes" ON public.likes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on shares" ON public.shares FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on reactions" ON public.reactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow full access for authenticated users on followers" ON public.followers FOR ALL USING (auth.role() = 'authenticated');

-- USER SUBSCRIPTIONS
-- 1. Users can only manage their own subscription.
CREATE POLICY "Allow users to manage their own subscription" ON public.user_subscriptions FOR ALL USING (auth.uid() = user_id);

-- PAYOUTS
-- 1. Creators can only manage their own payouts.
CREATE POLICY "Allow creators to manage their own payouts" ON public.payouts FOR ALL USING (auth.uid() = creator_id);
```

---

## 5. Database Functions and Triggers

Automate profile creation and handle complex logic like purchases securely on the backend.

**Setup Steps:**
1.  Run the following SQL in the **SQL Editor**.

```sql
-- Function to create a public profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, vitrine_slug)
  VALUES (
    new.id,
    'user' || substr(new.id::text, 1, 8), -- Default username
    'user-' || substr(new.id::text, 1, 8) -- Default slug
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Database function (RPC) to handle a content purchase
CREATE OR REPLACE FUNCTION public.purchase_content(item_id UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  item_price INT;
  buyer_balance INT;
  creator_id_val UUID;
  commission_rate NUMERIC := 0.50; -- Matches frontend
  earnings INT;
BEGIN
  -- 1. Get item price and creator ID
  SELECT price, creator_id INTO item_price, creator_id_val
  FROM public.content_items WHERE id = item_id;

  -- 2. Get buyer's current balance
  SELECT credits_balance INTO buyer_balance
  FROM public.profiles WHERE id = auth.uid();

  -- 3. Check if balance is sufficient
  IF buyer_balance < item_price THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient credits');
  END IF;

  -- 4. Deduct price from buyer's balance
  UPDATE public.profiles
  SET credits_balance = credits_balance - item_price
  WHERE id = auth.uid();

  -- 5. Calculate earnings and add to creator's earned balance
  earnings := floor(item_price * (1 - commission_rate));
  UPDATE public.profiles
  SET earned_balance = earned_balance + earnings
  WHERE id = creator_id_val;

  -- 6. Add record to unlocked_content table
  INSERT INTO public.unlocked_content (user_id, content_item_id)
  VALUES (auth.uid(), item_id);

  -- 7. Create a transaction record for the buyer
  INSERT INTO public.transactions (user_id, type, amount, description, related_content_id)
  VALUES (auth.uid(), 'purchase', -item_price, 'Content purchase', item_id);

  RETURN json_build_object('success', true, 'message', 'Purchase successful');
END;
$$;
```

With this function, instead of handling purchase logic on the frontend, you would simply call it from your app:
`const { data, error } = await supabase.rpc('purchase_content', { item_id: '...' })`

This is far more secure and reliable.

---

## 6. Frontend Environment

Finally, connect your frontend application to your new Supabase backend.
1.  Go to **Project Settings -> API**.
2.  Find your **Project URL** and **anon (public) key**.
3.  Add these to your application's environment variables (`.env` file):
    ```
    VITE_SUPABASE_URL=YOUR_PROJECT_URL
    VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
    ```

Your Funfans backend is now fully configured and ready for data persistence!




API gemini

AIzaSyAvecfgEHN0jwwmE5Z2oignUFPt0MOCG-w

android rewards  

 ID de aplicativo:  
ca-app-pub-9940279518295431~8194670508

código usando este código de bloco de anúncios:  
ca-app-pub-9940279518295431/6202931980

Stripe

chave restrita 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 

chave publica pk_live_51QOMivKg4NAdmMglJPmORiI4jlIBKRf4beqR4eaxJx0xZWHz13eTD8KgSdWWizgnzepLs0PcGF35fx9TTSBPIaYR00E5EFl6ZZ 

WEBHOOK STRYPE https://cpggicxvmgyljvoxlpnu.supabase.co/functions/v1/stripe-webhook  



ids produtos e planos stripe

2500 credit  
25 $  
prod_SyYmVrUetdiIBY

10000 credit  
100 $  
prod_SyYhva8A2beAw6

5000 credit  
50 $  
prod_SyYg54VfiOr7LQ

1000 credit  
10$  
prod_SyYfzJ1fjz9zb9

500 credit  
5$  
prod_SyYeStqRDuWGFF

100 credit  
1$  
prod_SyYehlUkfzq9Qn

200 credit  
2$  
prod_SyYasByos1peGR

free plan

prod_SyYChoQJbIb1ye

basic plan  
9$  
prod_SyYK31lYwaraZW

pro plan  
15 $  
prod_SyYMs3lMIhORSP

vip plan  
25$





  mercado pago api key public
   APP_USR-4b0a99f3-dc4f-4d33-8f08-12354f51951f
   
   acess token 
   APP_USR-2788550269284837-082514-7c59a29754c79ba60b1bd71d37d4647d-771121179 
   
   client secret 
   ofXe7rw7yjFbOWGLYAy5bzlOHUWGxFZ4 
   
   client id 2788550269284837
   
aqui esta url de produção = webhook https://lgstvoixptdcqohsxkvo.supabase.co/functions/v1/mercadopago-webhook  

API LIVE PIX = 72eaf585-19a4-46d6-8c84-0c14e2738e16


https://widget.livepix.gg/embed/782d9bf9-cb99-4196-b9c2-cfa6a14b4d64


Url Live Pix

https://livepix.gg/faala