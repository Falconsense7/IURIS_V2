import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AnnotationToolbar from "./AnnotationToolbar";
import {
  Download,
  Share2,
  Bookmark,
  Eye,
  FileText,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface DocumentViewerProps {
  documentUrl?: string;
  documentTitle?: string;
  documentType?: string;
  isOffline?: boolean;
}

const DocumentViewer = ({
  documentUrl = "https://images.unsplash.com/photo-1586880244406-8b245be7f5af?w=800&q=80",
  documentTitle = "Constituição da República de Moçambique",
  documentType = "Constitucional",
  isOffline = false,
}: DocumentViewerProps) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(42); // This would be determined from the actual document

  const handleZoomChange = (value: number[]) => {
    setZoomLevel(value[0]);
  };

  const increaseZoom = () => {
    setZoomLevel(Math.min(zoomLevel + 10, 200));
  };

  const decreaseZoom = () => {
    setZoomLevel(Math.max(zoomLevel - 10, 50));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Card
      className={`w-full h-full overflow-hidden flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-white"}`}
    >
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{documentTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {documentType} • Página {currentPage} de {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Salvar para acesso offline</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Compartilhar documento</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar aos favoritos</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDarkMode}
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? "Modo claro" : "Modo escuro"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <AnnotationToolbar />

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="document" className="h-full">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <TabsList>
              <TabsTrigger value="document">Documento</TabsTrigger>
              <TabsTrigger value="annotations">Anotações</TabsTrigger>
              <TabsTrigger value="references">Referências</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={decreaseZoom}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="w-32">
                <Slider
                  value={[zoomLevel]}
                  min={50}
                  max={200}
                  step={10}
                  onValueChange={handleZoomChange}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={increaseZoom}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <span className="text-sm">{zoomLevel}%</span>
            </div>
          </div>

          <TabsContent value="document" className="h-full p-0 m-0">
            <ScrollArea className="h-full">
              <div
                className="relative p-4"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top left",
                  minHeight: `${100 * (100 / zoomLevel)}%`,
                }}
              >
                {/* This would be replaced with an actual PDF viewer component */}
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">
                      CONSTITUIÇÃO DA REPÚBLICA DE MOÇAMBIQUE
                    </h1>
                    <p className="text-sm text-gray-500">
                      Aprovada pela Assembleia da República, 16 de Novembro de
                      2004
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">PREÂMBULO</h2>
                    <p className="mb-4">
                      A Luta Armada de Libertação Nacional, respondendo aos
                      anseios seculares do nosso Povo, aglutinou todas as
                      camadas patrióticas da sociedade moçambicana num mesmo
                      ideal de liberdade, unidade, justiça e progresso e fundou
                      o Estado moçambicano, alicerce para a edificação de uma
                      nação próspera.
                    </p>
                    <p className="mb-4">
                      A Constituição de 1990 introduziu o Estado de Direito
                      Democrático, alicerçado na separação e interdependência
                      dos poderes e no pluralismo, lançando os parâmetros
                      estruturais da modernização, contribuindo de forma
                      decisiva para a instauração de um clima democrático que
                      levou o país à realização das primeiras eleições
                      multipartidárias.
                    </p>
                    <p className="mb-4">
                      A presente Constituição reafirma, desenvolve e aprofunda
                      os princípios fundamentais do Estado moçambicano, consagra
                      o carácter soberano do Estado de Direito Democrático,
                      baseado no pluralismo de expressão, organização partidária
                      e no respeito e garantia dos direitos e liberdades
                      fundamentais dos cidadãos.
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                      TÍTULO I - PRINCÍPIOS FUNDAMENTAIS
                    </h2>
                    <h3 className="text-lg font-medium mb-2">
                      ARTIGO 1 - (República de Moçambique)
                    </h3>
                    <p className="mb-4">
                      A República de Moçambique é um Estado independente,
                      soberano, democrático e de justiça social.
                    </p>

                    <h3 className="text-lg font-medium mb-2">
                      ARTIGO 2 - (Soberania e legalidade)
                    </h3>
                    <p className="mb-4">1. A soberania reside no povo.</p>
                    <p className="mb-4">
                      2. O povo moçambicano exerce a soberania segundo as formas
                      fixadas na Constituição.
                    </p>
                    <p className="mb-4">
                      3. O Estado subordina-se à Constituição e funda-se na
                      legalidade.
                    </p>
                    <p className="mb-4">
                      4. As normas constitucionais prevalecem sobre todas as
                      restantes normas do ordenamento jurídico.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="annotations" className="h-full">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Suas Anotações</h3>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Destaque</span>
                      <span className="text-xs text-muted-foreground">
                        Pág. 1
                      </span>
                    </div>
                    <p className="mt-2 text-sm italic">
                      "A República de Moçambique é um Estado independente,
                      soberano, democrático e de justiça social."
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Artigo 1 - Princípios Fundamentais
                    </p>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Comentário</span>
                      <span className="text-xs text-muted-foreground">
                        Pág. 2
                      </span>
                    </div>
                    <p className="mt-2 text-sm italic">
                      "A soberania reside no povo."
                    </p>
                    <p className="mt-1 text-sm">
                      Importante princípio democrático que fundamenta todo o
                      sistema constitucional.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Artigo 2, Item 1 - Soberania e legalidade
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="references" className="h-full">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Referências Cruzadas</h3>
                <div className="space-y-4">
                  <div className="p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        Lei de Organização Política do Estado
                      </span>
                    </div>
                    <p className="mt-2 text-sm">
                      Artigo 5 - Relacionado com os princípios fundamentais da
                      República
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 p-0 h-auto"
                    >
                      Ver documento
                    </Button>
                  </div>

                  <div className="p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Lei Eleitoral</span>
                    </div>
                    <p className="mt-2 text-sm">
                      Artigo 3 - Implementação do princípio da soberania popular
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-1 p-0 h-auto"
                    >
                      Ver documento
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-2 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Próxima
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch id="offline-mode" checked={isOffline} />
            <Label htmlFor="offline-mode">Modo Offline</Label>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Opções de visualização</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default DocumentViewer;
