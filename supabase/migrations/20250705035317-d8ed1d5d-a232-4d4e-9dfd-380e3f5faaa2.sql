
-- Tornar o usuário guih524@gmail.com um administrador
UPDATE public.profiles 
SET role = 'admin', subscription_status = 'active' 
WHERE email = 'guih524@gmail.com';
