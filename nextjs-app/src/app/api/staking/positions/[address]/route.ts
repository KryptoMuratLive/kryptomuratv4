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

    // Get staking positions from database
    const db = await getDatabase();
    const positions = await db.collection('staking_positions')
      .find({ wallet_address: walletAddress })
      .sort({ created_at: -1 })
      .toArray();

    // Format positions for frontend
    const formattedPositions = positions.map(position => ({
      id: position.id,
      amount: position.amount,
      duration_days: position.duration_days,
      apy: position.apy,
      status: position.status,
      created_at: position.created_at,
      end_date: position.end_date,
      rewards_earned: position.rewards_earned
    }));

    return NextResponse.json({
      success: true,
      data: formattedPositions
    });

  } catch (error) {
    console.error('Staking positions fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staking positions' },
      { status: 500 }
    );
  }
}