"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./product-card";
import { SettingsPanel } from "./settings-panel";
import { Product, CatalogSettings } from "./types";
import { PDFDownloadButton } from "../pdf-download-button";

// Dynamically import PDFDownloadLink and CatalogPDF to avoid SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);
const CatalogPDF = dynamic(() => import("../catalog-pdf"), { ssr: false });

export default function ProductCatalogBuilder() {
  const [gridSize, setGridSize] = useState<number>(4);
  const [settings, setSettings] = useState<CatalogSettings>({
    header: {
      title: "OFERTAS DA SEMANA",
      subtitle: "Preços válidos de 01/04 a 07/04",
      logo: "",
    },
    footer: {
      text: "Ofertas válidas enquanto durarem os estoques. Imagens meramente ilustrativas.",
      logo: "",
    },
    imageShape: "square",
    gridColumns: 3,
  });

  const [products, setProducts] = useState<Product[]>(
    Array(4)
      .fill({
        id: 0,
        image: "",
        title: "",
        originalPrice: "",
        discountPrice: "",
      })
      .map((_, index) => ({ ..._, id: index }))
  );

  const handleGridSizeChange = useCallback((value: string) => {
    const size = Math.min(Math.max(1, parseInt(value) || 1), 6);
    setGridSize(size);
    setProducts(
      Array(size)
        .fill({
          id: 0,
          image: "",
          title: "",
          originalPrice: "",
          discountPrice: "",
        })
        .map((_, index) => ({ ..._, id: index }))
    );
  }, []);

  const handleImageUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProducts((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, image: reader.result as string } : p
        )
      );
    };
    reader.readAsDataURL(file);
  }, []);

  const handleLogoUpload = useCallback(
    (type: "header" | "footer", file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            logo: reader.result as string,
          },
        }));
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const updateProduct = useCallback(
    (index: number, field: keyof Product, value: string) => {
      setProducts((prev) =>
        prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  return (
    <div className="space-y-8">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="content">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <SettingsPanel
            settings={settings}
            onSettingsChange={setSettings}
            onLogoUpload={handleLogoUpload}
          />
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Construtor de Encartes
              </h1>
              <div className="flex items-center gap-4">
                <Label htmlFor="gridSize">Quantidade de Produtos:</Label>
                <Input
                  id="gridSize"
                  type="number"
                  min="1"
                  max="6"
                  value={gridSize}
                  onChange={(e) => handleGridSizeChange(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>

            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${settings.gridColumns}, minmax(0, 1fr))`,
              }}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  imageShape={settings.imageShape}
                  onImageUpload={handleImageUpload}
                  onUpdate={updateProduct}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        {typeof window !== "undefined" && (
          <PDFDownloadButton products={products} settings={settings} />
        )}
      </div>
    </div>
  );
}
