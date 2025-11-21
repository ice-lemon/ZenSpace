import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RoomAnalysis, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    roomType: { type: Type.STRING, description: "The type of room (e.g., Bedroom, Kitchen)" },
    clutterLevel: { type: Type.STRING, description: "Assessment of clutter (e.g., Low, Moderate, Severe)" },
    vibe: { type: Type.STRING, description: "Current atmosphere description" },
    observations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of specific visible clutter issues or organizational problems"
    },
    quickWins: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        }
      },
      description: "Immediate, easy actions to improve the space"
    },
    longTermSolutions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
        }
      },
      description: "Structural or habit-based changes for lasting organization"
    }
  },
  required: ["roomType", "clutterLevel", "observations", "quickWins", "longTermSolutions"]
};

export const analyzeRoomImage = async (base64Data: string, mimeType: string, language: Language): Promise<RoomAnalysis> => {
  try {
    const languageInstruction = language === 'zh' 
      ? "Provide the response values in Simplified Chinese (zh-CN). However, keep the JSON keys in English as defined in the schema. For 'difficulty' and 'impact' ENUM values, KEEP THEM IN ENGLISH (Easy, Medium, Hard, High, Low)." 
      : "Provide the response in English.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: `Analyze this room image. Identify the room type and clutter level. 
                   Provide a list of observations about the mess or organization. 
                   Then, suggest specific 'Quick Wins' (easy tasks) and 'Long-term Solutions' (storage or habits).
                   Be encouraging but practical.
                   ${languageInstruction}`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: `You are a world-class professional organizer like Marie Kondo or The Home Edit. You provide kind, non-judgmental, but highly effective advice. ${language === 'zh' ? 'You must speak in Simplified Chinese.' : ''}`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as RoomAnalysis;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};

export const createChatSession = (language: Language) => {
  const systemInstruction = language === 'zh'
    ? "You are a helpful, encouraging, and expert home organization assistant. Help users with decluttering tips, storage ideas, and cleaning motivation. Keep answers concise and actionable. You MUST reply in Simplified Chinese."
    : "You are a helpful, encouraging, and expert home organization assistant. Help users with decluttering tips, storage ideas, and cleaning motivation. Keep answers concise and actionable.";

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction
    }
  });
};