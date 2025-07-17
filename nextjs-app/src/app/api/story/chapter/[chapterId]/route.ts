import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { isValidWalletAddress } from '@/lib/utils';

// Mock story chapters data
const STORY_CHAPTERS = [
  {
    id: 'chapter_1',
    chapter_number: 1,
    title: 'Der Anfang der Jagd',
    description: 'Murat erhält einen mysteriösen Hinweis über einen verlorenen Bitcoin.',
    content: `Du sitzt in deinem Büro in Herford, als plötzlich dein Computer aufleuchtet. Eine verschlüsselte Nachricht erscheint auf dem Bildschirm:

"Der verlorene Bitcoin wartet im Schatten der alten Radewiger Kirche. Aber Vorsicht - andere jagen ihn auch. Vertraue niemandem, aber vergiss nicht: Manchmal ist der größte Schatz die Reise selbst."

Dein Herz schlägt schneller. Ein verlorener Bitcoin könnte dein Leben verändern. Aber ist das ein Scherz oder wirklich echt?`,
    nft_required: false,
    choices: [
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
    ]
  },
  {
    id: 'chapter_2',
    chapter_number: 2,
    title: 'Geheimnisse der Radewiger Kirche',
    description: 'Bei der alten Kirche angekommen, entdeckst du seltsame Symbole.',
    content: `Die Radewiger Kirche liegt vor dir, alt und geheimnisvoll. Als du näher kommst, bemerkst du frische Fußspuren im Matsch. Jemand war vor dir hier.

An der Nordwand der Kirche entdeckst du ein kleines Bitcoin-Symbol, das in den Stein geritzt wurde. Daneben steht in winziger Schrift: "Wo die Sonne niemals scheint, dort liegt der Schlüssel zum Reim."

Plötzlich hörst du Schritte hinter dir...`,
    nft_required: false,
    choices: [
      {
        text: 'Sich verstecken und beobachten',
        reputation_change: 1,
        consequence: 'Du siehst einen Mann in schwarzem Mantel - ein Konkurrent!',
        next_chapter: 'chapter_3'
      },
      {
        text: 'Offen auf die Person zugehen',
        reputation_change: 2,
        consequence: 'Es ist ein alter Kirchenwächter mit hilfreichen Informationen.',
        next_chapter: 'chapter_3'
      },
      {
        text: 'Schnell nach dem Schlüssel suchen',
        reputation_change: 0,
        consequence: 'Du findest etwas, aber wirst dabei entdeckt.',
        next_chapter: 'chapter_3'
      }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { chapterId: string } }
) {
  try {
    const chapterId = params.chapterId;
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('wallet_address');

    // Validate wallet address
    if (!walletAddress || !isValidWalletAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Find chapter
    const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
    if (!chapter) {
      return NextResponse.json(
        { success: false, error: 'Chapter not found' },
        { status: 404 }
      );
    }

    // Check if user has access (NFT requirement)
    if (chapter.nft_required) {
      const db = await getDatabase();
      const nftAccess = await db.collection('nft_access').findOne({
        wallet_address: walletAddress
      });

      if (!nftAccess || !nftAccess.has_access) {
        return NextResponse.json(
          { success: false, error: 'NFT access required for this chapter' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: chapter
    });

  } catch (error) {
    console.error('Chapter fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapter' },
      { status: 500 }
    );
  }
}