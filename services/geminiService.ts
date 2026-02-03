
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedApp } from "../types";

export const generateAppCode = async (prompt: string): Promise<GeneratedApp> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction: `You are a world-class Full-Stack Web Architect specialized in modern HTML5/JavaScript and Vercel-ready backends.
      Your task is to generate a complete, production-ready Full-Stack application.
      
      Requirements:
      1. Frontend: Use standard HTML5, CSS3 (can use Tailwind CDN), and modern ES6+ JavaScript.
      2. Backend: Provide Node.js serverless functions (standard Vercel style in the 'api/' directory).
      3. Structure: 
         - 'public/' or root for HTML/CSS/JS.
         - 'api/' for Backend logic (Serverless functions).
      4. MANDATORY: Include 'package.json' and 'vercel.json' to glue the frontend and backend together.
      5. Functionality: Ensure the frontend actually communicates with the generated backend endpoints.
      6. Security: Implement basic security headers and best practices.
      7. Documentation: A comprehensive 'README.md' explaining how the full-stack architecture works.
      
      Output ONLY a JSON object matching the requested schema. Provide a robust, interconnected full-stack experience.`,
      thinkingConfig: { thinkingBudget: 30000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Professional name of the full-stack app" },
          description: { type: Type.STRING, description: "Detailed technical summary of frontend and backend integration" },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING, description: "Detailed file path (e.g., index.html, api/hello.js, package.json)" },
                content: { type: Type.STRING, description: "The complete source code" },
                language: { type: Type.STRING, description: "Programming language (html, javascript, css, json, markdown)" }
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
    throw new Error("The AI failed to generate valid JSON. Try refining your full-stack requirements.");
  }
};
