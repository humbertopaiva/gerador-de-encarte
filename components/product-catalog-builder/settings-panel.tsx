// settings-panel.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Grid2X2,
  Grid3X3,
  Table,
  Info,
  Palette,
  Image as ImageIcon,
  Share2,
  FileDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CatalogSettings } from "./types";

interface LayoutOption {
  id: "4x3" | "3x3" | "4x2";
  name: string;
  icon: React.ReactNode;
  cols: number;
  rows: number;
  description: string;
  total: number;
}

const layoutOptions: LayoutOption[] = [
  {
    id: "4x3",
    name: "Full Page",
    icon: <Grid3X3 className="h-8 w-8" />,
    cols: 4,
    rows: 3,
    total: 12,
    description: "12 produtos - Layout ideal para encartes completos",
  },
  {
    id: "3x3",
    name: "Square",
    icon: <Table className="h-8 w-8" />,
    cols: 3,
    rows: 3,
    total: 9,
    description: "9 produtos - Perfeito para categorias específicas",
  },
  {
    id: "4x2",
    name: "Banner",
    icon: <Grid2X2 className="h-8 w-8" />,
    cols: 4,
    rows: 2,
    total: 8,
    description: "8 produtos - Ótimo para ofertas destacadas",
  },
];

const predefinedColors = [
  "#FF3B30", // Vermelho
  "#34C759", // Verde
  "#007AFF", // Azul
  "#5856D6", // Roxo
  "#FF9500", // Laranja
  "#AF52DE", // Rosa
];

interface SettingsPanelProps {
  settings: CatalogSettings;
  onSettingsChange: (settings: CatalogSettings) => void;
  onLogoUpload: (file: File) => void;
  onDownload: () => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onLogoUpload,
  onDownload,
}: SettingsPanelProps) {
  const currentLayout = layoutOptions.find((l) => l.id === settings.layout);

  return (
    <div className="h-full bg-gray-50/50 p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Personalização</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Customize seu encarte em poucos passos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Tabs defaultValue="layout" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 bg-transparent h-auto">
          <TabsTrigger
            value="layout"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
          >
            <Table className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger
            value="style"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
          >
            <Palette className="h-4 w-4 mr-2" />
            Estilo
          </TabsTrigger>
          <TabsTrigger
            value="header"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Header
          </TabsTrigger>
          <TabsTrigger
            value="footer"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-2"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Footer
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="layout" className="mt-0">
            <div className="grid gap-4">
              {layoutOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    settings.layout === option.id
                      ? "ring-2 ring-primary"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    onSettingsChange({ ...settings, layout: option.id })
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/5 rounded-lg">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{option.name}</h3>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="style" className="mt-0">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label>Cor Principal</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {predefinedColors.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                          settings.primaryColor === color
                            ? "ring-2 ring-offset-2 ring-primary"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() =>
                          onSettingsChange({ ...settings, primaryColor: color })
                        }
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Formato das Imagens</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {["square", "circle"].map((shape) => (
                      <Card
                        key={shape}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          settings.imageShape === shape
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() =>
                          onSettingsChange({
                            ...settings,
                            imageShape: shape as "square" | "circle",
                          })
                        }
                      >
                        <div
                          className={`w-full aspect-square bg-gray-100 ${
                            shape === "circle" ? "rounded-full" : "rounded-lg"
                          }`}
                        />
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="header" className="mt-0">
            <Card className="p-6">
              <Label>Imagem do Header</Label>
              <Input
                type="file"
                accept="image/*"
                className="mt-2"
                onChange={(e) =>
                  e.target.files?.[0] && onLogoUpload(e.target.files[0])
                }
              />
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="mt-0">
            <Card className="p-6 space-y-6">
              <div>
                <Label>Cor de Fundo</Label>
                <Input
                  type="color"
                  value={settings.footer.backgroundColor}
                  className="h-12 w-full"
                  onChange={(e) =>
                    onSettingsChange({
                      ...settings,
                      footer: {
                        ...settings.footer,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>WhatsApp</Label>
                  <Input
                    placeholder="+55 11 99999-9999"
                    value={settings.footer.whatsapp}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input
                    placeholder="@seuinstagram"
                    value={settings.footer.instagram}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          instagram: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Facebook</Label>
                  <Input
                    placeholder="/seufacebook"
                    value={settings.footer.facebook}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          facebook: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>TikTok</Label>
                  <Input
                    placeholder="@seutiktok"
                    value={settings.footer.tiktok}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          tiktok: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    placeholder="www.seusite.com.br"
                    value={settings.footer.website}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          website: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Endereço</Label>
                  <Textarea
                    placeholder="Rua Example, 123 - Bairro"
                    value={settings.footer.address}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          address: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Link para QR Code</Label>
                  <Input
                    placeholder="https://..."
                    value={settings.footer.qrCodeLink}
                    onChange={(e) =>
                      onSettingsChange({
                        ...settings,
                        footer: {
                          ...settings.footer,
                          qrCodeLink: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <div className="pt-6 border-t">
        <Button className="w-full" size="lg" onClick={onDownload}>
          <FileDown className="mr-2 h-4 w-4" />
          Baixar PDF
        </Button>
      </div>
    </div>
  );
}
