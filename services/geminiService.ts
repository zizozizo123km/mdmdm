
import { GeneratedApp } from "../types";

export const generateAppCode = async (prompt: string): Promise<GeneratedApp> => {
  // Use the API key provided in the environment
  const apiKey = process.env.API_KEY;
  
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AppForge Architect",
    },
    body: JSON.stringify({
      "model": "tngtech/deepseek-r1t2-chimera:free",
      "messages": [
        {
          "role": "system",
          "content": `You are a world-class Full-Stack Project Architect. 
          Your goal is to generate a complete, working web application.
          
          OUTPUT FORMAT:
          You must return ONLY a raw JSON object. Do not include markdown formatting like \`\`\`json. 
          The JSON must exactly match this structure:
          {
            "name": "App Name",
            "description": "App Description",
            "tree": "Visual ASCII file tree",
            "files": [
              { "path": "index.html", "content": "...", "language": "html" },
              { "path": "api/server.js", "content": "...", "language": "javascript" },
              { "path": "package.json", "content": "...", "language": "json" },
              { "path": "vercel.json", "content": "...", "language": "json" }
            ]
          }

          ARCHITECTURE RULES:
          1. Frontend must be in the root (index.html, styles.css, etc.).
          2. Backend logic must be in the 'api/' directory for Vercel Serverless compatibility.
          3. Frontend MUST fetch from '/api/filename' to interact with the backend.
          4. Include all necessary config files (package.json, vercel.json).
          5. Ensure the code is production-ready and fully functional.`
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      "response_format": { "type": "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || "Failed to communicate with the DeepSeek reasoning engine.");
  }

  const data = await response.json();
  let content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Reasoning engine returned an empty response.");
  }

  // DeepSeek models sometimes include <thought> tags or markdown backticks.
  // We clean the content before parsing to ensure valid JSON.
  content = content.replace(/<thought>[\s\S]*?<\/thought>/g, '');
  content = content.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(content) as GeneratedApp;
  } catch (error) {
    console.error("JSON Parsing failed for content:", content);
    throw new Error("The reasoning engine returned an invalid format. Please refine your request.");
  }
};
