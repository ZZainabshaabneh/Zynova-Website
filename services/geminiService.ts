import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return 'https://picsum.photos/seed/placeholder/600/600';

    } catch (error) {
        console.error("Error generating image:", error);
        return 'https://picsum.photos/seed/error/600/600';
    }
};

const productSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING, description: 'A unique identifier for the product, can be a short string.' },
        name: { type: Type.STRING, description: 'The creative and catchy name of the product.' },
        description: { type: Type.STRING, description: 'A brief, compelling description of the product (2-3 sentences).' },
        price: { type: Type.NUMBER, description: 'The price of the product in USD.' },
        imagePrompt: { type: Type.STRING, description: 'A detailed, descriptive prompt for an AI image generator to create a stunning product photo. Describe the product, setting, lighting, and style.' },
        stock: { type: Type.INTEGER, description: 'An integer representing the available stock for the product, between 5 and 50.' },
        category: { type: Type.STRING, description: 'The category this product belongs to. This should be exactly the category provided by the user.' },
    },
    required: ['name', 'description', 'price', 'imagePrompt', 'stock', 'category'],
};

// Fix: Corrected the return type signature. The function generates an `imageUrl` for each product,
// so the returned type should be `Omit<Product, 'vendorId'>[]`, not `Omit<Product, 'vendorId' | 'imageUrl'>[]`.
// This resolves the TypeScript error in `ProductGeneratorModal.tsx`.
export const generateProductIdeas = async (category: string): Promise<Omit<Product, 'vendorId'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 6 innovative and exciting product ideas for the category: "${category}". Each product should be unique and belong to this exact category.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: 'A list of 6 unique product ideas.',
                    items: productSchema,
                },
            },
        });

        const jsonText = response.text.trim();
        const generatedProducts: Omit<Product, 'imageUrl' | 'vendorId'>[] = JSON.parse(jsonText).map((p: any) => ({...p, id: p.id || `prod-${Date.now()}-${Math.random()}`}));
        
        const productsWithImages: Omit<Product, 'vendorId'>[] = [];
        for (const p of generatedProducts) {
            const imageUrl = await generateImage(p.imagePrompt);
            productsWithImages.push({
                ...p,
                imageUrl,
                category: p.category || category, // Fallback to user-provided category
            });
        }
        return productsWithImages;

    } catch (error) {
        console.error("Error generating product ideas:", error);
        throw new Error("Failed to generate product ideas from AI. Please check your API key and try again.");
    }
};

export const generateEnhancedDescription = async (name: string, keywords: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the product name "${name}" and keywords "${keywords}", write a compelling and marketable product description in 2-3 sentences.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating enhanced description:", error);
        return keywords; // Fallback to keywords if AI fails
    }
};
