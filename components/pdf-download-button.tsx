"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

import dynamic from "next/dynamic";
import { CatalogSettings, Product } from "./product-catalog-builder/types";

const PDFRenderer = dynamic(() => import("./pdf-render"), {
  ssr: false,
  loading: () => null,
});

interface PDFDownloadButtonProps {
  products: Product[];
  settings: CatalogSettings;
}

export function PDFDownloadButton(props: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button onClick={() => setLoading(true)} disabled={loading} size="lg">
        {loading ? (
          "Gerando PDF..."
        ) : (
          <>
            <FileDown className="w-4 h-4 mr-2" />
            Baixar PDF
          </>
        )}
      </Button>
      {loading && (
        <PDFRenderer {...props} onComplete={() => setLoading(false)} />
      )}
    </>
  );
}
