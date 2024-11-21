"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CatalogSettings } from "./types";

interface SettingsPanelProps {
  settings: CatalogSettings;
  onSettingsChange: (settings: CatalogSettings) => void;
  onLogoUpload: (type: "header" | "footer", file: File) => void;
}

export function SettingsPanel({
  settings,
  onSettingsChange,
  onLogoUpload,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cabeçalho</h2>
        <div className="space-y-4">
          <div>
            <Label>Título Principal</Label>
            <Input
              value={settings.header.title}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  header: { ...settings.header, title: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Input
              value={settings.header.subtitle}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  header: { ...settings.header, subtitle: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Logo do Cabeçalho</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && onLogoUpload("header", e.target.files[0])
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
                onSettingsChange({
                  ...settings,
                  footer: { ...settings.footer, text: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Logo do Rodapé</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && onLogoUpload("footer", e.target.files[0])
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
                onSettingsChange({
                  ...settings,
                  imageShape: value,
                })
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
                onSettingsChange({
                  ...settings,
                  gridColumns: parseInt(value),
                })
              }
              className="flex gap-4"
            >
              {[2, 3].map((cols) => (
                <div key={cols} className="flex items-center space-x-2">
                  <RadioGroupItem value={cols.toString()} id={`col-${cols}`} />
                  <Label htmlFor={`col-${cols}`}>{cols} Colunas</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cores</h2>
        <div className="space-y-4">
          <div>
            <Label>Cor Principal</Label>
            <Input
              type="color"
              value={settings.colors.primary}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  colors: { ...settings.colors, primary: e.target.value },
                })
              }
            />
          </div>
          <div>
            <Label>Cor Secundária</Label>
            <Input
              type="color"
              value={settings.colors.secondary}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  colors: { ...settings.colors, secondary: e.target.value },
                })
              }
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
