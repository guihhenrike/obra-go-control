
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MaterialFiltersProps {
  statusFilter: string;
  obraFilter: string;
  searchTerm: string;
  obras: any[];
  onStatusFilterChange: (value: string) => void;
  onObraFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function MaterialFilters({
  statusFilter,
  obraFilter,
  searchTerm,
  obras,
  onStatusFilterChange,
  onObraFilterChange,
  onSearchTermChange
}: MaterialFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="search">Buscar Material</Label>
        <Input
          id="search"
          placeholder="Digite o nome do material..."
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
            <SelectItem value="Pendente">Pendente</SelectItem>
            <SelectItem value="Comprado">Comprado</SelectItem>
            <SelectItem value="Em Estoque">Em Estoque</SelectItem>
            <SelectItem value="Esgotado">Esgotado</SelectItem>
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
            <SelectItem value="none">Material geral</SelectItem>
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
