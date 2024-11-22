"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "./product-card";
import { SettingsPanel } from "./settings-panel";
import { Product, CatalogSettings } from "./types";
import { PDFDownloadButton } from "../pdf-download-button";

const getGridSizeFromLayout = (layout: "4x3" | "3x3" | "4x2") => {
  const sizes = {
    "4x3": { cols: 4, total: 12 },
    "3x3": { cols: 3, total: 9 },
    "4x2": { cols: 4, total: 8 },
  };
  return sizes[layout];
};

export default function ProductCatalogBuilder() {
  const [settings, setSettings] = useState<CatalogSettings>({
    header: {
      logo: "",
    },
    layout: "4x3",
    footer: {
      backgroundColor: "#FF3B30",
      whatsapp: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      website: "",
      address: "",
      qrCodeLink: "",
    },
    primaryColor: "#FF3B30",
    imageShape: "square",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const { cols, total } = getGridSizeFromLayout(settings.layout);

  useEffect(() => {
    setProducts(
      Array(total)
        .fill(null)
        .map((_, index) => ({
          id: index,
          image: "",
          title: "",
          originalPrice: "",
          discountPrice: "",
        }))
    );
  }, [total]);

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProducts((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, image: reader.result as string } : p
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const handleHeaderUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({
        ...prev,
        header: {
          ...prev.header,
          logo: reader.result as string,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-[320px_1fr] min-h-screen max-w-[1440px]">
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        onLogoUpload={handleHeaderUpload}
        onDownload={() => {}}
      />

      <main className="p-6 space-y-6 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                imageShape={settings.imageShape}
                primaryColor={settings.primaryColor}
                onImageUpload={handleImageUpload}
                onUpdate={updateProduct}
              />
            ))}
          </div>

          <div className="flex justify-center pt-6">
            <PDFDownloadButton products={products} settings={settings} />
          </div>
        </div>
      </main>
    </div>
  );
}
