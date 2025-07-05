
-- Verificar se existe perfil para o usuário e criar se necessário
INSERT INTO public.profiles (id, email, name, role, subscription_status)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', 'Guilherme Lima') as name,
  'admin' as role,
  'active' as subscription_status
FROM auth.users 
WHERE email = 'guih524@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.users.id
  );

-- Garantir que o usuário tem role admin (caso o perfil já exista)
UPDATE public.profiles 
SET role = 'admin', subscription_status = 'active' 
WHERE email = 'guih524@gmail.com';
