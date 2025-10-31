import { GoogleGenAI, GenerateContentParameters, Modality } from "@google/genai";

// This file centralizes all interactions with the Gemini API.
// هذا الملف يركز جميع التفاعلات مع Gemini API.

// Ensure API_KEY is available in the environment variables.
// تأكد من توفر مفتاح الواجهة البرمجية في متغيرات البيئة.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to convert a File object to a GenerativePart
// دالة مساعدة لتحويل كائن ملف إلى جزء توليدي
const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

/**
 * Generates content using the Gemini API with flexible configurations.
 * @param {string} prompt - The text prompt for the AI.
 * @param {File | undefined} file - An optional file (image, etc.) to include.
 * @param {Partial<GenerateContentParameters['config']>} config - Optional model config.
 * @returns {Promise<string>} The AI-generated text.
 */
export const generateContent = async (
  prompt: string, 
  file?: File, 
  config?: Partial<GenerateContentParameters['config']>
): Promise<string> => {
  try {
    const model = file ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash';
    
    const parts = [];
    if (file) {
      const imagePart = await fileToGenerativePart(file);
      parts.push(imagePart);
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: config,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    return "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.";
  }
};

/**
 * Generates an image using the Gemini API.
 * @param {string} prompt - The text prompt for the image generation.
 * @returns {Promise<string>} The base64 encoded image data.
 */
export const generateImageContent = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("لم يتم العثور على بيانات الصورة في الاستجابة.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("فشل في إنشاء الصورة. يرجى المحاولة مرة أخرى.");
  }
};