import { NextResponse } from "next/server";
import { LogoFormData } from "@/types/logo";

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

function generatePrompt(formData: LogoFormData): string {
  const { style, type, structure, texte } = formData;
  
  let prompt = `Generate a professional ${style} logo`;
  
  if (type === "icone-texte" || type === "texte-seul") {
    prompt += ` with the text "${texte}"`;
  }
  
  if (type === "icone-texte" || type === "icone-seule") {
    prompt += ` in a ${structure} composition`;
  }
  
  // Ajout de détails spécifiques selon le style
  switch (style) {
    case "minimaliste":
      prompt += ", clean and simple design, minimal details";
      break;
    case "moderne":
      prompt += ", contemporary design, sleek and professional";
      break;
    case "vintage":
      prompt += ", retro style, classic elements, aged look";
      break;
    case "dessin-anime":
      prompt += ", cartoon style, playful and fun design";
      break;
    case "futuriste":
      prompt += ", futuristic elements, high-tech appearance";
      break;
    case "typographique":
      prompt += ", typography focused, creative lettering";
      break;
    case "3d":
      prompt += ", three-dimensional design, depth and shadows";
      break;
  }

  return prompt + ", high quality, professional logo design, white background";
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
