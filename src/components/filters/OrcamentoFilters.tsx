
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrcamentoFiltersProps {
  statusFilter: string;
  searchTerm: string;
  onStatusFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function OrcamentoFilters({
  statusFilter,
  searchTerm,
  onStatusFilterChange,
  onSearchTermChange
}: OrcamentoFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="search">Buscar por Número do Orçamento</Label>
        <Input
          id="search"
          placeholder="Digite o número do orçamento..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="status">Filtrar por Status</Label>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
            <SelectItem value="Enviado">Enviado</SelectItem>
            <SelectItem value="Aceito">Aceito</SelectItem>
            <SelectItem value="Recusado">Recusado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
