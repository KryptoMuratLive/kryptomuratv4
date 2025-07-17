import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { isValidWalletAddress } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet_address, chapter_id, choice_index } = body;

    // Validate input
    if (!wallet_address || !chapter_id || typeof choice_index !== 'number') {
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

    // Mock choice data (in real app, this would come from database)
    const choices = [
      {
        text: 'Sofort zur Radewiger Kirche fahren',
        reputation_change: 2,
        consequence: 'Dein Mut wird belohnt - du findest den ersten Hinweis!',
        next_chapter: 'chapter_2'
      },
      {
        text: 'Zuerst Nachforschungen anstellen',
        reputation_change: 1,
        consequence: 'Vorsicht zahlt sich aus - du sammelst wichtige Informationen.',
        next_chapter: 'chapter_2'
      },
      {
        text: 'Die Nachricht ignorieren',
        reputation_change: -1,
        consequence: 'Später bereust du diese Entscheidung...',
        next_chapter: 'chapter_2'
      }
    ];

    if (choice_index >= choices.length) {
      return NextResponse.json(
        { success: false, error: 'Invalid choice index' },
        { status: 400 }
      );
    }

    const selectedChoice = choices[choice_index];

    // Update story progress in database
    const db = await getDatabase();
    
    // Get current progress
    const currentProgress = await db.collection('story_progress').findOne({
      wallet_address
    });

    if (!currentProgress) {
      return NextResponse.json(
        { success: false, error: 'No story progress found' },
        { status: 404 }
      );
    }

    // Update progress
    const newReputationScore = currentProgress.reputation_score + selectedChoice.reputation_change;
    const newCompletedChapters = [...currentProgress.completed_chapters];
    
    if (!newCompletedChapters.includes(chapter_id)) {
      newCompletedChapters.push(chapter_id);
    }

    const choiceRecord = {
      chapter_id,
      choice_index,
      reputation_change: selectedChoice.reputation_change,
      timestamp: new Date()
    };

    await db.collection('story_progress').updateOne(
      { wallet_address },
      {
        $set: {
          reputation_score: newReputationScore,
          completed_chapters: newCompletedChapters,
          current_chapter: selectedChoice.next_chapter,
          updated_at: new Date()
        },
        $push: {
          choices_made: choiceRecord
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        choice: selectedChoice,
        reputation_change: selectedChoice.reputation_change,
        new_reputation_score: newReputationScore,
        next_chapter: selectedChoice.next_chapter
      }
    });

  } catch (error) {
    console.error('Story choice error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process story choice' },
      { status: 500 }
    );
  }
}