"use client";

import { ImagePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "./types";

interface ProductCardProps {
  product: Product;
  index: number;
  imageShape: "square" | "circle";
  onImageUpload: (index: number, file: File) => void;
  onUpdate: (index: number, field: keyof Product, value: string) => void;
}

export function ProductCard({
  product,
  index,
  imageShape,
  onImageUpload,
  onUpdate,
}: ProductCardProps) {
  return (
    <Card className="p-4 space-y-4">
      <div
        className={`aspect-square relative bg-gray-100 overflow-hidden ${
          imageShape === "circle" ? "rounded-full" : "rounded-lg"
        }`}
      >
        {product.image ? (
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
              <span className="text-sm text-gray-500">Adicionar Imagem</span>
            </Label>
          </div>
        )}
        <input
          id={`image-${index}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onImageUpload(index, e.target.files[0])
          }
        />
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Título do Produto"
          value={product.title}
          onChange={(e) => onUpdate(index, "title", e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Preço Original</Label>
            <Input
              placeholder="R$ 0,00"
              value={product.originalPrice}
              onChange={(e) => onUpdate(index, "originalPrice", e.target.value)}
            />
          </div>
          <div>
            <Label>Preço com Desconto</Label>
            <Input
              placeholder="R$ 0,00"
              value={product.discountPrice}
              onChange={(e) => onUpdate(index, "discountPrice", e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}