import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download, Star, Clock, Search } from "lucide-react";
import { legalDocuments, LegalDocument } from "@/data/documents";

interface DocumentLibraryProps {
  onSelectDocument: (documentId: string) => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  onSelectDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    "Constitucional",
    "Civil",
    "Penal",
    "Administrativo",
    "Comercial",
    "Trabalhista",
  ];

  const filteredDocuments = legalDocuments.filter((doc) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory =
      activeCategory === null || doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const renderDocumentCard = (document: LegalDocument) => (
    <Card
      key={document.id}
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => onSelectDocument(document.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-primary mt-1" />
          <div className="flex-1">
            <h3 className="font-medium">{document.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {document.description}
            </p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline">{document.type}</Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(document.datePublished).toLocaleDateString("pt-MZ")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>Biblioteca de Legislação</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar legislação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs defaultValue="all" className="h-full flex flex-col">
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="recent">Recentes</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="all" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map(renderDocumentCard)
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum documento encontrado.
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="categories" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          activeCategory === category ? "default" : "outline"
                        }
                        className="h-24 text-lg justify-start p-4 flex flex-col items-start"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <span>{category}</span>
                        <span className="text-xs text-muted-foreground mt-2">
                          Legislação {category}
                        </span>
                      </Button>
                    ))}
                  </div>

                  {activeCategory && (
                    <div className="space-y-4 mt-6">
                      <h3 className="font-medium">
                        Documentos em {activeCategory}
                      </h3>
                      {legalDocuments
                        .filter((doc) => doc.category === activeCategory)
                        .map(renderDocumentCard)}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="favorites" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">
                      Nenhum favorito ainda
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Adicione documentos aos favoritos para acesso rápido.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="recent" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Histórico vazio</h3>
                    <p className="text-muted-foreground mt-2">
                      Os documentos visualizados recentemente aparecerão aqui.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentLibrary;
