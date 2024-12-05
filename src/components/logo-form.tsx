"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogoFormData } from "@/types/logo";

const logoStyles = [
  { value: "minimaliste", label: "Minimaliste" },
  { value: "moderne", label: "Moderne" },
  { value: "vintage", label: "Vintage" },
  { value: "dessin-anime", label: "Dessin animé" },
  { value: "futuriste", label: "Futuriste" },
  { value: "typographique", label: "Typographique" },
  { value: "3d", label: "3D" },
];

const structures = [
  { value: "symetrique", label: "Symétrique" },
  { value: "circulaire", label: "Circulaire" },
  { value: "rectangulaire", label: "Rectangulaire" },
  { value: "libre", label: "Libre" },
];

export function LogoForm({ onSubmit }: { onSubmit: (data: LogoFormData) => void }) {
  const [formData, setFormData] = useState<LogoFormData>({
    style: "moderne",
    couleur: "#000000",
    type: "icone-texte",
    structure: "symetrique",
    texte: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-black font-normal">Style du logo</Label>
          <Select
            value={formData.style}
            onValueChange={(value: LogoFormData['style']) => setFormData({ ...formData, style: value })}
          >
            <SelectTrigger className="bg-white border-gray-200 text-black">
              <SelectValue placeholder="Sélectionnez un style" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {logoStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-black font-normal">Couleur principale</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={formData.couleur}
              onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
              className="w-12 h-12 p-1 bg-white border-gray-200 rounded-lg"
            />
            <Input
              type="text"
              value={formData.couleur.toUpperCase()}
              onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
              className="flex-1 bg-white border-gray-200 text-black placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-black font-normal">Type de logo</Label>
          <RadioGroup
            value={formData.type}
            onValueChange={(value: LogoFormData['type']) => setFormData({ ...formData, type: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="icone-seule" id="icone-seule" />
              <Label htmlFor="icone-seule" className="text-black font-normal">Icône seule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="texte-seul" id="texte-seul" />
              <Label htmlFor="texte-seul" className="text-black font-normal">Texte seul</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="icone-texte" id="icone-texte" />
              <Label htmlFor="icone-texte" className="text-black font-normal">Icône et texte</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-black font-normal">Structure</Label>
          <Select
            value={formData.structure}
            onValueChange={(value: LogoFormData['structure']) => setFormData({ ...formData, structure: value })}
          >
            <SelectTrigger className="bg-white border-gray-200 text-black">
              <SelectValue placeholder="Sélectionnez une structure" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              {structures.map((structure) => (
                <SelectItem key={structure.value} value={structure.value}>
                  {structure.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-black font-normal">Texte du logo</Label>
          <Input
            type="text"
            value={formData.texte}
            onChange={(e) => setFormData({ ...formData, texte: e.target.value })}
            placeholder="Entrez le texte de votre logo"
            className="bg-white border-gray-200 text-black placeholder:text-gray-500"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
        Générer le logo
      </Button>
    </form>
  );
}
