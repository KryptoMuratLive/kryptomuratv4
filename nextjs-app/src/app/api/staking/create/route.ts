import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { StakingPositionSchema } from '@/types';
import { isValidWalletAddress, generateUUID, calculateEndDate, getAPYForDuration } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate wallet address
    if (!isValidWalletAddress(body.wallet_address)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Validate input data
    const amount = parseFloat(body.amount);
    const durationDays = parseInt(body.duration_days);
    
    if (amount <= 0 || ![30, 90, 180, 360].includes(durationDays)) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount or duration' },
        { status: 400 }
      );
    }

    // Calculate APY and end date
    const apy = getAPYForDuration(durationDays);
    const endDate = calculateEndDate(durationDays);

    // Create staking position
    const stakingPosition = StakingPositionSchema.parse({
      id: generateUUID(),
      wallet_address: body.wallet_address,
      amount: amount.toString(),
      duration_days: durationDays,
      apy,
      status: 'active',
      created_at: new Date(),
      end_date: endDate,
      rewards_earned: '0'
    });

    // Save to database
    const db = await getDatabase();
    await db.collection('staking_positions').insertOne(stakingPosition);

    return NextResponse.json({
      success: true,
      message: 'Staking position created successfully',
      data: stakingPosition
    });

  } catch (error) {
    console.error('Staking create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staking position' },
      { status: 500 }
    );
  }
}