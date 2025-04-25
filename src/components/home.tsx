import React, { useState } from "react";
import { Sun, Moon, User, Settings, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import Sidebar from "./Sidebar";
import SearchPanel from "./SearchPanel";
import DocumentViewer from "./DocumentViewer";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real implementation, this would update the document class or theme context
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleDocumentSelect = (documentId: string) => {
    setSelectedDocument(documentId);
    setActiveTab("view");
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-background ${darkMode ? "dark" : ""}`}
    >
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">IURIS</span>
              <span className="text-sm text-muted-foreground">
                Biblioteca Digital de Legislação Moçambicana
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Modo Escuro</span>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=lawyer"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`${sidebarCollapsed ? "w-0 -ml-80" : "w-80"} transition-all duration-300 border-r bg-background overflow-y-auto`}
        >
          <Sidebar onDocumentSelect={handleDocumentSelect} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container p-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Navegar</TabsTrigger>
                <TabsTrigger value="search">Pesquisar</TabsTrigger>
                <TabsTrigger value="view">Visualizar</TabsTrigger>
              </TabsList>
              <TabsContent value="browse" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      Categorias Populares
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        "Constitucional",
                        "Civil",
                        "Penal",
                        "Administrativo",
                        "Comercial",
                        "Trabalhista",
                      ].map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          className="h-24 text-lg justify-start p-4 flex flex-col items-start"
                          onClick={() =>
                            handleDocumentSelect(`${category}-001`)
                          }
                        >
                          <span>{category}</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Legislação {category}
                          </span>
                        </Button>
                      ))}
                    </div>

                    <h2 className="text-2xl font-bold mt-8 mb-4">
                      Documentos Recentes
                    </h2>
                    <div className="space-y-2">
                      {[
                        "Lei de Bases do Sistema Tributário",
                        "Código Penal de Moçambique",
                        "Constituição da República de Moçambique",
                        "Lei do Trabalho",
                        "Código Comercial",
                      ].map((doc, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleDocumentSelect(`doc-${index}`)}
                        >
                          <div className="font-medium">{doc}</div>
                          <div className="text-sm text-muted-foreground">
                            Acessado em 12/06/2023
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="search" className="mt-4">
                <SearchPanel onDocumentSelect={handleDocumentSelect} />
              </TabsContent>
              <TabsContent value="view" className="mt-4">
                {selectedDocument ? (
                  <DocumentViewer documentId={selectedDocument} />
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Search size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium">
                      Nenhum documento selecionado
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Selecione um documento da biblioteca ou use a pesquisa
                      para encontrar legislação específica.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex items-center justify-between h-12 px-4">
          <div className="text-sm text-muted-foreground">
            © 2023 IURIS - Todos os direitos reservados
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Ajuda
            </Button>
            <Button variant="ghost" size="sm">
              Termos
            </Button>
            <Button variant="ghost" size="sm">
              Privacidade
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
