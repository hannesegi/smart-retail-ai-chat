import type { ReactNode } from "react";

export interface ShoppingListItem {
  id: string;
  productName: string;
  quantity: string;
  rackLocation: string;
  price?: string; // Price is optional here
  visualAids?: string;
  checked: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | ReactNode;
}

export interface GenerateRecipeOutput {
  recipeName: string;
  instructions: string;
  ingredients: string[];
  ingredientLocations: string[];
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: string;
}
