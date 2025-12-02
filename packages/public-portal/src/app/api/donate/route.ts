import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createDonation } from './donate.service';

export async function GET(request: NextRequest) {
  try {
    console.log('GET request received for products');
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error in GET /api/donate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request received for donation');
    const body = await request.json();
    const { donationData, donationItems } = body;
    
    const result = await createDonation(donationData, donationItems);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/donate:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' }, 
      { status: 500 }
    );
  }
}