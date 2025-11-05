
# Supabase Schema - FunFans Platform

Esta documentação completa descreve o esquema do banco de dados, segurança, edge functions e integrações para a plataforma FunFans.

## 📋 Índice
1. [Autenticação](#autenticação)
2. [Tabelas do Banco de Dados](#tabelas-do-banco-de-dados)
3. [Storage](#storage)
4. [Row Level Security (RLS)](#row-level-security-rls)
5. [Funções e Triggers](#funções-e-triggers)
6. [Edge Functions](#edge-functions)
7. [Integrações de Pagamento](#integrações-de-pagamento)
8. [Configuração do Frontend](#configuração-do-frontend)

---

## 1. Autenticação

A autenticação é gerenciada automaticamente pelo Supabase usando a tabela `auth.users`.

### Configuração:
1. Navegue até **Authentication → Providers** no dashboard do Supabase
2. Habilite o provider **Email**
3. Opcional: Habilite providers sociais (Google, Apple, etc.)
4. Configure templates de email em **Authentication → Settings**

### URLs de Redirecionamento:
Configure em **Authentication → URL Configuration**:
- **Site URL**: URL da sua aplicação
- **Redirect URLs**: Adicione URLs de preview e produção

---

## 2. Tabelas do Banco de Dados

As tabelas já estão criadas no banco de dados. Aqui está o schema completo:

### ENUMS
```sql
CREATE TYPE public.user_role AS ENUM ('user', 'creator', 'developer');
CREATE TYPE public.transaction_type AS ENUM ('purchase', 'reward', 'subscription', 'refund', 'credit_purchase', 'payout');
CREATE TYPE public.media_type AS ENUM ('image', 'video');
CREATE TYPE public.payout_status AS ENUM ('pending', 'completed', 'failed');
```

### Tabelas Principais

**profiles** - Perfis públicos dos usuários
**subscription_plans** - Planos de assinatura disponíveis
**user_subscriptions** - Assinaturas ativas dos usuários
**content_items** - Conteúdo criado pelos criadores
**credit_packages** - Pacotes de créditos para compra
**external_payments** - Pagamentos via Stripe, Mercado Pago, LivePix
**transactions** - Histórico de transações de créditos
**media** - Arquivos de mídia vinculados ao conteúdo
**unlocked_content** - Conteúdo desbloqueado por usuários
**followers** - Relacionamento seguidor/seguindo
**likes** - Curtidas em conteúdo
**shares** - Compartilhamentos
**reactions** - Reações com emoji
**payouts** - Solicitações de saque dos criadores

---

## 3. Storage

### Buckets Configurados:

1. **profile-pictures** (público)
   - Fotos de perfil dos usuários
   - Acesso público para visualização

2. **content-media** (privado)
   - Mídia dos criadores (fotos/vídeos)
   - Acesso controlado por RLS
   - Somente usuários que desbloquearam o conteúdo podem ver

---

## 4. Row Level Security (RLS)

Todas as tabelas possuem RLS habilitado com políticas apropriadas:

- **profiles**: Leitura pública, usuários podem atualizar apenas seu próprio perfil
- **content_items**: Apenas conteúdo não oculto visível, criadores gerenciam seu próprio conteúdo
- **media**: Apenas usuários que desbloquearam podem ver, criadores gerenciam suas mídias
- **unlocked_content**: Usuários veem apenas seu próprio conteúdo desbloqueado
- **transactions**: Usuários veem apenas suas próprias transações
- **Social features** (likes, shares, reactions, followers): Acesso completo para usuários autenticados
- **subscription_plans, credit_packages**: Leitura pública

---

## 5. Funções e Triggers

### handle_new_user()
Cria automaticamente um perfil quando um novo usuário se registra.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, vitrine_slug)
  VALUES (
    new.id,
    'user' || substr(new.id::text, 1, 8),
    'user-' || substr(new.id::text, 1, 8)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### purchase_content(item_id UUID)
Processa compra de conteúdo de forma segura no servidor.

**Funcionalidades:**
- Verifica saldo suficiente
- Deduz créditos do comprador
- Adiciona ganhos ao criador (com comissão de 50%)
- Desbloqueia conteúdo
- Registra transação

**Uso:**
```typescript
const { data, error } = await supabase.rpc('purchase_content', {
  item_id: 'content-uuid'
});
```

---

## 6. Edge Functions

### 🔷 stripe-webhook
**Path:** `supabase/functions/stripe-webhook/index.ts`

**Função:** Processa webhooks do Stripe

**Eventos tratados:**
- `checkout.session.completed` - Adiciona créditos após compra
- `customer.subscription.created/updated` - Gerencia assinaturas
- `customer.subscription.deleted` - Cancela assinatura

**Secrets necessários:**
- `STRIPE_SECRET_KEY` ✅
- `STRIPE_WEBHOOK_SECRET` ✅

**URL do Webhook:**
```
https://cpggicxvmgyljvoxlpnu.supabase.co/functions/v1/stripe-webhook
```

---

### 🔷 mercadopago-webhook  
**Path:** `supabase/functions/mercadopago-webhook/index.ts`

**Função:** Processa webhooks do Mercado Pago (PIX)

**Eventos tratados:**
- `payment.approved` - Adiciona créditos
- `payment.rejected/cancelled` - Registra falha

**Secrets necessários:**
- `MERCADOPAGO_ACCESS_TOKEN` ✅

**URL do Webhook:**
```
https://cpggicxvmgyljvoxlpnu.supabase.co/functions/v1/mercadopago-webhook
```

---

### 🔷 create-pix-payment
**Path:** `supabase/functions/create-pix-payment/index.ts`

**Função:** Cria pagamento PIX via API do Mercado Pago

**Retorna:**
- QR Code em base64
- Código PIX copia e cola
- ID do pagamento

**Uso:**
```typescript
const { data } = await supabase.functions.invoke('create-pix-payment', {
  body: {
    amount: 10.00,
    credits: 100,
    userId: user.id
  }
});
```

---

## 7. Integrações de Pagamento

### 💳 Stripe

**Chaves:**
- **Secret Key:** `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`
- **Public Key:** `pk_live_51QOMivKg4NAdmMglJPmORiI4jlIBKRf4beqR4eaxJx0xZWHz13eTD8KgSdWWizgnzepLs0PcGF35fx9TTSBPIaYR00E5EFl6ZZ`

**Produtos de Créditos:**
```
100 créditos   - $1    - prod_SyYehlUkfzq9Qn
200 créditos   - $2    - prod_SyYasByos1peGR
500 créditos   - $5    - prod_SyYeStqRDuWGFF
1000 créditos  - $10   - prod_SyYfzJ1fjz9zb9
2500 créditos  - $25   - prod_SyYmVrUetdiIBY
5000 créditos  - $50   - prod_SyYg54VfiOr7LQ
10000 créditos - $100  - prod_SyYhva8A2beAw6
```

**Planos de Assinatura:**
```
Free Plan  - $0   - prod_SyYChoQJbIb1ye
Basic Plan - $9   - prod_SyYK31lYwaraZW
Pro Plan   - $15  - prod_SyYMs3lMIhORSP
VIP Plan   - $25  - (adicionar ID se necessário)
```

---

### 💰 Mercado Pago (PIX)

**Credenciais:**
- **Public Key:** `APP_USR-4b0a99f3-dc4f-4d33-8f08-12354f51951f`
- **Access Token:** `APP_USR-2788550269284837-082514-7c59a29754c79ba60b1bd71d37d4647d-771121179`
- **Client Secret:** `ofXe7rw7yjFbOWGLYAy5bzlOHUWGxFZ4`
- **Client ID:** `2788550269284837`

**Taxa de Conversão:** R$ 1,00 = 10 créditos

**Webhook URL:**
```
https://cpggicxvmgyljvoxlpnu.supabase.co/functions/v1/mercadopago-webhook
```

---

### 💸 LivePix

**API Key:** `72eaf585-19a4-46d6-8c84-0c14e2738e16`

**Widget Embed:**
```html
<iframe src="https://widget.livepix.gg/embed/782d9bf9-cb99-4196-b9c2-cfa6a14b4d64"></iframe>
```

**URL:** https://livepix.gg/faala

---

## 8. Configuração do Frontend

### Variáveis de Ambiente

Arquivo `.env` já está configurado:
```env
VITE_SUPABASE_PROJECT_ID="cpggicxvmgyljvoxlpnu"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZ2dpY3h2bWd5bGp2b3hscG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDMxMjMsImV4cCI6MjA3NzU3OTEyM30.swv-8-C-45rFA2503gnnPE424LVrSwWVeO3QDsNHZQw"
VITE_SUPABASE_URL="https://cpggicxvmgyljvoxlpnu.supabase.co"
```

### Cliente Supabase

O cliente já está configurado em `src/integrations/supabase/client.ts`.

**Uso:**
```typescript
import { supabase } from '@/integrations/supabase/client';

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'senha123'
});

// Registrar
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'senha123'
});

// Logout
await supabase.auth.signOut();
```

---

## 📱 Outras Integrações

### Google Gemini AI
**API Key:** `AIzaSyAvecfgEHN0jwwmE5Z2oignUFPt0MOCG-w`

### Google AdMob (Android)
**App ID:** `ca-app-pub-9940279518295431~8194670508`
**Rewarded Ad Unit:** `ca-app-pub-9940279518295431/6202931980`

---

## ✅ Status da Implementação

### Backend (Supabase) ✅ COMPLETO
- [x] Tabelas criadas e configuradas
- [x] RLS policies implementadas
- [x] Funções e triggers funcionando
- [x] Storage buckets configurados
- [x] Edge functions criadas:
  - [x] stripe-webhook
  - [x] mercadopago-webhook
  - [x] create-pix-payment
- [x] Secrets configurados
- [x] Integrações de pagamento conectadas

### Frontend ⚠️ PENDENTE
- [ ] Substituir sistema mock por autenticação real do Supabase
- [ ] Integrar tela de login com supabase.auth
- [ ] Conectar pagamentos Stripe no frontend
- [ ] Conectar pagamentos PIX/Mercado Pago no frontend
- [ ] Migrar gerenciamento de créditos para o banco de dados
- [ ] Implementar sincronização de dados em tempo real

---

## 🚀 Próximos Passos

### 1. **URGENTE: Adicionar script build:dev**
Abra `package.json` e adicione na seção "scripts":
```json
"build:dev": "vite build --mode development"
```

### 2. Implementar Autenticação Real
- Substituir Login.tsx para usar `supabase.auth`
- Criar hooks de autenticação
- Implementar persistência de sessão

### 3. Conectar Pagamentos
- Implementar checkout Stripe no frontend
- Integrar geração de PIX com edge function
- Adicionar verificação de status de pagamento

### 4. Migrar Dados Mock
- Substituir context mock por queries Supabase
- Implementar CRUD de conteúdo
- Sincronizar perfis e créditos

---

## 📚 Links Úteis

- **Supabase Dashboard:** https://supabase.com/dashboard/project/cpggicxvmgyljvoxlpnu
- **SQL Editor:** https://supabase.com/dashboard/project/cpggicxvmgyljvoxlpnu/sql/new
- **Auth Config:** https://supabase.com/dashboard/project/cpggicxvmgyljvoxlpnu/auth/providers
- **Edge Functions:** https://supabase.com/dashboard/project/cpggicxvmgyljvoxlpnu/functions
- **Storage:** https://supabase.com/dashboard/project/cpggicxvmgyljvoxlpnu/storage/buckets