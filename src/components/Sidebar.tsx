import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronRight,
  ChevronDown,
  Star,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRightCircle,
} from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  subcategories?: CategoryItem[];
}

interface RecentDocument {
  id: string;
  title: string;
  date: string;
}

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
}: SidebarProps) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    constitutional: true,
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const categories: CategoryItem[] = [
    {
      id: "constitutional",
      name: "Direito Constitucional",
      subcategories: [
        { id: "constitution", name: "Constituição da República" },
        { id: "electoral", name: "Legislação Eleitoral" },
        { id: "fundamental-rights", name: "Direitos Fundamentais" },
      ],
    },
    {
      id: "civil",
      name: "Direito Civil",
      subcategories: [
        { id: "civil-code", name: "Código Civil" },
        { id: "family", name: "Direito de Família" },
        { id: "property", name: "Direito de Propriedade" },
        { id: "contracts", name: "Contratos" },
      ],
    },
    {
      id: "criminal",
      name: "Direito Penal",
      subcategories: [
        { id: "criminal-code", name: "Código Penal" },
        { id: "criminal-procedure", name: "Processo Penal" },
        { id: "special-criminal", name: "Legislação Penal Especial" },
      ],
    },
    {
      id: "administrative",
      name: "Direito Administrativo",
      subcategories: [
        { id: "admin-procedure", name: "Procedimento Administrativo" },
        { id: "public-procurement", name: "Contratação Pública" },
      ],
    },
    {
      id: "labor",
      name: "Direito do Trabalho",
      subcategories: [
        { id: "labor-code", name: "Lei do Trabalho" },
        { id: "social-security", name: "Segurança Social" },
      ],
    },
  ];

  const favoriteDocuments: CategoryItem[] = [
    { id: "fav-1", name: "Constituição da República" },
    { id: "fav-2", name: "Código Civil" },
    { id: "fav-3", name: "Lei do Trabalho" },
    { id: "fav-4", name: "Lei da Família" },
  ];

  const recentDocuments: RecentDocument[] = [
    { id: "rec-1", title: "Lei de Terras", date: "2023-06-15" },
    { id: "rec-2", title: "Código Comercial", date: "2023-06-10" },
    { id: "rec-3", title: "Lei de Minas", date: "2023-06-05" },
  ];

  if (collapsed) {
    return (
      <div className="h-full w-16 border-r bg-background flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-6"
        >
          <ChevronRightCircle className="h-5 w-5" />
        </Button>
        <div className="flex flex-col gap-6 items-center">
          <Button variant="ghost" size="icon">
            <BookOpen className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Clock className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-[280px] border-r bg-background flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Biblioteca Jurídica</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronLeftCircle className="h-5 w-5" />
        </Button>
      </div>
      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="mb-2 text-sm font-medium">Categorias</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="mb-1">
                <Collapsible
                  open={expandedCategories[category.id]}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto"
                    >
                      {expandedCategories[category.id] ? (
                        <ChevronDown className="h-4 w-4 mr-2" />
                      ) : (
                        <ChevronRight className="h-4 w-4 mr-2" />
                      )}
                      {category.name}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-6 space-y-1">
                      {category.subcategories?.map((subcat) => (
                        <Button
                          key={subcat.id}
                          variant="ghost"
                          className="w-full justify-start p-2 h-auto text-sm"
                        >
                          {subcat.name}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>

          <h3 className="mt-6 mb-2 text-sm font-medium flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Favoritos
          </h3>
          <div className="space-y-1">
            {favoriteDocuments.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto text-sm"
              >
                {doc.name}
              </Button>
            ))}
          </div>

          <h3 className="mt-6 mb-2 text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Recentes
          </h3>
          <div className="space-y-1">
            {recentDocuments.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start p-2 h-auto text-sm"
              >
                <div className="flex flex-col items-start">
                  <span>{doc.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(doc.date).toLocaleDateString("pt-MZ")}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
