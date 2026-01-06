import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChefHat } from "lucide-react";

type RecipeCardProps = {
  recipe: GenerateRecipeOutput;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const recipeImage = PlaceHolderImages.find(img => img.id === 'spices-1') || { imageUrl: 'https://picsum.photos/seed/recipe/600/400', imageHint: 'food ingredients' };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start gap-4">
          <ChefHat className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl text-primary">{recipe.recipeName}</CardTitle>
            <CardDescription>Here is a recipe suggestion for you.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <Image
            src={recipeImage.imageUrl}
            alt={recipe.recipeName}
            fill
            className="object-cover"
            data-ai-hint={recipeImage.imageHint}
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 list-disc list-inside text-muted-foreground">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-sm">
                {ingredient} <span className="text-xs">({recipe.ingredientLocations[index] || 'N/A'})</span>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold text-lg mb-2">Instructions</h3>
          <div className="prose prose-sm prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
            {recipe.instructions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
