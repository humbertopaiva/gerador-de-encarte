import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  currentImage?: string;
  shape?: "square" | "video" | "circle";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  currentImage,
  shape = "square",
}) => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    // Validação do tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione apenas arquivos de imagem.");
      setIsLoading(false);
      return;
    }

    // Validação do tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("A imagem deve ter menos de 5MB.");
      setIsLoading(false);
      return;
    }

    try {
      // Criar uma Promise para carregar a imagem
      const loadImage = (imageFile: Blob | MediaSource) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error("Erro ao carregar a imagem"));
          img.src = URL.createObjectURL(imageFile);
        });
      };

      // Carregar a imagem para validar
      await loadImage(file);
      onImageUpload(file);
    } catch (err) {
      setError("Erro ao processar a imagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />

      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          w-full relative overflow-hidden
          ${shape === "square" ? "aspect-square" : "aspect-video"}
          bg-gray-100 hover:bg-gray-200 transition-colors
          rounded-lg border-2 border-dashed border-gray-300
          flex items-center justify-center
        `}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center p-4">
            <Camera className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm text-gray-500">
              {isLoading ? "Carregando..." : "Clique para adicionar imagem"}
            </span>
          </div>
        )}
      </button>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Erro ao fazer upload</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageUpload;
