import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
    const filePath = path.join(process.cwd(), 'products.json');
    
    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const products = JSON.parse(fileContent);
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error reading or parsing products.json:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
