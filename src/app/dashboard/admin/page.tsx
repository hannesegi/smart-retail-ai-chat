'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';

type Product = {
  id: string;
  productName: string;
  quantity: string;
  rackLocation: string;
  price: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rackLocation, setRackLocation] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch products.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productName || !rackLocation || !price) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Product Name, Rack Location, and Price are required.',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName, quantity, rackLocation, price }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      
      toast({
        title: 'Success',
        description: 'Product added successfully.',
      });
      
      setProductName('');
      setQuantity('');
      setRackLocation('');
      setPrice('');
      fetchProducts(); // Refresh the list

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add product.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
    const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      toast({
        title: 'Success',
        description: 'Product deleted successfully.',
      });
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product.',
      });
    }
  };


  return (
    <main className="flex-1 p-4 md:p-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Add a new product to the inventory knowledge base.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Susu Ultra Milk Coklat 1L"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 1 Karton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rackLocation">Rack Location</Label>
              <Input
                id="rackLocation"
                value={rackLocation}
                onChange={(e) => setRackLocation(e.target.value)}
                placeholder="e.g., Rak 5A"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 15000"
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>List of all products in the knowledge base.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="h-[calc(100vh-20rem)] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.productName}<p className="text-xs text-muted-foreground">{product.quantity}</p></TableCell>
                        <TableCell>{product.rackLocation}</TableCell>
                        <TableCell>Rp{Number(product.price).toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
