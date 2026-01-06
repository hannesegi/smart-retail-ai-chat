import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs/promises';

export const maxDuration = 30;

// Create an OpenAI API client (that's pointed to OpenRouter)
const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

type Product = {
  id: string;
  productName: string;
  quantity: string;
  rackLocation: string;
  price: string;
};

// Helper function to read products from the local JSON file
async function getProducts(): Promise<Product[]> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'products.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    // If the file is empty, JSON.parse will fail. Return an empty array.
    if (!fileContent.trim()) {
      return [];
    }
    return JSON.parse(fileContent);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return []; // File doesn't exist, return empty array.
    }
    console.error('Error reading products.json:', error);
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { messages, mode }: { messages: { role: 'user' | 'assistant'; content: string }[], mode: 'inquiry' | 'recipe' | 'list' } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;
    
    let systemPrompt = '';
    const model = 'deepseek/deepseek-chat';

    switch (mode) {
      case 'list':
        systemPrompt = `You are a shopping assistant. Create a shopping list based on the user's request.
          Format the output as a single, valid JSON object with a key "shoppingListItems" which is an array of objects.
          Each object must have "productName", "quantity", and "rackLocation".
          If the rack location is unknown, respond with 'Unknown'. Do not include any other text, explanation, or markdown formatting.`;
        break;
      
      case 'recipe':
        systemPrompt = `You are a recipe assistant. Generate a recipe based on the user's request.
          The output must be a single, valid JSON object with keys: "recipeName", "instructions", "ingredients", and "ingredientLocations".
          The "ingredients" and "ingredientLocations" must be arrays of strings of the same length. For locations, use general store areas.
          Do not include any other text, explanation, or markdown formatting.`;
        break;
      
      case 'inquiry':
      default:
        const products = await getProducts();
        const productKnowledge = products.length > 0 
            ? products.map(p => `- ${p.productName} is in ${p.rackLocation} and costs Rp${Number(p.price).toLocaleString('id-ID')}.`).join('\n')
            : "No product information available.";

        systemPrompt = `You are a helpful AI assistant in a grocery store. Answer in Indonesian.
          
          Here is some internal product knowledge:
          ${productKnowledge}
          
          When a customer asks for product location, price, or availability, use the information above to answer.
          If the product is not on the list, state that you are unsure but will ask a store employee. Be friendly and helpful.`;
        break;
    }

    const response = await openrouter.chat.completions.create({
        model: model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
    });
    
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);

  } catch (error) {
    console.error("Error handling user inquiry:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: "I'm sorry, but I encountered an error while processing your request. Please try again.", details: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
