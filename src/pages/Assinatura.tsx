
import { CreditCard, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Assinatura = () => {
  const planos = [
    {
      nome: "Básico",
      preco: 49.90,
      periodo: "mês",
      descricao: "Ideal para pequenas obras",
      recursos: [
        "Até 3 obras ativas",
        "10 funcionários",
        "Controle básico de materiais",
        "Relatórios simples",
        "Suporte por email"
      ],
      popular: false
    },
    {
      nome: "Profissional",
      preco: 99.90,
      periodo: "mês",
      descricao: "Para construtoras em crescimento",
      recursos: [
        "Obras ilimitadas",
        "50 funcionários",
        "Controle avançado de materiais",
        "Relatórios completos",
        "Cronograma detalhado",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      nome: "Empresarial",
      preco: 199.90,
      periodo: "mês",
      descricao: "Para grandes construtoras",
      recursos: [
        "Tudo do Profissional",
        "Funcionários ilimitados",
        "Multi-usuários",
        "API de integração",
        "Relatórios personalizados",
        "Suporte dedicado"
      ],
      popular: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-navy">Planos e Assinatura</h1>
        <p className="text-gray-600 mt-2">Escolha o plano ideal para seu negócio</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {planos.map((plano, index) => (
          <Card key={index} className={`relative hover:shadow-lg transition-shadow ${
            plano.popular ? 'border-secondary border-2' : ''
          }`}>
            {plano.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-secondary text-white">
                <Star className="w-3 h-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-navy text-xl">{plano.nome}</CardTitle>
              <CardDescription>{plano.descricao}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-secondary">
                  R$ {plano.preco.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-gray-600">/{plano.periodo}</span>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plano.recursos.map((recurso, recursoIndex) => (
                  <li key={recursoIndex} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{recurso}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plano.popular 
                    ? 'bg-secondary hover:bg-secondary/90' 
                    : 'bg-navy hover:bg-navy/90'
                }`}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Assinar Agora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-navy">Informações de Pagamento</CardTitle>
          <CardDescription>Gerencie seus dados de cobrança e faturas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Plano Atual</h3>
                <p className="text-secondary font-medium">Profissional - R$ 99,90/mês</p>
                <p className="text-sm text-gray-600">Próxima cobrança: 15/04/2024</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Método de Pagamento</h3>
                <p className="text-gray-600">Cartão terminado em ****1234</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Alterar Plano
              </Button>
              <Button variant="outline" className="w-full">
                Atualizar Pagamento
              </Button>
              <Button variant="outline" className="w-full">
                Ver Faturas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Assinatura;
