
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedApp } from "../types";

export const generateAppCode = async (prompt: string): Promise<GeneratedApp> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are a world-class Software Architect and Senior Frontend Engineer specialized in Vercel deployments. 
      Your task is to generate a complete, production-ready React application that is fully optimized for Vercel.
      
      Requirements:
      1. Use React (TypeScript), Tailwind CSS, and Lucide React icons.
      2. Provide a modular structure (components, hooks, utils, types).
      3. The 'App.tsx' should be the main entry point.
      4. MANDATORY: Include a 'package.json' with proper scripts for Vercel (build, start, dev).
      5. MANDATORY: Include a 'vercel.json' configuration file for routing and environment settings.
      6. Include a 'README.md' file explaining the architecture and how to deploy to Vercel with one click.
      7. Use modern React patterns (hooks, functional components).
      
      Output ONLY a JSON object matching the requested schema. Ensure the files are structured correctly for a standard Vercel project deployment.`,
      thinkingConfig: { thinkingBudget: 30000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Professional name of the generated app" },
          description: { type: Type.STRING, description: "A technical overview focusing on features and Vercel compatibility" },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING, description: "Detailed file path (e.g., src/components/Header.tsx, vercel.json, package.json)" },
                content: { type: Type.STRING, description: "The complete source code of the file" },
                language: { type: Type.STRING, description: "Programming language for highlighting (typescript, tsx, css, json, markdown)" }
              },
              required: ["path", "content", "language"]
            }
          }
        },
        required: ["name", "description", "files"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  try {
    return JSON.parse(text.trim()) as GeneratedApp;
  } catch (error) {
    console.error("Failed to parse JSON response:", text);
    throw new Error("The AI returned invalid JSON. Please refine your prompt and try again.");
  }
};
