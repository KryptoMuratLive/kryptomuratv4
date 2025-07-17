import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { TelegramSubscriptionSchema } from '@/types';
import { isValidWalletAddress } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, chat_id } = body;

    // Validate input
    if (!wallet_address || !chat_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!isValidWalletAddress(wallet_address)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    
    // Check if subscription already exists
    const existingSubscription = await db.collection('telegram_subscriptions').findOne({
      wallet_address: wallet_address,
      chat_id: chat_id
    });

    if (existingSubscription) {
      // Update existing subscription
      await db.collection('telegram_subscriptions').updateOne(
        { wallet_address: wallet_address, chat_id: chat_id },
        { 
          $set: { 
            subscribed: true,
            updated_at: new Date()
          } 
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Telegram subscription updated successfully'
      });
    }

    // Create new subscription
    const subscription = TelegramSubscriptionSchema.parse({
      wallet_address,
      chat_id,
      subscribed: true,
      notifications: {
        staking: true,
        streams: true,
        story: true,
        general: true
      },
      created_at: new Date(),
      updated_at: new Date()
    });

    await db.collection('telegram_subscriptions').insertOne(subscription);

    return NextResponse.json({
      success: true,
      message: 'Telegram subscription created successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Telegram subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create telegram subscription' },
      { status: 500 }
    );
  }
}