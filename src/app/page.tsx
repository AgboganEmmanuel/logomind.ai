"use client";

import { useState } from "react";
import { LogoForm } from "../components/logo-form";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import { LogoFormData } from "@/types/logo";

export default function Home() {
  const [generatedLogo, setGeneratedLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
//test comment
  const generateLogo = async (formData: LogoFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la génération du logo");
      }

      const data = await response.json();
      setGeneratedLogo(data.imageUrl);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedLogo) return;
    
    try {
      const response = await fetch(generatedLogo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logo.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold text-center mb-10 text-black">Générateur de Logos IA</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <LogoForm onSubmit={generateLogo} />
          </div>
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center min-h-[600px] relative">
            {isLoading ? (
              <div className="text-gray-500">Génération en cours...</div>
            ) : generatedLogo ? (
              <>
                <div className="relative w-full h-[600px]">
                  <Image
                    src={generatedLogo}
                    alt="Logo généré"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <Button
                  onClick={handleDownload}
                  size="icon"
                  className="absolute top-4 right-4 bg-black hover:bg-black/90 text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="text-gray-400">Configurez et générez votre logo</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}