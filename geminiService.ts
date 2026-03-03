
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Question } from "../types";

const LANGUAGE_NAMES = {
  am: "Amharic (አማርኛ)",
  om: "Afan Oromo (Oromoo)",
  en: "English"
};

export const askTutor = async (question: string, language: Language = 'en', context?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context || 'General Education'}\nQuestion: ${question}`,
      config: {
        systemInstruction: `You are IFTU AI, the official digital tutor for the Ethiopian National Curriculum (EAES Standards). 
        You MUST support the following languages: English, Amharic, and Afan Oromo.
        The student is currently using ${LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || 'English'}.`,
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, the connection to the National AI Lab was interrupted.";
  }
};

export const getRegionalIntelligence = async (region: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a detailed educational status report for the region of ${region}, Ethiopia. Include mapping of 3 major TVET hubs and secondary school density metrics.`,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
      }
    });
    
    const insights = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text,
      mapData: insights
    };
  } catch (error) {
    console.error("Intelligence Error:", error);
    return null;
  }
};

export const fetchLatestEducationNews = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "What are the latest news updates from the Ethiopian Ministry of Education (MoE) regarding national exams and TVET for 2025?",
      config: { tools: [{ googleSearch: {} }] }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title || "Official Update",
        uri: chunk.web?.uri || "#"
      })) || []
    };
  } catch (error) { return null; }
};

export const getLessonDeepDive = async (text: string, type: 'simpler' | 'advanced', language: Language = 'en') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = type === 'simpler' ? `Simpler explanation of: ${text}` : `Advanced technical context for: ${text}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: `Explain in ${LANGUAGE_NAMES[language as keyof typeof LANGUAGE_NAMES] || 'English'}.` }
    });
    return response.text;
  } catch (error) { return "Deep dive failed."; }
};

export const parseExamDocument = async (text: string): Promise<Partial<Question>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Extract multiple-choice questions from: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              points: { type: Type.INTEGER },
              category: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "points", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return []; }
};

export const generateExamQuestions = async (subject: string, topic: string, difficulty: string, count: number = 5): Promise<Partial<Question>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate ${count} questions for Subject: ${subject}, Topic: ${topic}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER },
              points: { type: Type.INTEGER },
              category: { type: Type.STRING }
            },
            required: ["text", "options", "correctAnswer", "points", "category"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) { return []; }
};

export const findNearbyColleges = async (lat: number, lng: number, type: 'TVET' | 'High School' = 'TVET') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `List 5 prominent ${type} institutions near lat: ${lat}, lng: ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
      }
    });
    return {
      text: response.text,
      places: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.maps?.title || "Educational Institution",
        uri: chunk.maps?.uri || "#",
        snippet: chunk.maps?.placeAnswerSources?.[0]?.reviewSnippets?.[0] || ""
      })) || []
    };
  } catch (error) { return null; }
};
