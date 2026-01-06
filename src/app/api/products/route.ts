import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

type Product = {
  id: string;
  productName: string;
  quantity: string;
  rackLocation: string;
  price: string;
};

// Define the path to the products.json file
const productsFilePath = path.join(process.cwd(), 'src', 'lib', 'products.json');

// Helper function to read products from the file
async function readProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(productsFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write products to the file
async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
}

// GET handler to fetch all products
export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to read products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to add a new product
export async function POST(req: NextRequest) {
  try {
    const { productName, quantity, rackLocation, price } = await req.json();

    if (!productName || !rackLocation || !price) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const products = await readProducts();
    const newProduct: Product = {
      id: Date.now().toString(),
      productName,
      quantity,
      rackLocation,
      price,
    };

    products.push(newProduct);
    await writeProducts(products);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to add product:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler to remove a product
export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
        }

        const products = await readProducts();
        const updatedProducts = products.filter((product) => product.id !== id);

        if (products.length === updatedProducts.length) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        await writeProducts(updatedProducts);

        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Failed to delete product:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
