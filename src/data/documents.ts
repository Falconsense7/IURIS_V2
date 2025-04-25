export interface LegalDocument {
  id: string;
  title: string;
  type: string;
  description: string;
  pdfUrl: string;
  datePublished: string;
  category: string;
  isOffline?: boolean;
}

export const legalDocuments: LegalDocument[] = [
  {
    id: "constitution-moz",
    title: "Constituição da República de Moçambique",
    type: "Constitucional",
    description:
      "Constituição da República de Moçambique, aprovada pela Assembleia da República em 16 de Novembro de 2004",
    pdfUrl:
      "https://www.portaldogoverno.gov.mz/por/content/download/1961/15929/version/1/file/constituicao.pdf",
    datePublished: "2004-11-16",
    category: "Constitucional",
  },
  {
    id: "lei-trabalho",
    title: "Lei do Trabalho",
    type: "Trabalhista",
    description: "Lei nº 23/2007, de 1 de Agosto - Lei do Trabalho",
    pdfUrl:
      "https://www.portaldogoverno.gov.mz/por/content/download/1961/15929/version/1/file/constituicao.pdf",
    datePublished: "2007-08-01",
    category: "Trabalhista",
  },
  {
    id: "codigo-penal",
    title: "Código Penal de Moçambique",
    type: "Penal",
    description: "Lei nº 35/2014, de 31 de Dezembro - Código Penal",
    pdfUrl:
      "https://www.portaldogoverno.gov.mz/por/content/download/1961/15929/version/1/file/constituicao.pdf",
    datePublished: "2014-12-31",
    category: "Penal",
  },
  {
    id: "lei-terras",
    title: "Lei de Terras",
    type: "Civil",
    description: "Lei nº 19/97, de 1 de Outubro - Lei de Terras",
    pdfUrl:
      "https://www.portaldogoverno.gov.mz/por/content/download/1961/15929/version/1/file/constituicao.pdf",
    datePublished: "1997-10-01",
    category: "Civil",
  },
  {
    id: "codigo-comercial",
    title: "Código Comercial",
    type: "Comercial",
    description: "Decreto-Lei nº 2/2005, de 27 de Dezembro - Código Comercial",
    pdfUrl:
      "https://www.portaldogoverno.gov.mz/por/content/download/1961/15929/version/1/file/constituicao.pdf",
    datePublished: "2005-12-27",
    category: "Comercial",
  },
  {
    id: "lei-familia",
    title: "Lei da Família",
    type: "Civil",
    description:
      "Lei nº 22/2019, de 11 de Dezembro - Lei da Família e revoga a Lei nº 10/2004, de 25 de Agosto",
    pdfUrl: "https://wlsa.org.mz/wp-content/uploads/2014/11/Lei_da_Familia.pdf",
    datePublished: "2019-12-11",
    category: "Civil",
  },
];

export function getDocumentById(id: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.id === id);
}

export function getDocumentsByCategory(category: string): LegalDocument[] {
  return legalDocuments.filter((doc) => doc.category === category);
}
