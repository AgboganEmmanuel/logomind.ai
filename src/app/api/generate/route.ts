import { NextResponse } from "next/server";
import { LogoFormData } from "@/types/logo";

// test const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const HUGGING_FACE_API_URL= "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";

export const runtime = 'edge';
export const maxDuration = 60;

function generatePrompt(formData: LogoFormData): string {
  const { style, type, structure, texte, couleur, description } = formData;
  const timestamp = Date.now();

  // Base du prompt
  let prompt = `Create a professional, visually striking logo design in ${style} style`;

  // Add description if provided
  if (description) {
    prompt += `. The logo should represent: ${description}`;
  }

  // Type de logo
  switch (type) {
    case 'icone-seule':
      prompt += `, consisting only of an iconic symbol without text`;
      break;
    case 'texte-seul':
      prompt += `, where the text "${texte}" is the main focal point, without any icons`;
      break;
    case 'icone-texte':
      prompt += `, integrating a unique icon with the text "${texte}" in harmony`;
      break;
  }

  // Structure du logo
  switch (structure) {
    case 'symetrique':
      prompt += `, following a symmetrical layout for perfect balance`;
      break;
    case 'circulaire':
      prompt += `, designed in a circular composition for unity and elegance`;
      break;
    case 'rectangulaire':
      prompt += `, confined within a rectangular frame for structure and clarity`;
      break;
    case 'libre':
      prompt += `, with a freeform layout for creativity and organic flow`;
      break;
  }

  // Couleur dominante
  prompt += `. The dominant color must be ${couleur}, making it highly visible and prominent.`;

  // Style de design
  switch (style) {
    case 'moderne':
      prompt += ` Sleek and contemporary with clean lines and innovative design.`;
      break;
    case 'minimaliste':
      prompt += ` Simplified, clean, and reduced to essential elements.`;
      break;
    case 'vintage':
      prompt += ` Retro-inspired with nostalgic and classic details.`;
      break;
    case 'futuriste':
      prompt += ` Sci-fi inspired with futuristic and high-tech aesthetics.`;
      break;
    case '3d':
      prompt += ` Featuring a realistic 3D look with depth and perspective.`;
      break;
    case 'typographique':
      prompt += ` Centered on typography with unique and expressive letterforms.`;
      break;
    case 'dessin-anime':
      prompt += ` Playful, cartoon-like, and character-driven design.`;
      break;
  }

  // Détails supplémentaires pour la qualité et la spécificité
  prompt += ` Ensure high resolution, exceptional detail, and a clean white background.`;

  // Seed pour randomisation
  prompt += ` [Seed: ${timestamp}]`;

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
          num_inference_steps: 30, // Réduit de 30 à 25 pour plus de rapidité
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new NextResponse(
        JSON.stringify({ error: `Hugging Face API error: ${error}` }),
        { status: response.status }
      );
    }

    const result = await response.arrayBuffer();
    const base64 = Buffer.from(result).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64}`;

    return new NextResponse(JSON.stringify({ imageUrl }));
  } catch (error) {
    console.error("Error generating logo:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error during logo generation" }),
      { status: 500 }
    );
  }
}
