-- Update credit packages with Stripe product IDs
UPDATE credit_packages SET stripe_product_id = 'prod_SyYehlUkfzq9Qn' WHERE id = '100-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYasByos1peGR' WHERE id = '200-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYeStqRDuWGFF' WHERE id = '500-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYfzJ1fjz9zb9' WHERE id = '1000-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYg54VfiOr7LQ' WHERE id = '5000-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYhva8A2beAw6' WHERE id = '10000-credits';
UPDATE credit_packages SET stripe_product_id = 'prod_SyYmVrUetdiIBY' WHERE id = '2500-credits';

-- Update subscription plans with Stripe product IDs
UPDATE subscription_plans SET stripe_product_id = 'prod_SyYChoQJbIb1ye' WHERE id = 'free';
UPDATE subscription_plans SET stripe_product_id = 'prod_SyYK31lYwaraZW' WHERE id = 'basic';
UPDATE subscription_plans SET stripe_product_id = 'prod_SyYMs3lMIhORSP' WHERE id = 'pro';