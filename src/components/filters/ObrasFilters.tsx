
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ObrasFiltersProps {
  statusFilter: string;
  searchTerm: string;
  onStatusFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function ObrasFilters({
  statusFilter,
  searchTerm,
  onStatusFilterChange,
  onSearchTermChange
}: ObrasFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="search">Buscar Obra</Label>
        <Input
          id="search"
          placeholder="Digite o nome da obra..."
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
            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
            <SelectItem value="Atrasada">Atrasada</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
