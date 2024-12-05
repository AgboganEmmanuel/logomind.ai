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
  const [error, setError] = useState<string | null>(null);

  const generateLogo = async (formData: LogoFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000); // 50 secondes timeout

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setGeneratedLogo(data.imageUrl);
    } catch (error) {
      console.error("Erreur:", error);
      setError(error instanceof Error ? error.message : "Une erreur est survenue lors de la génération");
      setGeneratedLogo(null);
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
              <div className="text-gray-500">Génération en cours... (cela peut prendre jusqu&apos;à 30 secondes)</div>
            ) : error ? (
              <div className="text-red-500 p-4 text-center">
                <p>{error}</p>
                <button 
                  onClick={() => setError(null)}
                  className="mt-2 text-sm text-blue-500 hover:underline"
                >
                  Réessayer
                </button>
              </div>
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