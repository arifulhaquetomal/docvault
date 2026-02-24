
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDocument(file: File, base64Data: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data.split(',')[1],
            },
          },
          {
            text: `Analyze this document and provide a JSON response with:
              1. A descriptive title for the document.
              2. One suggested category from this list: [Personal ID, Health, Education, Finance, Employment, Legal, Other].
              3. A concise 2-sentence summary of the document's content.
              Respond strictly in JSON format.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            summary: { type: Type.STRING },
          },
          required: ["title", "category", "summary"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      title: file.name,
      category: "Other",
      summary: "Could not analyze document content.",
    };
  }
}
