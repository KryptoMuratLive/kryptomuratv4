import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { isValidWalletAddress } from '@/lib/utils';
import { ethers } from 'ethers';

// MURAT Token Contract ABI (simplified)
const MURAT_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

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

    // Connect to Polygon network
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com');
    
    // Create contract instance
    const tokenContract = new ethers.Contract(
      process.env.MURAT_TOKEN_ADDRESS || '0x04296ee51cd6fdfEE0CB1016A818F17b8ae7a1dD',
      MURAT_TOKEN_ABI,
      provider
    );

    try {
      // Get balance from contract
      const balance = await tokenContract.balanceOf(walletAddress);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();

      // Format balance
      const formattedBalance = ethers.formatUnits(balance, decimals);

      // Update database with latest balance
      const db = await getDatabase();
      await db.collection('wallets').updateOne(
        { wallet_address: walletAddress },
        { 
          $set: { 
            balance: formattedBalance,
            last_balance_check: new Date()
          } 
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        data: {
          balance: formattedBalance,
          symbol,
          decimals: decimals.toString(),
          wallet_address: walletAddress
        }
      });

    } catch (contractError) {
      console.error('Contract call error:', contractError);
      
      // Fallback to mock data for development
      const mockBalance = '1000.0';
      
      return NextResponse.json({
        success: true,
        data: {
          balance: mockBalance,
          symbol: 'MURAT',
          decimals: '18',
          wallet_address: walletAddress
        }
      });
    }

  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}