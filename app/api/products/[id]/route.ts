import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const filePath = path.join(process.cwd(), 'products.json');
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(fileContent);
        
        const idAsNumber = parseInt(params.id, 10);

        const product = products.find((p: any) => p.id === idAsNumber);

        if (product) {
            return NextResponse.json(product);
        } else {
            return new NextResponse(`Product with ID ${idAsNumber} not found`, { status: 404 });
        }
    } catch (error) {
        console.error('Error reading or parsing products.json:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
