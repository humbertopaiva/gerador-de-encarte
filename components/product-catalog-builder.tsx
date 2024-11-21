"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, FileDown } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CatalogPDF from "@/components/catalog-pdf";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PDFDownloadButton } from "./pdf-download-button";

interface Product {
  id: number;
  image: string;
  title: string;
  originalPrice: string;
  discountPrice: string;
}

interface CatalogSettings {
  header: {
    title: string;
    subtitle: string;
    logo: string;
  };
  footer: {
    text: string;
    logo: string;
  };
  imageShape: "square" | "circle";
  gridColumns: number;
  colors?: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

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

  const handleGridSizeChange = (value: string) => {
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
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newProducts = [...products];
      newProducts[index] = {
        ...newProducts[index],
        image: reader.result as string,
      };
      setProducts(newProducts);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (type: "header" | "footer", file: File) => {
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
  };

  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    };
    setProducts(newProducts);
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="content">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Cabeçalho</h2>
            <div className="space-y-4">
              <div>
                <Label>Título Principal</Label>
                <Input
                  value={settings.header.title}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      header: { ...prev.header, title: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={settings.header.subtitle}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      header: { ...prev.header, subtitle: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Logo do Cabeçalho</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleLogoUpload("header", e.target.files[0])
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Rodapé</h2>
            <div className="space-y-4">
              <div>
                <Label>Texto do Rodapé</Label>
                <Textarea
                  value={settings.footer.text}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, text: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <Label>Logo do Rodapé</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    handleLogoUpload("footer", e.target.files[0])
                  }
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Layout</h2>
            <div className="space-y-4">
              <div>
                <Label>Formato das Imagens</Label>
                <RadioGroup
                  value={settings.imageShape}
                  onValueChange={(value: "square" | "circle") =>
                    setSettings((prev) => ({ ...prev, imageShape: value }))
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="square" id="square" />
                    <Label htmlFor="square">Quadrado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="circle" id="circle" />
                    <Label htmlFor="circle">Circular</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>Colunas no Grid</Label>
                <RadioGroup
                  value={settings.gridColumns.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      gridColumns: parseInt(value),
                    }))
                  }
                  className="flex gap-4"
                >
                  {[2, 3].map((cols) => (
                    <div key={cols} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={cols.toString()}
                        id={`col-${cols}`}
                      />
                      <Label htmlFor={`col-${cols}`}>{cols} Colunas</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </Card>
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
                <Card key={product.id} className="p-4 space-y-4">
                  <div
                    className={`aspect-square relative bg-gray-100 overflow-hidden ${
                      settings.imageShape === "circle"
                        ? "rounded-full"
                        : "rounded-lg"
                    }`}
                  >
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Label
                          htmlFor={`image-${index}`}
                          className="cursor-pointer flex flex-col items-center space-y-2"
                        >
                          <ImagePlus className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Adicionar Imagem
                          </span>
                        </Label>
                      </div>
                    )}
                    <input
                      id={`image-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleImageUpload(index, e.target.files[0])
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Input
                      placeholder="Título do Produto"
                      value={product.title}
                      onChange={(e) =>
                        updateProduct(index, "title", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Preço Original</Label>
                        <Input
                          placeholder="R$ 0,00"
                          value={product.originalPrice}
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "originalPrice",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label>Preço com Desconto</Label>
                        <Input
                          placeholder="R$ 0,00"
                          value={product.discountPrice}
                          onChange={(e) =>
                            updateProduct(
                              index,
                              "discountPrice",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center">
        <PDFDownloadButton products={products} settings={settings} />
      </div>
    </div>
  );
}
