import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { isValidWalletAddress } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const walletAddress = params.address;

    // Validate wallet address
    if (!isValidWalletAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Get story progress from database
    const db = await getDatabase();
    const progress = await db.collection('story_progress').findOne({
      wallet_address: walletAddress
    });

    if (!progress) {
      return NextResponse.json({
        success: false,
        error: 'No story progress found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Story progress fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story progress' },
      { status: 500 }
    );
  }
}