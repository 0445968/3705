import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Leads API is running',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      lead: body,
    });
  } catch (error) {
    console.error('Lead API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process lead request',
      },
      { status: 500 }
    );
  }
}
