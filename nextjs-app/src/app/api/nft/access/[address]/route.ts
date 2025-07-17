import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { NFTAccessSchema } from '@/types';
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

    // Connect to database
    const db = await getDatabase();
    
    // Check existing NFT access record
    let nftAccess = await db.collection('nft_access').findOne({
      wallet_address: walletAddress
    });

    if (!nftAccess) {
      // Create new NFT access record with mock data
      // In production, this would check actual NFT ownership
      const mockNftCount = Math.floor(Math.random() * 5); // 0-4 NFTs
      const accessLevel = mockNftCount === 0 ? 'none' : 
                         mockNftCount === 1 ? 'basic' : 
                         mockNftCount <= 3 ? 'premium' : 'vip';
      
      nftAccess = NFTAccessSchema.parse({
        wallet_address: walletAddress,
        has_access: mockNftCount > 0,
        nft_count: mockNftCount,
        access_level: accessLevel,
        last_checked: new Date()
      });

      await db.collection('nft_access').insertOne(nftAccess);
    } else {
      // Update last checked time
      await db.collection('nft_access').updateOne(
        { wallet_address: walletAddress },
        { $set: { last_checked: new Date() } }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        has_access: nftAccess.has_access,
        nft_count: nftAccess.nft_count,
        access_level: nftAccess.access_level,
        wallet_address: walletAddress
      }
    });

  } catch (error) {
    console.error('NFT access check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check NFT access' },
      { status: 500 }
    );
  }
}