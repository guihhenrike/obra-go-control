
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EquipeFiltersProps {
  cargoFilter: string;
  searchTerm: string;
  onCargoFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function EquipeFilters({
  cargoFilter,
  searchTerm,
  onCargoFilterChange,
  onSearchTermChange
}: EquipeFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <Label htmlFor="search">Buscar Funcionário</Label>
        <Input
          id="search"
          placeholder="Digite o nome do funcionário..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="cargo">Filtrar por Cargo</Label>
        <Select value={cargoFilter} onValueChange={onCargoFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Todos os cargos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            <SelectItem value="Pedreiro">Pedreiro</SelectItem>
            <SelectItem value="Eletricista">Eletricista</SelectItem>
            <SelectItem value="Encanador">Encanador</SelectItem>
            <SelectItem value="Pintor">Pintor</SelectItem>
            <SelectItem value="Servente">Servente</SelectItem>
            <SelectItem value="Mestre de Obras">Mestre de Obras</SelectItem>
            <SelectItem value="Engenheiro">Engenheiro</SelectItem>
            <SelectItem value="Arquiteto">Arquiteto</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
