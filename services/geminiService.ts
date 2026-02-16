
import { GoogleGenAI } from "@google/genai";
import { EditRequest, EditResponse } from "../types";

export const editImageWithGemini = async (request: EditRequest): Promise<EditResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Extract base64 data from the data URL
    const base64Data = request.image.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: request.mimeType,
            },
          },
          {
            text: request.prompt,
          },
        ],
      },
    });

    let generatedImageUrl = '';
    
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      // If no image was returned, maybe it gave text feedback
      const textResponse = response.text || 'No image generated';
      throw new Error(`Model returned: ${textResponse}`);
    }

    return { imageUrl: generatedImageUrl };
  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    return { 
      imageUrl: '', 
      error: error.message || 'An unexpected error occurred while editing the image.' 
    };
  }
};
