
-- Criar tabela de obras
CREATE TABLE public.obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  cliente TEXT NOT NULL,
  endereco TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  previsao_fim DATE NOT NULL,
  orcamento DECIMAL(12,2) NOT NULL,
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  status TEXT NOT NULL DEFAULT 'Em Andamento',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de funcionários
CREATE TABLE public.funcionarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  diaria DECIMAL(8,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de materiais
CREATE TABLE public.materiais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  valor DECIMAL(8,2) NOT NULL,
  fornecedor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cronograma/etapas
CREATE TABLE public.etapas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  progresso INTEGER DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  responsavel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de orçamentos
CREATE TABLE public.orcamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  numero TEXT NOT NULL,
  cliente TEXT NOT NULL,
  obra TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data_criacao DATE NOT NULL DEFAULT CURRENT_DATE,
  validade DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Rascunho',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de transações financeiras
CREATE TABLE public.transacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  obra_id UUID REFERENCES public.obras(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materiais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para obras
CREATE POLICY "Users can view their own obras" ON public.obras FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own obras" ON public.obras FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own obras" ON public.obras FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own obras" ON public.obras FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para funcionários
CREATE POLICY "Users can view their own funcionarios" ON public.funcionarios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own funcionarios" ON public.funcionarios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own funcionarios" ON public.funcionarios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own funcionarios" ON public.funcionarios FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para materiais
CREATE POLICY "Users can view their own materiais" ON public.materiais FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own materiais" ON public.materiais FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own materiais" ON public.materiais FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own materiais" ON public.materiais FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para etapas
CREATE POLICY "Users can view their own etapas" ON public.etapas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own etapas" ON public.etapas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own etapas" ON public.etapas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own etapas" ON public.etapas FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para orçamentos
CREATE POLICY "Users can view their own orcamentos" ON public.orcamentos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orcamentos" ON public.orcamentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orcamentos" ON public.orcamentos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own orcamentos" ON public.orcamentos FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para transações
CREATE POLICY "Users can view their own transacoes" ON public.transacoes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own transacoes" ON public.transacoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transacoes" ON public.transacoes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transacoes" ON public.transacoes FOR DELETE USING (auth.uid() = user_id);
