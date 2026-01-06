"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash, Printer, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ShoppingListPage() {
  const { shoppingList, toggleShoppingListItem, clearShoppingList, isClient } = useAppContext();

  const handlePrint = () => {
    window.print();
  };

  if (!isClient) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 animate-pulse" />
            <p>Loading your shopping list...</p>
        </div>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Shopping List</h1>
            <p className="text-muted-foreground">
              {shoppingList.length > 0
                ? `You have ${shoppingList.length} item(s) in your list.`
                : "Your shopping list is empty."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} disabled={shoppingList.length === 0}>
              <Printer className="mr-2 h-4 w-4" /> Print List
            </Button>
            <Button variant="destructive" onClick={clearShoppingList} disabled={shoppingList.length === 0}>
              <Trash className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>

        {shoppingList.length > 0 ? (
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <ul className="divide-y">
                  {shoppingList.map((item) => {
                    const vizImage = PlaceHolderImages.find(img => img.id === item.visualAids) || null;
                    return (
                        <li
                        key={item.id}
                        className={cn(
                          "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 transition-colors hover:bg-muted/50",
                          item.checked && "bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-4 flex-1">
                            {vizImage && (
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                                    <Image src={vizImage.imageUrl} alt={item.productName} fill className="object-cover" data-ai-hint={vizImage.imageHint} />
                                </div>
                            )}
                            <div className="flex-1">
                                <span className={cn("font-medium", item.checked && "line-through text-muted-foreground")}>
                                    {item.productName}
                                </span>
                                <p className={cn("text-sm text-muted-foreground", item.checked && "line-through")}>
                                    Qty: {item.quantity} | Location: {item.rackLocation}
                                </p>
                            </div>
                        </div>
                        <Checkbox
                          checked={item.checked}
                          onCheckedChange={() => toggleShoppingListItem(item.id)}
                          id={`item-${item.id}`}
                          aria-label={`Mark ${item.productName} as complete`}
                          className="h-5 w-5"
                        />
                      </li>
                    )
                  })}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex h-96 flex-col items-center justify-center rounded-lg border-2 border-dashed">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Go to the chat to add items to your list.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
