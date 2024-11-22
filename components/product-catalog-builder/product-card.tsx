import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "./types";
import ImageUpload from "../image-upload";

interface ProductCardProps {
  product: Product;
  index: number;
  imageShape: "square" | "circle";
  primaryColor: string;
  onImageUpload: (index: number, file: File) => void;
  onUpdate: (index: number, field: keyof Product, value: string) => void;
}

export function ProductCard({
  product,
  index,
  imageShape,
  primaryColor,
  onImageUpload,
  onUpdate,
}: ProductCardProps) {
  return (
    <Card className="p-4 space-y-4 hover:shadow-lg transition-shadow">
      <div
        className={
          imageShape === "circle" ? "rounded-full overflow-hidden" : ""
        }
      >
        <ImageUpload
          onImageUpload={(file: File) => onImageUpload(index, file)}
          currentImage={product.image}
          shape={imageShape === "circle" ? "circle" : "square"}
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
              style={{ color: primaryColor }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
