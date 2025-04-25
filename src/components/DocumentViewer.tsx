import React, { useState, useRef } from "react";
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

interface Annotation {
  id: string;
  text: string;
  type: string;
  page: number;
  comment?: string;
  refDocId?: string;
  refDocTitle?: string;
  createdAt: string;
  position?: {
    x: number;
    y: number;
  };
}

const DocumentViewer = ({
  documentUrl = "https://images.unsplash.com/photo-1586880244406-8b245be7f5af?w=800&q=80",
  documentTitle = "Constituição da República de Moçambique",
  documentType = "Constitucional",
  isOffline = false,
  documentId = "constitution-moz",
}: DocumentViewerProps) => {
  const documentRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(42); // This would be determined from the actual document
  const [isAnnotating, setIsAnnotating] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [annotationType, setAnnotationType] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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

  // Load annotations from localStorage when component mounts
  React.useEffect(() => {
    const savedAnnotations = localStorage.getItem(`annotations-${documentId}`);
    if (savedAnnotations) {
      try {
        const parsedAnnotations = JSON.parse(savedAnnotations);
        setAnnotations(parsedAnnotations);
        console.log(`Loaded annotations for ${documentId}:`, parsedAnnotations);
      } catch (error) {
        console.error("Error loading annotations:", error);
      }
    } else {
      // Initialize with some sample annotations if none exist
      const sampleAnnotations = [
        {
          id: "sample-1",
          text: "A República de Moçambique é um Estado independente",
          type: "highlight",
          page: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: "sample-2",
          text: "PRINCÍPIOS FUNDAMENTAIS",
          type: "bookmark",
          page: 1,
          createdAt: new Date().toISOString(),
        },
      ];
      setAnnotations(sampleAnnotations);
      localStorage.setItem(
        `annotations-${documentId}`,
        JSON.stringify(sampleAnnotations),
      );
      console.log(`Created sample annotations for ${documentId}`);
    }
  }, [documentId]);

  const createAnnotation = (
    comment?: string,
    refDocId?: string,
    refDocTitle?: string,
  ) => {
    if (!selectedText || !annotationType) return;

    // Get the current selection position if available
    let position = undefined;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const docRect = documentRef.current?.getBoundingClientRect();

      if (docRect) {
        position = {
          x: rect.left - docRect.left + documentRef.current?.scrollLeft || 0,
          y: rect.top - docRect.top + documentRef.current?.scrollTop || 0,
        };
      }
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: selectedText,
      type: annotationType,
      page: currentPage,
      comment,
      refDocId,
      refDocTitle,
      createdAt: new Date().toISOString(),
      position,
    };

    // Update annotations state immediately to trigger re-render
    const updatedAnnotations = [...annotations, newAnnotation];
    setAnnotations(updatedAnnotations);

    // Save to localStorage
    localStorage.setItem(
      `annotations-${documentId}`,
      JSON.stringify(updatedAnnotations),
    );

    console.log("New annotation created:", newAnnotation);
    console.log("Updated annotations:", updatedAnnotations);

    setIsAnnotating(false);
    setSelectedText("");
    setAnnotationType(null);
    window.getSelection()?.removeAllRanges();
  };

  const deleteAnnotation = (annotationId: string) => {
    const updatedAnnotations = annotations.filter(
      (annotation) => annotation.id !== annotationId,
    );
    setAnnotations(updatedAnnotations);

    // Update localStorage
    localStorage.setItem(
      `annotations-${documentId}`,
      JSON.stringify(updatedAnnotations),
    );
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

      <AnnotationToolbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onHighlight={() => {
          setIsAnnotating(true);
          setAnnotationType("highlight");
          setSelectedText(window.getSelection()?.toString() || "");
        }}
        onComment={() => {
          setIsAnnotating(true);
          setAnnotationType("comment");
          setSelectedText(window.getSelection()?.toString() || "");
        }}
        onBookmark={() => {
          setIsAnnotating(true);
          setAnnotationType("bookmark");
          setSelectedText(window.getSelection()?.toString() || "");
        }}
        onReference={() => {
          setIsAnnotating(true);
          setAnnotationType("reference");
          setSelectedText(window.getSelection()?.toString() || "");
        }}
        onTextSizeChange={(size) => setZoomLevel(size)}
        textSize={zoomLevel}
      />

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
                ref={documentRef}
                className="relative p-4"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top left",
                  minHeight: `${100 * (100 / zoomLevel)}%`,
                }}
                onMouseUp={() => {
                  const selection = window.getSelection();
                  if (selection && selection.toString().trim().length > 0) {
                    setSelectedText(selection.toString().trim());
                  }
                }}
              >
                {isAnnotating && selectedText && (
                  <div className="fixed bottom-4 right-4 bg-background border shadow-lg p-4 rounded-lg z-50 w-80">
                    <h4 className="font-medium mb-2">
                      {annotationType === "highlight" && "Destacar Texto"}
                      {annotationType === "comment" && "Adicionar Comentário"}
                      {annotationType === "bookmark" && "Adicionar Marcador"}
                      {annotationType === "reference" && "Criar Referência"}
                    </h4>
                    <p className="text-sm italic mb-2 border-l-2 border-primary pl-2">
                      "{selectedText}"
                    </p>

                    {annotationType === "comment" && (
                      <textarea
                        className="w-full p-2 border rounded-md mb-2 text-sm"
                        placeholder="Digite seu comentário aqui..."
                        rows={3}
                        id="annotation-comment"
                      />
                    )}

                    {annotationType === "reference" && (
                      <div className="mb-2">
                        <select
                          className="w-full p-2 border rounded-md text-sm mb-1"
                          id="reference-document"
                        >
                          <option value="">Selecione um documento</option>
                          <option value="doc-1">Lei de Terras</option>
                          <option value="doc-2">Código Comercial</option>
                          <option value="doc-3">Lei de Minas</option>
                        </select>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsAnnotating(false);
                          setSelectedText("");
                          setAnnotationType(null);
                          window.getSelection()?.removeAllRanges();
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          let comment;
                          let refDocId;
                          let refDocTitle;

                          if (annotationType === "comment") {
                            const commentEl = document.getElementById(
                              "annotation-comment",
                            ) as HTMLTextAreaElement;
                            comment = commentEl?.value;
                          } else if (annotationType === "reference") {
                            const refEl = document.getElementById(
                              "reference-document",
                            ) as HTMLSelectElement;
                            refDocId = refEl?.value;
                            refDocTitle =
                              refEl?.options[refEl?.selectedIndex]?.text;
                          }

                          createAnnotation(comment, refDocId, refDocTitle);
                        }}
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                )}
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
                    <h2 className="text-xl font-semibold mb-4 relative group">
                      <span className="relative inline-block">
                        TÍTULO I - PRINCÍPIOS FUNDAMENTAIS
                        {annotations
                          .filter(
                            (a) =>
                              a.text.includes("PRINCÍPIOS FUNDAMENTAIS") &&
                              a.page === currentPage,
                          )
                          .map((annotation) => (
                            <span
                              key={annotation.id}
                              className="absolute -left-6 top-0 text-primary"
                              title={`Anotação: ${annotation.type}`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                              </svg>
                            </span>
                          ))}
                      </span>
                    </h2>
                    <h3 className="text-lg font-medium mb-2 relative group">
                      ARTIGO 1 - (República de Moçambique)
                      {annotations.some(
                        (a) =>
                          a.text.includes("República de Moçambique") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </h3>
                    <p className="mb-4 relative group">
                      A República de Moçambique é um Estado independente,
                      soberano, democrático e de justiça social.
                      {annotations.some(
                        (a) =>
                          a.text.includes("Estado independente") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </p>

                    <h3 className="text-lg font-medium mb-2 relative group">
                      ARTIGO 2 - (Soberania e legalidade)
                      {annotations.some(
                        (a) =>
                          a.text.includes("Soberania e legalidade") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </h3>
                    <p className="mb-4 relative group">
                      1. A soberania reside no povo.
                      {annotations.some(
                        (a) =>
                          a.text.includes("soberania reside") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </p>
                    <p className="mb-4 relative group">
                      2. O povo moçambicano exerce a soberania segundo as formas
                      fixadas na Constituição.
                      {annotations.some(
                        (a) =>
                          a.text.includes("povo moçambicano") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </p>
                    <p className="mb-4 relative group">
                      3. O Estado subordina-se à Constituição e funda-se na
                      legalidade.
                      {annotations.some(
                        (a) =>
                          a.text.includes("Estado subordina-se") &&
                          a.page === currentPage,
                      ) && (
                        <span
                          className="absolute -left-6 top-0 text-primary"
                          title="Anotação existente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                          </svg>
                        </span>
                      )}
                    </p>
                    <p className="mb-4 relative group">
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
                  {annotations.length > 0 ? (
                    annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {annotation.type === "highlight" && "Destaque"}
                            {annotation.type === "comment" && "Comentário"}
                            {annotation.type === "bookmark" && "Marcador"}
                            {annotation.type === "reference" && "Referência"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Pág. {annotation.page}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteAnnotation(annotation.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-500"
                              >
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              </svg>
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm italic">
                          "{annotation.text}"
                        </p>
                        {annotation.comment && (
                          <p className="mt-1 text-sm">{annotation.comment}</p>
                        )}
                        {annotation.refDocTitle && (
                          <p className="mt-1 text-sm">
                            Referência: {annotation.refDocTitle}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhuma anotação encontrada.
                    </p>
                  )}
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
