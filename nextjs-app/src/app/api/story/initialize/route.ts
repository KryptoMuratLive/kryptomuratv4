import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { StoryProgressSchema } from '@/types';
import { isValidWalletAddress, generateUUID } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet_address');

    // Validate wallet address
    if (!walletAddress || !isValidWalletAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Connect to database
    const db = await getDatabase();
    
    // Check if user already has progress
    const existingProgress = await db.collection('story_progress').findOne({
      wallet_address: walletAddress
    });

    if (existingProgress) {
      return NextResponse.json({
        success: true,
        message: 'Story already initialized',
        data: existingProgress
      });
    }

    // Create new story progress
    const storyProgress = StoryProgressSchema.parse({
      wallet_address: walletAddress,
      current_chapter: 'chapter_1',
      completed_chapters: [],
      story_path: 'default',
      reputation_score: 0,
      choices_made: [],
      created_at: new Date(),
      updated_at: new Date()
    });

    // Save to database
    await db.collection('story_progress').insertOne(storyProgress);

    return NextResponse.json({
      success: true,
      message: 'Story initialized successfully',
      data: storyProgress
    });

  } catch (error) {
    console.error('Story initialization error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize story' },
      { status: 500 }
    );
  }
}