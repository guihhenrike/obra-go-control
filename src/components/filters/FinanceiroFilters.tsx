
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FinanceiroFiltersProps {
  tipoFilter: string;
  obraFilter: string;
  searchTerm: string;
  obras: any[];
  onTipoFilterChange: (value: string) => void;
  onObraFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function FinanceiroFilters({
  tipoFilter,
  obraFilter,
  searchTerm,
  obras,
  onTipoFilterChange,
  onObraFilterChange,
  onSearchTermChange
}: FinanceiroFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="search">Buscar por Obra</Label>
        <Input
          id="search"
          placeholder="Digite o nome da obra..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="tipo">Filtrar por Tipo</Label>
        <Select value={tipoFilter} onValueChange={onTipoFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="receita">Receitas</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="obra">Filtrar por Obra</Label>
        <Select value={obraFilter} onValueChange={onObraFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as obras" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as obras</SelectItem>
            <SelectItem value="none">Sem obra específica</SelectItem>
            {obras
              .sort((a, b) => a.nome.localeCompare(b.nome))
              .map((obra) => (
                <SelectItem key={obra.id} value={obra.id}>
                  {obra.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
