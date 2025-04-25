import React, { useState } from "react";
import { Search, Filter, Calendar, X, History, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface SearchPanelProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
}

interface SearchFilters {
  documentType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  keywords: string[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onSearch = () => {} }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    documentType: "all",
    startDate: undefined,
    endDate: undefined,
    keywords: [],
  });
  const [keyword, setKeyword] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for search history and popular searches
  const searchHistory = [
    "Lei de Terras",
    "Código Penal 2019",
    "Constituição da República",
    "Lei do Trabalho",
  ];

  const popularSearches = [
    "Código Civil",
    "Lei Eleitoral",
    "Direito Administrativo",
    "Código Comercial",
  ];

  const documentTypes = [
    { value: "all", label: "Todos os Documentos" },
    { value: "law", label: "Leis" },
    { value: "decree", label: "Decretos" },
    { value: "regulation", label: "Regulamentos" },
    { value: "constitution", label: "Constituição" },
    { value: "jurisprudence", label: "Jurisprudência" },
  ];

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const addKeyword = () => {
    if (keyword && !filters.keywords.includes(keyword)) {
      setFilters({
        ...filters,
        keywords: [...filters.keywords, keyword],
      });
      setKeyword("");
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFilters({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== keywordToRemove),
    });
  };

  const clearFilters = () => {
    setFilters({
      documentType: "all",
      startDate: undefined,
      endDate: undefined,
      keywords: [],
    });
  };

  return (
    <div className="w-full bg-background p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-4">
        {/* Main search input */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar legislação moçambicana..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Pesquisar</Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Filters section */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-2">
            {/* Document type filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tipo de Documento
              </label>
              <Select
                value={filters.documentType}
                onValueChange={(value) =>
                  setFilters({ ...filters, documentType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date range filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">Período</label>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.startDate ? (
                        filters.startDate.toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">
                          Data inicial
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.startDate}
                      onSelect={(date) =>
                        setFilters({ ...filters, startDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.endDate ? (
                        filters.endDate.toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground">
                          Data final
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.endDate}
                      onSelect={(date) =>
                        setFilters({ ...filters, endDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Keywords filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Palavras-chave
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Adicionar palavra-chave"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button variant="outline" onClick={addKeyword} size="sm">
                  Adicionar
                </Button>
              </div>
              {filters.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.keywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {kw}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeKeyword(kw)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Filter actions */}
            <div className="md:col-span-3 flex justify-end">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-sm"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}

        {/* Search history and popular searches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <History className="h-4 w-4 mr-2" />
              <span>Pesquisas Recentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSearchQuery(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>Pesquisas Populares</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSearchQuery(item)}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
