
-- Adicionar coluna para tipo de remuneração e tornar email opcional
ALTER TABLE public.funcionarios 
ADD COLUMN tipo_remuneracao TEXT NOT NULL DEFAULT 'diaria' CHECK (tipo_remuneracao IN ('diaria', 'salario'));

-- Permitir que email seja nulo
ALTER TABLE public.funcionarios 
ALTER COLUMN email DROP NOT NULL;

-- Adicionar coluna para valor do salário (mesmo campo da diária, mas com contexto diferente)
-- O campo 'diaria' será renomeado para 'valor_remuneracao' para ser mais genérico
ALTER TABLE public.funcionarios 
RENAME COLUMN diaria TO valor_remuneracao;
