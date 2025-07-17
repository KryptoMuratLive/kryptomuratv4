import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { WalletSchema } from '@/types';
import { isValidWalletAddress } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = WalletSchema.parse(body);
    
    // Additional validation
    if (!isValidWalletAddress(validatedData.wallet_address)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    
    // Check if wallet already exists
    const existingWallet = await db.collection('wallets').findOne({
      wallet_address: validatedData.wallet_address
    });

    if (existingWallet) {
      // Update existing wallet
      await db.collection('wallets').updateOne(
        { wallet_address: validatedData.wallet_address },
        { 
          $set: { 
            connected_at: new Date(),
            chain_id: validatedData.chain_id 
          } 
        }
      );
    } else {
      // Create new wallet entry
      await db.collection('wallets').insertOne({
        ...validatedData,
        connected_at: new Date(),
        created_at: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        wallet_address: validatedData.wallet_address,
        chain_id: validatedData.chain_id
      }
    });

  } catch (error) {
    console.error('Wallet connect error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}