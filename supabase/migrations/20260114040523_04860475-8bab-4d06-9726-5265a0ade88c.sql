
-- Atualizar a função handle_new_user para criar assinaturas com status 'pending'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Criar perfil
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Atribuir role de usuário padrão
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Criar assinatura com status PENDENTE (aguardando ativação manual)
  INSERT INTO public.subscriptions (user_id, subscription_type, status, starts_at, expires_at)
  VALUES (
    NEW.id,
    'free_trial',
    'pending',
    NULL,
    NULL
  );
  
  RETURN NEW;
END;
$$;
