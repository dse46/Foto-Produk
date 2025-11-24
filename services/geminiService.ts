import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash-image';

// Helper to convert File to Base64 string (raw, without prefix)
const fileToCreatePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = reader.result.split(',')[1];
        resolve(base64Data);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateProductImage = async (
  imageFile: File,
  prompt: string,
  aspectRatio: string = '1:1'
): Promise<{ image: string | null; text: string | null }> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const base64Image = await fileToCreatePart(imageFile);
    
    // Prepare parts: Image + Text Prompt
    const parts = [
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image
        }
      },
      {
        text: prompt
      }
    ];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    let generatedImage: string | null = null;
    let generatedText: string | null = null;

    // Parse response to find image and/or text
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData) {
            generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          } else if (part.text) {
            generatedText = part.text;
          }
        }
      }
    }

    return { image: generatedImage, text: generatedText };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};