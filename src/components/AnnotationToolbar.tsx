import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HighlighterIcon,
  MessageSquareIcon,
  BookmarkIcon,
  LinkIcon,
  Share2Icon,
  DownloadIcon,
  MoonIcon,
  SunIcon,
  TextIcon,
  SaveIcon,
  FileTextIcon,
  FileIcon,
  SettingsIcon,
} from "lucide-react";

interface AnnotationToolbarProps {
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onHighlight?: () => void;
  onComment?: () => void;
  onBookmark?: () => void;
  onReference?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onTextSizeChange?: (value: number) => void;
  textSize?: number;
}

const AnnotationToolbar = ({
  isDarkMode = false,
  onToggleDarkMode = () => {},
  onHighlight = () => {},
  onComment = () => {},
  onBookmark = () => {},
  onReference = () => {},
  onShare = () => {},
  onDownload = () => {},
  onTextSizeChange = () => {},
  textSize = 100,
}: AnnotationToolbarProps) => {
  return (
    <div className="w-full h-16 px-4 py-2 flex items-center justify-between bg-background border-b">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onHighlight}>
                <HighlighterIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Destacar texto</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onComment}>
                <MessageSquareIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar comentário</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onBookmark}>
                <BookmarkIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar marcador</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onReference}>
                <LinkIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Criar referência</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-8 mx-2" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDownload}>
                <DownloadIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Salvar para acesso offline</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Share2Icon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Compartilhar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => window.alert("Exportando como PDF...")}
            >
              <FileTextIcon className="h-4 w-4 mr-2" />
              <span>Exportar como PDF</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.alert("Exportando como Word...")}
            >
              <FileIcon className="h-4 w-4 mr-2" />
              <span>Exportar como Word</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.alert("Exportando como Texto...")}
            >
              <TextIcon className="h-4 w-4 mr-2" />
              <span>Exportar como Texto</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Save annotations to localStorage
                const savedAnnotations =
                  localStorage.getItem("all-annotations");
                const currentDocAnnotations = localStorage.getItem(
                  "annotations-doc-001",
                );

                if (currentDocAnnotations) {
                  try {
                    const allAnnotations = savedAnnotations
                      ? JSON.parse(savedAnnotations)
                      : {};
                    allAnnotations["doc-001"] = JSON.parse(
                      currentDocAnnotations,
                    );
                    localStorage.setItem(
                      "all-annotations",
                      JSON.stringify(allAnnotations),
                    );
                    window.alert("Anotações salvas com sucesso!");
                  } catch (error) {
                    console.error("Error saving annotations:", error);
                    window.alert("Erro ao salvar anotações");
                  }
                } else {
                  window.alert("Nenhuma anotação para salvar");
                }
              }}
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              <span>Salvar anotações</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <TextIcon className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Ajustar tamanho do texto</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="flex items-center space-x-2">
                <TextIcon className="h-4 w-4" />
                <Slider
                  defaultValue={[textSize]}
                  max={200}
                  min={50}
                  step={10}
                  onValueChange={(value) => onTextSizeChange(value[0])}
                  className="w-[200px]"
                />
                <TextIcon className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Tamanho atual: {textSize}%
              </p>
            </div>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <SunIcon className="h-4 w-4" />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={onToggleDarkMode}
                />
                <MoonIcon className="h-4 w-4" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alternar modo escuro</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Configurações</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default AnnotationToolbar;
