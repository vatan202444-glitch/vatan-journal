import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/storage';
import { categories as initialCategories, Category } from '@/data/categories';
import { verifyAdminRequest, unauthorizedResponse } from '@/lib/auth';

export async function GET() {
  try {
    const categories = readData<Category[]>('categories.json', initialCategories);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const categories = readData<Category[]>('categories.json', initialCategories);
    
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      ...body,
      articleCount: body.articleCount || 0,
    };
    
    categories.push(newCategory);
    writeData('categories.json', categories);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const body = await request.json();
    const categories = readData<Category[]>('categories.json', initialCategories);
    
    const index = categories.findIndex(c => c.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    categories[index] = { ...categories[index], ...body };
    writeData('categories.json', categories);
    
    return NextResponse.json(categories[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    
    const categories = readData<Category[]>('categories.json', initialCategories);
    const filtered = categories.filter(c => c.id !== id);
    
    writeData('categories.json', filtered);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
