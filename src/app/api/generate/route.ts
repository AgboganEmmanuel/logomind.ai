import { NextResponse } from "next/server";
import { LogoFormData } from "@/types/logo";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

function generatePrompt(formData: LogoFormData): string {
  const { style, type, structure, texte, couleur } = formData;
  const timestamp = Date.now(); // Pour rendre chaque prompt unique
  
  let prompt = `Create a highly distinctive and professional ${style} logo design`;
  
  // Renforcement du type de logo
  if (type === "icone-texte") {
    prompt += `, featuring both a striking icon and the text "${texte}" harmoniously integrated`;
  } else if (type === "texte-seul") {
    prompt += `, with the text "${texte}" as the main focal point, no icons or symbols`;
  } else if (type === "icone-seule") {
    prompt += `, consisting of only an iconic symbol without any text`;
  }
  
  // Renforcement de la structure
  if (type === "icone-texte" || type === "icone-seule") {
    prompt += `. The design must strictly follow a ${structure} layout`;
    switch (structure) {
      case "symetrique":
        prompt += `, with perfect balance and mirror-like symmetry`;
        break;
      case "circulaire":
        prompt += `, arranged in a perfect circular composition`;
        break;
      case "rectangulaire":
        prompt += `, contained within a rectangular boundary`;
        break;
      case "libre":
        prompt += `, with dynamic and organic arrangement`;
        break;
    }
  }

  // Renforcement de la couleur
  prompt += `. The dominant and most prominent color must be ${couleur}, make it very visible`;
  
  // Renforcement des styles spécifiques
  switch (style) {
    case "minimaliste":
      prompt += `. Ultra-clean and simplified design, using minimal elements, essential shapes only, refined to absolute necessity`;
      break;
    case "moderne":
      prompt += `. Contemporary and sophisticated design with sleek lines, modern aesthetics, cutting-edge appearance`;
      break;
    case "vintage":
      prompt += `. Strong retro aesthetics, classic vintage elements, authentic aged appearance, nostalgic feel`;
      break;
    case "dessin-anime":
      prompt += `. Playful cartoon style, fun and expressive design, animated character-like elements`;
      break;
    case "futuriste":
      prompt += `. Ultra-modern futuristic elements, sci-fi inspired, high-tech and innovative appearance`;
      break;
    case "typographique":
      prompt += `. Focus on creative and artistic typography, unique letterforms, expressive font design`;
      break;
    case "3d":
      prompt += `. Fully three-dimensional design with realistic depth, shadows, and perspective`;
      break;
  }

  // Ajout d'éléments de qualité et de randomisation
  prompt += `, masterfully crafted with attention to detail, professional quality, perfect for business use. White background, high resolution. Seed: ${timestamp}`;
  
  return prompt;
}

export async function POST(req: Request) {
  try {
    const formData: LogoFormData = await req.json();
    const prompt = generatePrompt(formData);

    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "text, watermark, signature, blurry, low quality",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error generating logo:", error);
    return NextResponse.json(
      { error: "Failed to generate logo" },
      { status: 500 }
    );
  }
}
