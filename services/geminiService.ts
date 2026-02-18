
import { GoogleGenAI } from "@google/genai";

export const getAIPropertyAdvice = async (data: any, type: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Act as a senior real estate investment advisor. 
    Analyze the following ${type} calculation data and provide a concise (3-4 bullet points) summary of risks, opportunities, and strategic advice.
    
    Data: ${JSON.stringify(data)}
    
    Provide professional insights on whether this looks like a solid financial move, considering current market trends (mentioning things like interest rates and inflation).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Unable to generate insights at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI advisor. Please try again later.";
  }
};
