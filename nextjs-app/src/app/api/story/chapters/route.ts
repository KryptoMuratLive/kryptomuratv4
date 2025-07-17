import { NextRequest, NextResponse } from 'next/server';
import { StoryChapter } from '@/types';

const STORY_CHAPTERS: StoryChapter[] = [
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
        consequence: 'Dein Mut wird belohnt - du findest den ersten Hinweis!'
      },
      {
        text: 'Zuerst Nachforschungen anstellen',
        reputation_change: 1,
        consequence: 'Vorsicht zahlt sich aus - du sammelst wichtige Informationen.'
      },
      {
        text: 'Die Nachricht ignorieren',
        reputation_change: -1,
        consequence: 'Später bereust du diese Entscheidung...'
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
        consequence: 'Du siehst einen Mann in schwarzem Mantel - ein Konkurrent!'
      },
      {
        text: 'Offen auf die Person zugehen',
        reputation_change: 2,
        consequence: 'Es ist ein alter Kirchenwächter mit hilfreichen Informationen.'
      },
      {
        text: 'Schnell nach dem Schlüssel suchen',
        reputation_change: 0,
        consequence: 'Du findest etwas, aber wirst dabei entdeckt.'
      }
    ]
  },
  {
    id: 'chapter_3',
    chapter_number: 3,
    title: 'Der Keller der Wahrheit',
    description: 'Ein geheimer Kellerraum offenbart die nächste Spur.',
    content: `"Wo die Sonne niemals scheint" - natürlich! Der Keller der Kirche. Du findest einen versteckten Eingang hinter dem Altar.

Im Keller ist es stockfinster. Deine Handy-Taschenlampe erhellt alte Steinwände. Auf dem Boden findest du ein altes Smartphone mit einem QR-Code auf dem Display.

Der QR-Code führt zu einer Krypto-Wallet-Adresse. Aber das ist nicht alles - daneben liegt ein Zettel: "Die Wahrheit liegt in der Blockchain. Suche Block 680.000. Aber hüte dich vor den Schatten."`,
    nft_required: true,
    choices: [
      {
        text: 'Sofort die Blockchain durchsuchen',
        reputation_change: 3,
        consequence: 'Du findest wichtige Transaktionsdaten!'
      },
      {
        text: 'Das Smartphone mitnehmen',
        reputation_change: 1,
        consequence: 'Das Gerät könnte später nützlich sein.'
      },
      {
        text: 'Den Keller schnell verlassen',
        reputation_change: -1,
        consequence: 'Du verpasst wichtige Hinweise.'
      }
    ]
  },
  {
    id: 'chapter_4',
    chapter_number: 4,
    title: 'Die finale Jagd',
    description: 'Alle Hinweise führen zum dramatischen Finale.',
    content: `Block 680.000 - du hast es geschafft! Die Blockchain-Analyse zeigt eine Transaktion zu einer Wallet-Adresse in Herford. Die Koordinaten führen dich zum alten Wasserturm.

Am Wasserturm angekommen, siehst du eine Gruppe von Personen. Andere Bitcoin-Jäger! Sie haben die gleichen Hinweise verfolgt.

Plötzlich erscheint eine Nachricht auf deinem Handy: "Der wahre Schatz war nie der Bitcoin. Es war die Gemeinschaft, die ihr aufgebaut habt. Teilt den Schatz oder verliert ihn für immer."

Vor dir liegt ein Hardware-Wallet...`,
    nft_required: true,
    choices: [
      {
        text: 'Den Schatz mit allen teilen',
        reputation_change: 5,
        consequence: 'Du wirst zum Anführer der Herford Crypto Community!'
      },
      {
        text: 'Den Schatz heimlich an dich nehmen',
        reputation_change: -3,
        consequence: 'Der Schatz verschwindet und du stehst allein da.'
      },
      {
        text: 'Einen Kompromiss vorschlagen',
        reputation_change: 3,
        consequence: 'Alle sind zufrieden und ihr gründet eine DAO!'
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    // Return public information about all chapters
    const publicChapters = STORY_CHAPTERS.map(chapter => ({
      id: chapter.id,
      chapter_number: chapter.chapter_number,
      title: chapter.title,
      description: chapter.description,
      nft_required: chapter.nft_required
    }));

    return NextResponse.json({
      success: true,
      data: publicChapters
    });

  } catch (error) {
    console.error('Story chapters fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch story chapters' },
      { status: 500 }
    );
  }
}