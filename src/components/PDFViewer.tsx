import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookmarkIcon, MessageSquareIcon, LinkIcon } from "lucide-react";

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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

interface PDFViewerProps {
  pdfUrl: string;
  onPageChange?: (page: number, totalPages: number) => void;
  zoomLevel?: number;
  documentId?: string;
  annotations?: Annotation[];
  onAnnotationCreate?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  onPageChange,
  zoomLevel = 100,
  documentId = "default-doc",
  annotations = [],
  onAnnotationCreate,
  onAnnotationDelete,
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState<boolean>(false);
  const [selectedText, setSelectedText] = useState<string>("");
  const [annotationType, setAnnotationType] = useState<string | null>(null);
  const [localAnnotations, setLocalAnnotations] =
    useState<Annotation[]>(annotations);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Load annotations from localStorage or props when component mounts
  useEffect(() => {
    if (annotations && annotations.length > 0) {
      setLocalAnnotations(annotations);
    } else {
      const savedAnnotations = localStorage.getItem(
        `annotations-${documentId}`,
      );
      if (savedAnnotations) {
        try {
          setLocalAnnotations(JSON.parse(savedAnnotations));
          console.log(
            `Loaded annotations for ${documentId}:`,
            JSON.parse(savedAnnotations),
          );
        } catch (error) {
          console.error("Error loading annotations:", error);
        }
      }
    }
  }, [documentId, annotations]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    if (onPageChange) {
      onPageChange(pageNumber, numPages);
    }
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Erro ao carregar o documento: ${error.message}`);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    const newPage = pageNumber + offset;
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
      if (onPageChange) {
        onPageChange(newPage, numPages || 1);
      }
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
    }
  };

  const startAnnotation = (type: string) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setSelectedText(selection.toString().trim());
      setAnnotationType(type);
      setIsAnnotating(true);
    } else {
      alert("Selecione um texto para anotar");
    }
  };

  const createAnnotation = (
    comment?: string,
    refDocId?: string,
    refDocTitle?: string,
  ) => {
    if (!selectedText || !annotationType) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: selectedText,
      type: annotationType,
      page: pageNumber,
      comment,
      refDocId,
      refDocTitle,
      createdAt: new Date().toISOString(),
    };

    const updatedAnnotations = [...localAnnotations, newAnnotation];
    setLocalAnnotations(updatedAnnotations);

    // Save to localStorage
    localStorage.setItem(
      `annotations-${documentId}`,
      JSON.stringify(updatedAnnotations),
    );

    // Call parent callback if provided
    if (onAnnotationCreate) {
      onAnnotationCreate(newAnnotation);
    }

    setIsAnnotating(false);
    setSelectedText("");
    setAnnotationType(null);
    window.getSelection()?.removeAllRanges();
  };

  const deleteAnnotation = (annotationId: string) => {
    const updatedAnnotations = localAnnotations.filter(
      (annotation) => annotation.id !== annotationId,
    );
    setLocalAnnotations(updatedAnnotations);

    // Update localStorage
    localStorage.setItem(
      `annotations-${documentId}`,
      JSON.stringify(updatedAnnotations),
    );

    // Call parent callback if provided
    if (onAnnotationDelete) {
      onAnnotationDelete(annotationId);
    }
  };

  // Filter annotations for current page
  const currentPageAnnotations = localAnnotations.filter(
    (annotation) => annotation.page === pageNumber,
  );

  return (
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <Spinner className="h-8 w-8" />
          <span className="ml-2">Carregando documento...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-full text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center p-2 border-b">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => startAnnotation("highlight")}
            title="Destacar texto"
          >
            <span className="mr-2">Destacar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startAnnotation("comment")}
            title="Adicionar comentário"
          >
            <MessageSquareIcon className="h-4 w-4 mr-2" />
            <span>Comentar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startAnnotation("bookmark")}
            title="Adicionar marcador"
          >
            <BookmarkIcon className="h-4 w-4 mr-2" />
            <span>Marcar</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => startAnnotation("reference")}
            title="Criar referência"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            <span>Referência</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div
          ref={pdfContainerRef}
          className="flex flex-col items-center py-4 relative"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "top center",
          }}
          onMouseUp={handleTextSelection}
        >
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Spinner className="h-8 w-8" />}
          >
            <div className="relative">
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="shadow-lg"
              />

              {/* Annotation Markers */}
              {currentPageAnnotations.map((annotation) => {
                // Determine icon based on annotation type
                let Icon = BookmarkIcon;
                let bgColor = "bg-yellow-200";

                if (annotation.type === "comment") {
                  Icon = MessageSquareIcon;
                  bgColor = "bg-blue-200";
                } else if (annotation.type === "reference") {
                  Icon = LinkIcon;
                  bgColor = "bg-green-200";
                }

                return (
                  <div
                    key={annotation.id}
                    className={`absolute right-0 ${bgColor} p-1 rounded-full cursor-pointer z-10`}
                    style={{ top: `${annotation.position?.y || 20}px` }}
                    title={annotation.text}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                );
              })}
            </div>
          </Document>
        </div>
      </ScrollArea>

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
                <option value="lei-terras">Lei de Terras</option>
                <option value="codigo-comercial">Código Comercial</option>
                <option value="codigo-penal">Código Penal</option>
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
                  refDocTitle = refEl?.options[refEl?.selectedIndex]?.text;
                }

                createAnnotation(comment, refDocId, refDocTitle);
              }}
            >
              Salvar
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && numPages && (
        <div className="flex justify-between items-center p-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {pageNumber} de {numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
