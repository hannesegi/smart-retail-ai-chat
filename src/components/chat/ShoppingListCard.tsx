"use client"

import { useState } from "react"
import type { GenerateShoppingListOutput } from "@/ai/flows/generate-shopping-list"
import { useAppContext } from "@/contexts/AppContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ListPlus, ShoppingCart } from "lucide-react"

type ShoppingListCardProps = {
  listItems: GenerateShoppingListOutput["shoppingListItems"]
  query: string
}

export function ShoppingListCard({ listItems, query }: ShoppingListCardProps) {
  const { addToShoppingList } = useAppContext()
  const [added, setAdded] = useState(false)

  const handleAddToList = () => {
    addToShoppingList(listItems)
    setAdded(true)
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start gap-4">
          <ShoppingCart className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <CardTitle className="font-headline text-xl text-primary">Shopping List Suggestion</CardTitle>
            <CardDescription>Based on your request: "{query}"</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {listItems.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} | Location: {item.rackLocation}</p>
              </div>
            </li>
          ))}
        </ul>
        <Button onClick={handleAddToList} disabled={added} className="w-full">
          {added ? (
            <>
              <Check className="mr-2" /> Added to List
            </>
          ) : (
            <>
              <ListPlus className="mr-2" /> Add these items to my list
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
